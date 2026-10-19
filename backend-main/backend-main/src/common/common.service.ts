import { Dictionary, FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { EntityRepository, QueryBuilder } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';

import { validate } from 'class-validator';

import slugify from 'slugify';

import { v4 as uuidV4 } from 'uuid';

import { ChangeTypeEnum } from './enums/change-type.enum';
import { CursorTypeEnum } from './enums/cursor-type.enum';

import {
  getOppositeOrder,
  getQueryOrder,
  QueryOrderEnum,
  tOppositeOrder,
  tOrderEnum
} from './enums/query-order.enum';

import { IChange } from './interfaces/change.interface';

import { IEdge, IPaginated } from './interfaces/paginated.interface';

import { isNull, isUndefined } from './utils/validation.util';

@Injectable()
export class CommonService {
  /**
   * Takes a date, string or number and returns the base 64
   * representation of it
   */
  private static encodeCursor(
    val: Date | string | number,
    key: string
  ): string {
    let str: string;

    if (val instanceof Date) {
      str = val.getTime().toString();
    } else if (typeof val === 'number' || typeof val === 'bigint') {
      str = val.toString();
    } else {
      str = val;
    }

    return Buffer.from(`${str}:${key}`, 'utf-8').toString('base64');
  }

  /**
   * Takes an instance, the cursor key and a innerCursor,
   * and generates a GraphQL edge
   */
  private static createEdge<T>(
    instance: T,
    cursor: keyof T,
    cursorId: keyof T | null,
    innerCursor?: string
  ): IEdge<T> {
    try {
      return {
        node: instance,
        cursor: CommonService.encodeCursor(
          innerCursor ? instance[cursor][innerCursor] : instance[cursor],
          instance['id']
        )
      };
    } catch (_) {
      throw new InternalServerErrorException('The given cursor is invalid');
    }
  }

  private static getOrderBy<T>(
    cursor: keyof T,
    order: QueryOrderEnum,
    innerCursor?: string
  ): QueryOrderMap<T> {
    if (innerCursor) {
      return {
        [cursor]: {
          [innerCursor]: order
        }
      } as QueryOrderMap<T>;
    } else {
      return {
        [cursor]: order
      } as QueryOrderMap<T>;
    }
  }

  /**
   * Gets the where clause filter logic for the query builder pagination
   */
  private static getFilters<T>(
    cursor: keyof T,
    decoded: string | number | Date,
    order: tOrderEnum | tOppositeOrder,
    innerCursor?: string
  ): FilterQuery<Dictionary<T>> {
    return innerCursor
      ? {
          [cursor]: {
            [innerCursor]: {
              [order]: decoded
            }
          }
        }
      : {
          [cursor]: {
            [order]: decoded
          }
        };
  }

  /**
   * Takes an entity array and returns the paginated type of that entity array
   * It uses cursor pagination as recommended in https://relay.dev/graphql/connections.htm
   */
  public paginate<T>(
    instances: T[],
    currentCount: number,
    previousCount: number,
    cursor: keyof T,
    cursorId: keyof T | null,
    first: number,
    innerCursor?: string,
    hasNextPage?: boolean,
    hasPreviousPage?: boolean
  ): IPaginated<T> {
    const pages: IPaginated<T> = {
      currentCount,
      previousCount,
      edges: [],
      pageInfo: {
        endCursor: '',
        startCursor: '',
        hasPreviousPage: false,
        hasNextPage: false
      }
    };

    const len = instances.length;

    if (len > 0) {
      for (let i = 0; i < len; i++) {
        pages.edges.push(
          CommonService.createEdge(instances[i], cursor, cursorId, innerCursor)
        );
      }
      pages.pageInfo.startCursor = pages.edges[0].cursor;
      pages.pageInfo.endCursor = pages.edges[len - 1].cursor;

      if (hasNextPage === undefined && hasPreviousPage === undefined) {
        pages.pageInfo.hasNextPage = currentCount > first;
        pages.pageInfo.hasPreviousPage = previousCount > 0;
      } else {
        pages.pageInfo.hasNextPage = hasNextPage;
        pages.pageInfo.hasPreviousPage = hasPreviousPage;
      }
    }

    return pages;
  }

  /**
   * Takes a base64 cursor and returns the string or number value
   */
  public decodeCursor(
    cursor: string,
    cursorType: CursorTypeEnum = CursorTypeEnum.STRING
  ): [string | number | Date, string] {
    const data = Buffer.from(cursor, 'base64').toString('utf-8').split(':');
    const str = data[0];
    const id = data[1] ?? '';

    switch (cursorType) {
      case CursorTypeEnum.DATE:
        const milliUnix = parseInt(str, 10);

        if (isNaN(milliUnix))
          throw new BadRequestException(
            'Cursor does not reference a valid date'
          );

        return [new Date(milliUnix), id];
      case CursorTypeEnum.NUMBER:
        const num = parseInt(str, 10);

        if (isNaN(num))
          throw new BadRequestException(
            'Cursor does not reference a valid number'
          );

        return [num, id];
      case CursorTypeEnum.STRING:
      default:
        return [str, id];
    }
  }

  /**
   * Takes a query builder and returns the entities paginated
   */
  public async queryBuilderPagination<T extends Dictionary>(
    alias: string,
    cursor: keyof T,
    cursorType: CursorTypeEnum,
    cursorId: keyof T | null,
    first: number,
    order: QueryOrderEnum,
    qb: QueryBuilder<T>,
    after?: string,
    innerCursor?: string
  ): Promise<IPaginated<T>> {
    const strCursor = String(cursor);
    const aliasCursor = `${alias}.${strCursor}`;
    let prevCount = 0;

    if (cursorId === null) {
      cursorId = strCursor;
    }

    let count;
    let entities;

    if (after) {
      const decoded = this.decodeCursor(after, cursorType);

      if (cursorType !== CursorTypeEnum.NUMBER) {
        const oppositeOd = getOppositeOrder(order);
        const tempQb = qb.clone();

        const filters = {
          [cursor]: { [oppositeOd]: decoded[0] }
        };

        tempQb.andWhere(filters);
        prevCount = await tempQb.count(aliasCursor, false);

        const normalOd = getQueryOrder(order);

        qb.andWhere(
          CommonService.getFilters(cursor, decoded[0], normalOd, innerCursor)
        );
      } else {
        const cqb_1 = qb.clone();

        const [c_entities] = await this.throwInternalError(
          Promise.all([
            cqb_1
              .select(`${alias}.*`)
              .orderBy(CommonService.getOrderBy(cursor, order, innerCursor))
              .getResult()
          ])
        );

        c_entities.reverse();

        const index = c_entities.findIndex(
          (entity) => entity.id === decoded[1]
        );

        if (index !== -1) {
          const startIndex = Math.max(index - first, 0);
          const endIndex = Math.min(index + 1, c_entities.length);

          entities = c_entities
            .slice(startIndex, endIndex)
            .filter((entity) => entity.id !== decoded[1])
            .reverse();

          count = entities.length;

          const hasPreviousPage = endIndex > entities.length;
          const hasNextPage = startIndex > 0;

          return this.paginate(
            entities,
            count,
            prevCount,
            cursor,
            cursorId,
            first,
            innerCursor,
            hasNextPage,
            hasPreviousPage
          );
        } else {
          throw new BadRequestException();
        }
      }
    }

    const cqb = qb.clone();

    [count, entities] = await this.throwInternalError(
      Promise.all([
        cqb.count(aliasCursor, false),
        qb
          .select(`${alias}.*`)
          .orderBy(CommonService.getOrderBy(cursor, order, innerCursor))
          .limit(first)
          .getResult()
      ])
    );

    return this.paginate(
      entities,
      count,
      prevCount,
      cursor,
      cursorId,
      first,
      innerCursor
    );
  }

  /**
   * Takes an entity repository and a FilterQuery and returns the paginated
   * entities
   */
  public async findAndCountPagination<T extends Dictionary>(
    cursor: keyof T,
    first: number,
    order: QueryOrderEnum,
    repo: EntityRepository<T>,
    where: FilterQuery<T>,
    after?: string,
    afterCursor: CursorTypeEnum = CursorTypeEnum.STRING,
    innerCursor?: string
  ): Promise<IPaginated<T>> {
    let previousCount = 0;

    if (after) {
      const decoded = this.decodeCursor(after, afterCursor);
      const queryOrder = getQueryOrder(order);
      const oppositeOrder = getOppositeOrder(order);
      const countWhere = where;
      countWhere['$and'] = CommonService.getFilters(
        'createdAt',
        decoded[0],
        oppositeOrder,
        innerCursor
      );
      previousCount = await repo.count(countWhere);
      where['$and'] = CommonService.getFilters(
        'createdAt',
        decoded[0],
        queryOrder,
        innerCursor
      );
    }

    const [entities, count] = await this.throwInternalError(
      repo.findAndCount(where, {
        orderBy: CommonService.getOrderBy(cursor, order, innerCursor),
        limit: first
      })
    );

    return this.paginate(
      entities,
      count,
      previousCount,
      cursor,
      cursor,
      first,
      innerCursor
    );
  }

  /**
   * Generates an entity change notification. This is useful for realtime apps only.
   */
  public generateChange<T>(
    entity: T,
    nType: ChangeTypeEnum,
    cursor: keyof T,
    innerCursor?: string
  ): IChange<T> {
    return {
      edge: CommonService.createEdge(entity, cursor, cursor, innerCursor),
      type: nType
    };
  }

  /**
   * Takes a string trims it and capitalizes every word
   */
  public formatTitle(title: string): string {
    return title
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
  }

  /**
   * Takes a string trims it and makes it lower case to be used in ILike
   */
  public formatSearch(search: string): string {
    return `%${search
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .toLowerCase()}%`;
  }

  /**
   * Takes a string and generates a slug with dots as word separators
   */
  public generatePointSlug(str: string): string {
    return slugify(str, { lower: true, replacement: '.', remove: /['_\.]/g });
  }

  /**
   * Takes a string and generates a slug with a unique identifier at the end
   */
  public generateSlug(str: string): string {
    return slugify(`${str} ${uuidV4().substring(0, 6)}`, {
      lower: true,
      remove: /['_\.]/g
    });
  }

  public checkEntityExistence<T extends Dictionary>(
    entity: T | null | undefined,
    name: string
  ): void {
    if (isNull(entity) || isUndefined(entity)) {
      throw new NotFoundException(`${name} not found`);
    }
  }

  /**
   * Validates an entity with the class-validator library
   */
  public async validateEntity(entity: Dictionary): Promise<void> {
    const errors = await validate(entity);

    if (errors.length > 0) {
      console.error(errors);
      throw new BadRequestException('Entity validation failed');
    }
  }

  //-------------------- Entity Actions --------------------

  /**
   * Validates, saves and flushes entity into the DB
   */
  public async saveEntity<T extends Dictionary>(
    repo: EntityRepository<T>,
    entity: T,
    isNew = false
  ): Promise<void> {
    await this.validateEntity(entity);

    if (isNew) repo.getEntityManager().persist(entity);

    await this.throwDuplicateError(repo.getEntityManager().flush());
  }

  /**
   * Removes an entity from the DB.
   */
  public async removeEntity<T extends Dictionary>(
    repo: EntityRepository<T>,
    entity: T
  ): Promise<void> {
    await this.throwInternalError(
      repo.getEntityManager().removeAndFlush(entity)
    );
  }

  //-------------------- Error Handling --------------------

  /**
   * Checks is an error is of the code 23505, PostgreSQL's duplicate value error,
   * and throws a conflict exception
   */
  public async throwDuplicateError<T>(
    promise: Promise<T>,
    message?: string
  ): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException(message ?? 'Duplicated value in database');
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Function to abstract throwing internal server exception
   */
  public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public formatName(title: string): string {
    return title
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
  }
}
