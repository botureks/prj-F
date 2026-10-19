import { ReactNode } from "react";

import { classNames } from "src/shared/lib/classNames";

import cls from "./ListboxItem.module.less";

interface ListboxItemProps {
    icon?: ReactNode;
    title: string;
    active?: boolean;
    onClick: () => void;
}

export const ListboxItem = (props: ListboxItemProps) => {
    const {
        icon,
        title,
        active,
        onClick
    } = props;

    return (
        <button
            onClick={onClick}
            className={ classNames(
                cls.PopoverItem,
                undefined,
                [active ? cls.PopoverItemActive : '']
            )
        }>
            <span>{ title }</span>
        </button>
    )
}