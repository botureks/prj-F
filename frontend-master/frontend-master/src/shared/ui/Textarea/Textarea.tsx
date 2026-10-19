import { ForwardedRef, forwardRef, ReactNode, TextareaHTMLAttributes } from "react";

import { classNames, Mods } from "src/shared/lib/classNames";

import cls from "./Textarea.module.less";

export type TextareaSize = 'lg' | 'sm';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    disabled?: boolean;
    children?: ReactNode;
    footer?: ReactNode;
    sizeVariant?: TextareaSize;
    /**
     * Увеличивает ширину до 100%
     */
    fullWidth?: boolean;
}

export const Textarea = forwardRef((props: TextareaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
    const {
        sizeVariant = 'lg',
        className,
        disabled,
        children,
        fullWidth,
        footer,
        ...otherProps
    } = props;

    const mods: Mods = {
        [cls.fullWidth]: fullWidth,
    }

    return (
        <div
            className={classNames(cls.Textarea, mods, [
                className,
                cls[sizeVariant]
            ])}
        >
            <textarea
                disabled={disabled}
                {...otherProps}
                ref={ref}
            >
                {children}
            </textarea>

            {footer}
        </div>
    )
});