import { useState } from "react";

import { classNames } from "src/shared/lib/classNames";

import cls from "./Switch.module.less";

export type SwitchSize = 'lg' | 'sm';

interface SwitchProps {
    size?: SwitchSize;
    selected?: boolean;
    label?: string;
    onValueChange?: (value: boolean) => void;
}

export const Switch = (props: SwitchProps) => {
    const {
        size = 'lg',
        selected = false,
        label,
        onValueChange
    } = props;

    const [isSelected, setSelected] = useState(selected);

    const toggleSelected = () => {
        setSelected(!isSelected);

        if (onValueChange) {
            onValueChange(!isSelected);
        }
    };

    return (
        <label
            className={ classNames(
                cls.SwitchBox,
                undefined,
                [cls[size]])
            }
        >
            <span
                className={ cls.Switch }
                data-selected={ isSelected }
                onClick={toggleSelected}
            >
                <span className={ cls.SwitchThumb }/>
            </span>

            {label && (
                <span className={ cls.SwitchLabel }>
                    {label}
                </span>
            )}
        </label>
    )
}