import { FC, ReactNode } from "react";
import { useRouter } from "next/router";

import { classNames } from "src/shared/lib/classNames";
import { formatDate } from "src/shared/lib/utils";

import { Avatar } from "src/shared/ui/Avatar";

import { UserEntity } from "src/shared/api/generated/graphql";

import cls from "./UserCard.module.less";

type UserCardSize = 'lg' | 'sm';

interface UserCardProps {
    user: UserEntity;
    size?: UserCardSize;
    time?: string;
    children?: ReactNode;
}

export const UserCard: FC<UserCardProps> = (props: UserCardProps) => {
    const {
        user,
        size = 'lg',
        time,
        children
    } = props;

    const router = useRouter();
    const openProfile = () => void router.push(`/profile/${user.id}`);

    return (
        <>
            <div className={classNames(cls.UserCard, undefined, [cls[size]])}>
                <span className={cls.UserCardAvatarLink} onClick={openProfile}>
                    <Avatar src={ user.picture || "" } size="sm" />
                </span>

                <div className={ cls.UserCardData }>
                    <span className={cls.UserCardUsername} onClick={openProfile}>
                        {user.username}
                    </span>
                    {time && (
                        <time dateTime={new Date(time).toDateString()}>
                            {formatDate(time)}
                        </time>
                    )}
                </div>
            </div>
            {children && (
                <div className={cls.UserCardChild}>
                    {children}
                </div>
            )}
        </>
    )
}