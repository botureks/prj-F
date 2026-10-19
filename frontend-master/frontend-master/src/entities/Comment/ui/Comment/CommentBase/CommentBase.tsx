import { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";

import { CommentEntity } from "src/shared/api/generated/graphql";

import { UserCard } from "src/shared/ui/Cards/UserCard";
import { Textarea } from "src/shared/ui/Textarea";
import { Button } from "src/shared/ui/Button";

import UPDATE_COMMENT from "src/entities/Comment/api/gql/update-comment.model";

import { getAuth } from "src/entities/Auth/model/selectors/getAuth/getAuth";

import cls from "./CommentBase.module.less";

interface CommentBaseProps {
    comment: CommentEntity;
    refetchComments: () => void;
}

export const CommentBase = (props: CommentBaseProps) => {
    const {
        comment,
        refetchComments
    } = props;

    const auth = useSelector(getAuth);

    const [isEditMode, setIsEditMode] = useState(false);

    const [text, setText] = useState(comment.content);

    const [updateComment, { loading }] = useMutation(UPDATE_COMMENT);

    const isAuthor = auth.user?.id === comment.author.id;


    const updateText = (
        event: ChangeEvent<HTMLTextAreaElement>
    ) => {
        setText(event.target.value);
    };


    const saveEdit = async () => {
        if (
            text.length === 0 ||
            text.length > 200
        ) {
            return;
        }

        const formattedText = text.replace(/\n/g, "<br/>");

        await updateComment({
            variables: {
                id: comment.id,
                content: formattedText
            }
        });

        await refetchComments();

        setIsEditMode(false);
    };


    const cancelEdit = () => {
        setText(comment.content);
        setIsEditMode(false);
    };


    return (
        <div className={cls.CommentBase}>
            <UserCard
                user={comment.author}
                time={comment.createdAt}
                size="sm"
            />

            {
                isAuthor && !isEditMode && (
                    <button
                        onClick={() => setIsEditMode(true)}
                    >
                        Редактировать
                    </button>
                )
            }


            {
                isEditMode ? (
                    <Textarea
                        value={text}
                        onChange={updateText}
                        footer={
                            <>
                                <Button
                                    size="sm"
                                    loading={loading}
                                    onClick={saveEdit}
                                >
                                    Сохранить
                                </Button>

                                <Button
                                    size="sm"
                                    onClick={cancelEdit}
                                    disabled={loading}
                                >
                                    Отмена
                                </Button>
                            </>
                        }
                    />
                ) : (
                    <div className={cls.CommentContent}>
                        {comment.content}
                    </div>
                )
            }
        </div>
    );
};