import { useState } from "react";
import { useSelector } from "react-redux";

import { Post } from "src/entities/Post/ui/Post";
import { PostEntity } from "src/shared/api/generated/graphql";

import { Border } from "src/shared/ui/Border";

import { CommentArea } from "src/features/sendComment/ui/CommentArea";
import { CommentsSection } from "src/entities/Comment/ui/CommentsSection";

import { EditorModal } from "src/features/createPost/ui/EditorModal";

import { getAuth } from "src/entities/Auth/model/selectors/getAuth/getAuth";

import cls from "./PostLayout.module.less";
import { PostUserMetadata } from "../../../entities/Post/ui/PostUserMetadata/PostUserMetadata";

interface PostLayoutProps {
    post: PostEntity;
}

export const PostLayout = (props: PostLayoutProps) => {
    const { post } = props;

    const auth = useSelector(getAuth);

    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const isAuthor = auth.user?.id === post.author.id;

    return (
        <div className="container">
            <div className={cls.PostLayout}>
                <PostUserMetadata
                    author={post.author}
                    topic={post.topic}
                    createdAt={post.createdAt}
                />

                {isAuthor && (
                    <button
                        onClick={() => setEditModalOpen(true)}
                    >
                        Редактировать
                    </button>
                )}

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