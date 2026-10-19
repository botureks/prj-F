import { ForwardedRef, forwardRef, InputHTMLAttributes, ReactNode } from "react";

import { classNames, Mods } from "src/shared/lib/classNames";

import cls from "./Input.module.less";

export type InputSize = 'lg' | 'sm';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    disabled?: boolean;
    children?: ReactNode;
    sizeVariant?: InputSize;
    /**
     * Увеличивает ширину инпута до 100%
     */
    fullWidth?: boolean;
}

export const Input = forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
        sizeVariant = 'lg',
        className,
        disabled,
        children,
        fullWidth,
        ...otherProps
    } = props;

    const mods: Mods = {
        [cls.fullWidth]: fullWidth,
    }

    return (
        <input
            className={classNames(cls.Input, mods, [
                className,
                cls[sizeVariant]
            ])}
            disabled={disabled}
            {...otherProps}
            ref={ref}
        >
            {children}
        </input>
    )
});