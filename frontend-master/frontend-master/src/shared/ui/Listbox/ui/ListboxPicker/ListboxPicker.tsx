import { ChangeEvent, ReactNode, useEffect, useState } from "react";

const ChevronUpIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="1em" height="1em">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
);

import { Input } from "src/shared/ui/Input";
import { ListboxItem } from "../ListboxItem";

import { classNames } from "src/shared/lib/classNames";

import cls from "./ListboxPicker.module.less";
import { useOutsideClick } from "../../../../lib/hooks/useOutsideClick";

interface ListboxItem {
    id: number;
    title: string;
}

interface ListboxPickerProps {
    initialItems: ListboxItem[];
    trigger?: ReactNode;
    onSelect: (value: string) => void;
}

export const ListboxPicker = (props: ListboxPickerProps) => {
    const {
        onSelect,
        trigger,
        initialItems
    } = props;

    const [items, setItems] = useState<ListboxItem[]>(initialItems);
    const [active, setActive] = useState(false);
    const [selected, setSelected] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const ref = useOutsideClick(() => setActive(false));

    const toggleActive = () => setActive((prevState) => !prevState);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        setSearchTerm(value);
        filterItems(value);
    };

    const filterItems = (term: string) => {
        const filteredItems = initialItems.filter((item) =>
            item.title.toLowerCase().includes(term.toLowerCase())
        );

        setItems(filteredItems);
    };

    const select = (id: number) => {
        setSelected(id);
        setActive(false);
    }

    useEffect(() => {
        onSelect(initialItems[selected].title);
    }, [selected]);

    const selectedItem = initialItems[selected];

    return (
        <div
            className={cls.ListboxPicker}
            ref={ ref }
        >
            {!trigger ? (
                <div
                    className={classNames(
                        cls.ListboxPickerSelected,
                        undefined,
                        [cls.ListboxPickerSelector],
                    )}
                    onClick={toggleActive}
                >
                    <span>{selectedItem.title}</span>

                    <ChevronUpIcon className={classNames(cls.ListboxPickerIcon, undefined, [
                        active ? cls.ListboxPickerIconActive : "",
                    ])} />
                </div>
            ) : (
                    <div className="" onClick={toggleActive}>
                        {trigger}
                    </div>
                )
            }

            {active && (
                <div className={cls.ListboxPickerBox}>
                    <Input
                        sizeVariant="sm"
                        placeholder="Поиск"
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                    <div className={cls.ListboxPickerList}>
                        {items.map((item) => (
                            <ListboxItem
                                title={item.title}
                                active={selected === item.id}
                                onClick={() => select(item.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};