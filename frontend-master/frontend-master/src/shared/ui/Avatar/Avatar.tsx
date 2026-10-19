import { useState } from "react";

import Image from "next/image";

import { FallbackAvatarIcon } from "../Icons/FallbackAvatarIcon";

import cls from "./Avatar.module.less";
import { classNames } from "../../lib/classNames";

export type AvatarSize = 'lg' | 'sm';

interface AvatarProps {
    src?: string;
    size?: AvatarSize
}

export const Avatar = (props: AvatarProps) => {
    const {
        src,
        size = 'sm'
    } = props;

   // const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

   // const handleImageLoad = () => {
   //     setIsLoading(false);
  //  };

    const handleImageError = () => {
        setHasError(true);
    };

    console.log(src)

    return (
        <span className={ classNames(cls.Avatar, undefined, [cls[size]]) }>
            <div className={ cls.AvatarSkeletonLoader }/>

            {hasError || !src ? (
                <FallbackAvatarIcon />
            ) : (
                <Image
                    src={src}
                    alt="Avatar"
                    width={40}
                    height={40}
                    unoptimized
                  //  onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            )}
        </span>
    );
};