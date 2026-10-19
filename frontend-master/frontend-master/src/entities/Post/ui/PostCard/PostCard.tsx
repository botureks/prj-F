import Link from "next/link";

import { PostEntity } from "src/shared/api/generated/graphql";

import { Border } from "src/shared/ui/Border";

import cls from "./PostCard.module.less";

import { PostUserMetadata } from "../PostUserMetadata/PostUserMetadata";

export const PostCard = (props: PostEntity) => {
    const {
        id,
        title,
        topic,
        author,
        createdAt
    } = props;

    return (
        <Link href={`/post/${id}`}>
            <div className={ cls.PostCard }>
                <PostUserMetadata
                    author={ author }
                    topic={ topic }
                    createdAt={ createdAt }
                />

                <a className={cls.PostCardTitle}>
                    {title.replace("&nbsp;", " ")}
                </a>

                <Border margin={0} full />
            </div>
        </Link>
    )
}