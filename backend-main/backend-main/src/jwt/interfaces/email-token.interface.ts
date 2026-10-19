import { ITokenBase } from './token-base.interface';

export interface IEmailPayload {
  id: string;
  version: number;
}

export interface IEmailToken extends IEmailPayload, ITokenBase {}
