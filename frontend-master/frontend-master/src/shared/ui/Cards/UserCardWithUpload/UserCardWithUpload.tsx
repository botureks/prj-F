import { ChangeEvent, FC, ReactNode, useCallback, useState } from "react";
import { useMutation } from "@apollo/client";

import { useDropzone } from "react-dropzone";

import { classNames } from "src/shared/lib/classNames";
import { formatDate } from "src/shared/lib/utils";

import { Avatar } from "src/shared/ui/Avatar";

import { UserEntity } from "src/shared/api/generated/graphql";

import UPLOAD_AVATAR from "src/entities/User/api/gql/upload-avatar.model";

import cls from "./UserCardWithUpload.module.less";

type UserCardSize = 'lg' | 'sm';

interface UserCardProps {
    user: UserEntity;
    size?: UserCardSize;
    time?: string;
    children?: ReactNode;
}

export const UserCardWithUpload: FC<UserCardProps> = (props: UserCardProps) => {
    const {
        user,
        size = 'lg',
        time,
        children
    } = props;

    let avatarCache = user.picture || null;

    const [uploadAvatar] = useMutation(UPLOAD_AVATAR);
    const [avatarSrc, setAvatarSrc] = useState<string | null>(avatarCache);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            const reader = new FileReader();

            reader.onload = () => {
                const result = reader.result as string;

                setAvatarSrc(result);
            };

            if (file) {
                reader.readAsDataURL(file);

                //setAvatarLoading(true);

                uploadAvatar({ variables: { file } })
                    .then(response => {
                        const { data } = response;

                        if (data?.uploadAvatar && data.uploadAvatar.picture) {
                            setAvatarSrc(data.uploadAvatar.picture);
                        }

                        //setAvatarLoading(false);
                    });
            }
        },
        [uploadAvatar],
    );

    const { getRootProps, getInputProps, open } = useDropzone({
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        onDrop,
        onDragEnter: () => {
            avatarCache = avatarSrc;

            setAvatarSrc("/images/upload-placeholder.png");
        },
        onDragLeave: () => setAvatarSrc(avatarCache),
    });

    return (
        <>
            <div className={classNames(cls.UserCard, undefined, [cls[size]])}>
                <div {...getRootProps()} className={cls.UserCardDropZone}>
                    <input {...getInputProps()} />

                    <Avatar src={avatarSrc || ""} size="sm" />
                </div>

                <div className={cls.UserCardData}>
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