import { ChangeTypeEnum } from '../enums/change-type.enum';

import { IEdge } from './paginated.interface';

export interface IChange<T> {
  readonly type: ChangeTypeEnum;
  readonly edge: IEdge<T>;
}
