import Link from "next/link";

import { PostModel } from "src/entities/Post/model/types/post";
import { Border } from "src/shared/ui/Border";
import { TagBadge } from "src/entities/Tag/ui/TagBadge";

import cls from "./PostCard.module.less";

import { PostUserMetadata } from "../PostUserMetadata/PostUserMetadata";

export const PostCard = (props: PostModel) => {
    const {
        id,
        title,
        topic,
        author,
        createdAt,
        tags
    } = props;

    return (
        <Link href={`/post/${id}`}>
            <div className={cls.PostCard}>
                <PostUserMetadata
                    author={author}
                    topic={topic}
                    createdAt={createdAt}
                />

                <a className={cls.PostCardTitle}>
                    {title.replace("&nbsp;", " ")}
                </a>

                {tags.length > 0 && (
                    <div className={cls.PostCardTags}>
                        {tags.map((tag) => (
                            <TagBadge key={tag.id} tag={tag} />
                        ))}
                    </div>
                )}

                <Border margin={0} full />
            </div>
        </Link>
    );
};