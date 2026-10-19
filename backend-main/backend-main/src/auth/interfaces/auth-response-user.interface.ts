import { UserRole } from '../../users/enums/user-role.enum';

export interface IAuthResponseUser {
  id: string;
  username: string;
  role: UserRole;
}
