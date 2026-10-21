import { MouseEvent } from "react";
import { useRouter } from "next/router";

import { Avatar } from "../../../../shared/ui/Avatar";
import { formatDate } from "../../../../shared/lib/utils";
import { UserEntity } from "../../../../shared/api/generated/graphql";

import cls from "./PostUserMetadata.module.less";

interface PostUserMetadataProps {
    author: UserEntity;
    topic?: string;
    createdAt: string;
}

const NO_TOPIC = 'Без темы';

export const PostUserMetadata = (props: PostUserMetadataProps) => {
    const { author, topic, createdAt } = props;
    const router = useRouter();

    const openProfile = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        void router.push(`/profile/${author.id}`);
    };

    return (
        <div className={cls.PostUserMetadata}>
            <div className={cls.PostUserMetadataAuthor}>
                <span className={cls.PostUserProfileLink} onClick={openProfile}>
                    <Avatar src={ author.picture || "" } size="sm" />
                    <span className={cls.PostUserName}>{author.username}</span>
                </span>

                <div className={cls.PostUserInfo}>
                    {topic !== NO_TOPIC && <a>{topic}</a>}
                    <span>{formatDate(createdAt)}</span>
                </div>
            </div>
        </div>
    )
}