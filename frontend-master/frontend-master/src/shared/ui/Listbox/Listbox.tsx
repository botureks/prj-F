import React, { FC, ReactElement, ReactNode, useState } from "react";
import { ListboxTrigger, ListboxTriggerProps } from "./ui/ListboxTrigger";
import { ListboxItems } from "./ui/ListboxItems";

import { useOutsideClick } from "src/shared/lib/hooks/useOutsideClick";

interface ListboxProps {
    children?: ReactNode;
}

export const Listbox: FC<ListboxProps> = (props) => {
    const { children } = props;

    const [isOpen, setIsOpen] = useState(false);

    const toggleListBox = () => setIsOpen(prevState => !prevState);

    const ref = useOutsideClick(() => setIsOpen(false));

    let triggerElement: ReactElement | null = null;
    let itemsElement: ReactElement | null = null;

    React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
            if (child.type === ListboxTrigger) {
                triggerElement = React.cloneElement(child, { onClick: toggleListBox } as ListboxTriggerProps);
            } else if (child.type === ListboxItems) {
                itemsElement = isOpen ? child : null;
            }
        }
    });

    return (
        <div ref={ ref }>
            {triggerElement}
            {itemsElement}
        </div>
    );
};