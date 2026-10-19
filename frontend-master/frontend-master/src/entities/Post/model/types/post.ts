import { UserEntity } from "src/shared/api/generated/graphql";
import { TagModel } from "src/entities/Tag/model/types/tag";

export interface PostModel {
    id: string;
    author: UserEntity;
    title: string;
    topic: string;
    content: string;
    tags: TagModel[];
    createdAt: string;
    updatedAt: string;
    editedAt?: string | null;
    isEdited: boolean;
}
