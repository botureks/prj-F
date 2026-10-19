import { FC, ReactNode } from "react";

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

    return (
        <>
            <div className={classNames(cls.UserCard, undefined, [cls[size]])}>
                <Avatar src={ user.picture || "" } size="sm" />

                <div className={ cls.UserCardData }>
                    <span>{user.username}</span>
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