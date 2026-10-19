import { FC, ReactNode } from "react";

import cls from "./ListboxTrigger.module.less";

export interface ListboxTriggerProps {
    onClick?: () => void;
    children: ReactNode;
}

export const ListboxTrigger: FC<ListboxTriggerProps> = (props) => {
    const {
        onClick,
        children
    } = props;

    return (
        <div
            className={ cls.ListboxTrigger }
            onClick={onClick}
        >
            {children}
        </div>
    );
}