import { useState } from "react";
import { useSelector } from "react-redux";

import { Post } from "src/entities/Post/ui/Post";
import { PostModel } from "src/entities/Post/model/types/post";
import { TagBadge } from "src/entities/Tag/ui/TagBadge";

import { Border } from "src/shared/ui/Border";

import { CommentArea } from "src/features/sendComment/ui/CommentArea";
import { CommentsSection } from "src/entities/Comment/ui/CommentsSection";
import { EditorModal } from "src/features/createPost/ui/EditorModal";

import { getAuth } from "src/entities/Auth/model/selectors/getAuth/getAuth";
import { PostUserMetadata } from "src/entities/Post/ui/PostUserMetadata/PostUserMetadata";

import cls from "./PostLayout.module.less";

interface PostLayoutProps {
    post: PostModel;
}

export const PostLayout = ({ post }: PostLayoutProps) => {
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

                {post.tags.length > 0 && (
                    <div className={cls.PostLayoutTags}>
                        {post.tags.map((tag) => (
                            <TagBadge key={tag.id} tag={tag} />
                        ))}
                    </div>
                )}

                {isAuthor && (
                    <button
                        className={cls.PostLayoutEditButton}
                        type="button"
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