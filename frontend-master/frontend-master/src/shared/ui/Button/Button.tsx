import {
    ButtonHTMLAttributes,
    ForwardedRef,
    ReactNode,
    useEffect,
    useState,
    forwardRef
} from "react";

import { classNames, Mods } from "src/shared/lib/classNames";
import { initRef } from "src/shared/lib/utils";

import { LoaderIcon } from "src/shared/ui/Icons/LoaderIcon";

import cls from "./Button.module.less";

export type ButtonVariant = 'default' | 'ghost' | 'bordered';
export type ButtonSize = 'xl' | 'lg' | 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    /**
     * Тема кнопки.
     */
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    children?: ReactNode;
    icon?: ReactNode;
    /**
     * Увеличивает ширину кнопки до 100%
     */
    fullWidth?: boolean;
    /**
     * Меняет текст на иконку лоадера
     */
    loading?: boolean;
}

export const Button = forwardRef((props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const {
        className,
        variant = 'default',
        size = 'xl',
        disabled,
        children,
        icon,
        fullWidth,
        loading,
        ...otherProps
    } = props;

    const mods: Mods = {
        [cls.fullWidth]: fullWidth,
    }

    const [initialWidth, setInitialWidth] = useState<number | null>(null);
    const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (buttonRef) {
            setInitialWidth(buttonRef.offsetWidth);
        }
    }, [buttonRef]);

    return (
        <button
            type="button"
            className={classNames(cls.Button, mods, [
                className,
                cls[variant],
                cls[size]
            ])}
            disabled={disabled}
            ref={(element) => initRef(setButtonRef, ref)(element)}
            style={{ width: loading ? `${initialWidth}px` : '' }}
            {...otherProps}
        >
            {loading ? (
                <div className={cls.Loading}>
                    <LoaderIcon light/>
                </div>
            ) : (
                icon ? (
                    <div className={cls.WithIcon}>
                        {icon}
                        {children}
                    </div>
                ) : (
                    children
                )
            )}
        </button>
    )
});