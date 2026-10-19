import { FC, ReactNode } from "react";

import cls from "./Container.module.less";

interface ContainerProps {
    children?: ReactNode;
}

export const Container: FC = (props: ContainerProps) => {
    const {
        children
    } = props;

    return (
        <div className={ cls.Container }>
            {children}
        </div>
    )
}