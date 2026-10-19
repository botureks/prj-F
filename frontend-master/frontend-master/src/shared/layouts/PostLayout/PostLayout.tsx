import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import { Post } from "src/entities/Post/ui/Post";
import { PostModel } from "src/entities/Post/model/types/post";
import { TagBadge } from "src/entities/Tag/ui/TagBadge";

import { Border } from "src/shared/ui/Border";

import { CommentArea } from "src/features/sendComment/ui/CommentArea";
import { CommentsSection } from "src/entities/Comment/ui/CommentsSection";
import { EditorModal } from "src/features/createPost/ui/EditorModal";

import { getAuth } from "src/entities/Auth/model/selectors/getAuth/getAuth";
import { UserRole } from "src/entities/User/model/types/user";
import DELETE_POST from "src/entities/Post/api/gql/delete-post.model";
import GET_POSTS from "src/entities/Post/api/gql/get-posts.model";
import { useToast } from "src/shared/lib/hooks/useToast";
import { PostUserMetadata } from "src/entities/Post/ui/PostUserMetadata/PostUserMetadata";

import cls from "./PostLayout.module.less";

interface PostLayoutProps {
    post: PostModel;
}

export const PostLayout = ({ post }: PostLayoutProps) => {
    const auth = useSelector(getAuth);
    const router = useRouter();
    const toast = useToast();
    const [deletePost, { loading: isDeleting }] = useMutation(DELETE_POST);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const isAuthor = auth.user?.id === post.author.id;
    const isAdmin = auth.user?.role === UserRole.ADMIN;
    const canDelete = isAuthor || isAdmin;

    const handleDelete = async () => {
        if (!window.confirm("Удалить пост?")) {
            return;
        }

        try {
            await deletePost({
                variables: { id: post.id },
                refetchQueries: [{ query: GET_POSTS }],
                awaitRefetchQueries: true
            });
            toast.success({ message: "Пост удалён" });
            await router.push("/");
        } catch {
            toast.error({ message: "Не удалось удалить пост" });
        }
    };

    return (
        <div className="container">
            <div className={cls.PostLayout}>
                <PostUserMetadata
                    author={post.author}
                    topic={post.topic}
                    createdAt={post.createdAt}
                />

                {post.tags.length > 0 && (
                    <div className={cls.PostLayoutTags}>
                        {post.tags.map((tag) => (
                            <TagBadge key={tag.id} tag={tag} />
                        ))}
                    </div>
                )}

                <div className={cls.PostLayoutActions}>
                    {isAuthor && (
                        <button
                            className={cls.PostLayoutEditButton}
                            type="button"
                            onClick={() => setEditModalOpen(true)}
                        >
                            Редактировать
                        </button>
                    )}

                    {canDelete && (
                        <button
                            className={cls.PostLayoutEditButton}
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            Удалить
                        </button>
                    )}
                </div>

                <Post content={post.content} />
            </div>

            <div className={cls.PostLayoutTitleBox}>
                <Border />

                <div className={cls.PostLayoutTitle}>
                    <a className={cls.PostLayoutTitleText}>
                        Ответы
                    </a>

                    <CommentArea postId={post.id} />
                    <CommentsSection postId={post.id} />
                </div>
            </div>

            {isEditModalOpen && (
                <EditorModal
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    post={post}
                />
            )}
        </div>
    );
};