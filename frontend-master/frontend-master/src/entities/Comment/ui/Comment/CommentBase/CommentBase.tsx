import { useState } from "react";
import { useSelector } from "react-redux";

import { CommentEntity } from "src/shared/api/generated/graphql";

import { UserCard } from "src/shared/ui/Cards/UserCard";

import { getAuth } from "src/entities/Auth/model/selectors/getAuth/getAuth";

import cls from "./CommentBase.module.less";

interface CommentBaseProps {
    comment: CommentEntity
}

export const CommentBase = (props: CommentBaseProps) => {
    const { comment } = props;

    const auth = useSelector(getAuth);

    const [isEditMode, setIsEditMode] = useState(false);

    const isAuthor = auth.user?.id === comment.author.id;

    return (
        <div className={ cls.CommentBase }>
            <UserCard
                user={ comment.author }
                time={ comment.createdAt }
                size="sm"
            />

            {
                isAuthor && (
                    <button
                        onClick={() => setIsEditMode(true)}
                    >
                        Редактировать
                    </button>
                )
            }

            <div className={ cls.CommentContent }>
                { comment.content }
            </div>
        </div>
    )
}