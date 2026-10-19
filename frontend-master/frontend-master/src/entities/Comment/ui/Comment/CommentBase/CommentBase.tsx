import { CommentEntity } from "src/shared/api/generated/graphql";

import { UserCard } from "src/shared/ui/Cards/UserCard";

import cls from "./CommentBase.module.less";

interface CommentBaseProps {
    comment: CommentEntity
}

export const CommentBase = (props: CommentBaseProps) => {
    const { comment } = props;

    return (
        <div className={ cls.CommentBase }>
            <UserCard
                user={ comment.author }
                time={ comment.createdAt }
                size="sm"
            />

            <div className={ cls.CommentContent }>
                { comment.content }
            </div>
        </div>
    )
}