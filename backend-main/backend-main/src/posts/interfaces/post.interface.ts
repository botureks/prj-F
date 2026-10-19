import { UserEntity } from '../../users/entities/user.entity';

export interface IPost {
  id: string;
  author: UserEntity;
  title: string;
  topic: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
