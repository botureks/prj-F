import { FC, ReactNode } from "react";

import cls from "./ListboxItems.module.less";

export interface ListboxItemsProps {
    children: ReactNode;
}

export const ListboxItems: FC<ListboxItemsProps> = ({ children }) => {
    return (
        <div className={ cls.ListboxItems }>
            {children}
        </div>
    );
};
