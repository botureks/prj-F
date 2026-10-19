// @ts-nocheck
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import CodeTool from '@editorjs/code';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import NestedList from '@editorjs/nested-list';
import Delimiter from '@editorjs/delimiter';

import { OutputBlockData, OutputData } from "@editorjs/editorjs";

export const EDITOR_TOOLS = {
    paragraph: Paragraph,
    header: {
        class: Header,
        config: {
            placeholder: 'Заголовок'
        },
    },
    code: CodeTool,
    marker: Marker,
    quote: Quote,
    list: {
        class: NestedList,
        inlineToolbar: true,
        config: {
            defaultStyle: 'unordered'
        },
    },
    delimiter: Delimiter,
};

export const EDITOR_I18n = {
    messages: {
        ui: {
            "blockTunes": {
                "toggler": {
                    "Click to tune": "Нажмите, чтобы настроить",
                    "or drag to move": "или перетащите"
                },
            },
            "inlineToolbar": {
                "converter": {
                    "Convert to": "Конвертировать в"
                }
            },
            "toolbar": {
                "toolbox": {
                    "Add": "Добавить"
                }
            },
            "popover": {
                "Filter": "Фильтр",
                "Nothing found": "Ничего не найдено",
                "Convert to": "Преобразовать в..."
            }
        },
        toolNames: {
            "Text": "Параграф",
            "Heading": "Заголовок",
            "List": "Список",
            "Warning": "Примечание",
            "Checklist": "Чеклист",
            "Quote": "Цитата",
            "Code": "Код",
            "Delimiter": "Разделитель",
            "Raw HTML": "HTML-фрагмент",
            "Table": "Таблица",
            "Link": "Ссылка",
            "Marker": "Маркер",
            "Bold": "Полужирный",
            "Italic": "Курсив",
            "InlineCode": "Моноширинный",
        },
        tools: {
            "warning": {
                "Title": "Название",
                "Message": "Сообщение",
            },
            "link": {
                "Add a link": "Вставьте ссылку"
            },
            "stub": {
                'The block can not be displayed correctly.': 'Блок не может быть отображен'
            }
        },
        blockTunes: {
            spoiler: {
                'Hide content': 'Содержание скрыто',
            },
            delete: {
                "Delete": "Удалить",
                "Click to delete": "Подтвердите действие"
            },
            moveUp: {
                "Move up": "Переместить вверх"
            },
            moveDown: {
                "Move down": "Переместить вниз"
            }
        }
    }
}

export const EDITOR_DATA: OutputData = {
    "time": 1716683254821,
    "blocks": [
        {
            "id": "2_b1qL8VJT",
            "type": "header",
            "data": {
                "text": "",
                "level": 2
            }
        }
    ],
    "version": "2.29.1"
};

export const EDITOR_DEFAULT = 'paragraph';

export const BLOCKS_TO_TITLE = (blocks: OutputBlockData[]): string => {
    let title = '';

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i].data;

        if (block.text) {
            title = block.text;
            break;
        }

        if (block.code) {
            title = block.code;
            break;
        }
    }

    return title;
}

export const TOPICS = [
    {
        id: 0,
        title: "Без темы",
    },
    {
        id: 1,
        title: "Оффтоп",
    },
    {
        id: 2,
        title: "Вопросы",
    }
];