import { UserEntity } from '../../users/entities/user.entity';

export interface IComment {
  id: string;
  postId: string;
  author: UserEntity;
  replyTo?: string;
  content: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
