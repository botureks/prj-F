import { UserRole } from '../../users/enums/user-role.enum';
import { ITokenBase } from './token-base.interface';

export interface IAccessPayload {
  id: string;
  role: UserRole;
}

export interface IAccessToken extends IAccessPayload, ITokenBase {}
