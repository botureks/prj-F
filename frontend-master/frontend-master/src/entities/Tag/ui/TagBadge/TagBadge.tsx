import { CSSProperties } from "react";

import { TagModel } from "src/entities/Tag/model/types/tag";

import cls from "./TagBadge.module.less";

interface TagBadgeProps {
    tag: Pick<TagModel, "name" | "color">;
    className?: string;
}

export const TagBadge = ({ tag, className }: TagBadgeProps) => {
    const accentStyle: CSSProperties | undefined = tag.color
        ? { backgroundColor: tag.color }
        : undefined;

    return (
        <span className={`${cls.TagBadge} ${className ?? ""}`}>
            <span className={cls.TagBadgeColor} style={accentStyle} />
            {tag.name}
        </span>
    );
};
