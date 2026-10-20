import { UserRole } from '../enums/user-role.enum';
import { ICredentials } from './credentials.interface';

export interface IUser {
  id: string;
  username: string;
  password: string;
  description?: string | null;
  role: UserRole;
  isBlocked: boolean;
  credentials: ICredentials;
  createdAt: Date;
  updatedAt: Date;
}