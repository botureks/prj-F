import { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";

import { CommentEntity } from "src/shared/api/generated/graphql";

import { UserCard } from "src/shared/ui/Cards/UserCard";
import { Button } from "src/shared/ui/Button";
import { Textarea } from "src/shared/ui/Textarea";

import UPDATE_COMMENT from "src/entities/Comment/api/gql/update-comment.model";
import DELETE_COMMENT from "src/entities/Comment/api/gql/delete-comment.module";

import { getAuth } from "src/entities/Auth/model/selectors/getAuth/getAuth";
import { UserRole } from "src/entities/User/model/types/user";
import { useToast } from "src/shared/lib/hooks/useToast";

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
    const toast = useToast();


    const [isEditMode, setIsEditMode] = useState(false);

    const [text, setText] = useState(
        comment.content.replace(/<br\/>/g, "\n")
    );


    const [updateComment, { loading }] = useMutation(
        UPDATE_COMMENT
    );
    const [deleteComment, { loading: isDeleting }] = useMutation(DELETE_COMMENT);


    const isAuthor = auth.user?.id === comment.author.id;
    const isAdmin = auth.user?.role === UserRole.ADMIN;
    const canDelete = isAuthor || isAdmin;


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


        const formattedText = text.replace(
            /\n/g,
            "<br/>"
        );


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
        setText(
            comment.content.replace(/<br\/>/g, "\n")
        );

        setIsEditMode(false);
    };


    const removeComment = async () => {
        if (!window.confirm("Удалить комментарий?")) {
            return;
        }

        try {
            await deleteComment({ variables: { id: comment.id } });
            await refetchComments();
            toast.success({ message: "Комментарий удалён" });
        } catch {
            toast.error({ message: "Не удалось удалить комментарий" });
        }
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
                                    disabled={loading}
                                    onClick={cancelEdit}
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


            {
                canDelete && !isEditMode && (
                    <Button
                        size="sm"
                        variant="bordered"
                        loading={isDeleting}
                        onClick={removeComment}
                    >
                        Удалить
                    </Button>
                )
            }

            {
                comment.isEdited && (
                    <span>
                        изменено
                    </span>
                )
            }

        </div>
    );
};