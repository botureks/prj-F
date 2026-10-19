import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import GET_TAGS from "src/entities/Tag/api/gql/get-tags.model";
import CREATE_TAG from "src/entities/Tag/api/gql/create-tag.model";
import UPDATE_TAG from "src/entities/Tag/api/gql/update-tag.model";
import DELETE_TAG from "src/entities/Tag/api/gql/delete-tag.model";

import { TagBadge } from "src/entities/Tag/ui/TagBadge";
import { TagModel } from "src/entities/Tag/model/types/tag";
import { Input } from "src/shared/ui/Input";
import { useToast } from "src/shared/lib/hooks/useToast";

import cls from "./TagPicker.module.less";

interface TagPickerProps {
    selectedIds: string[];
    onChange: (tagIds: string[]) => void;
}

type EditableTag = Pick<TagModel, "id" | "name" | "color">;

const normalizeColor = (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

export const TagPicker = ({ selectedIds, onChange }: TagPickerProps) => {
    const toast = useToast();

    const { data, loading, error } = useQuery(GET_TAGS);
    const [createTag, { loading: isCreating }] = useMutation(CREATE_TAG);
    const [updateTag, { loading: isUpdating }] = useMutation(UPDATE_TAG);
    const [deleteTag, { loading: isDeleting }] = useMutation(DELETE_TAG);

    const [isManaging, setIsManaging] = useState(false);
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState("");
    const [editingTag, setEditingTag] = useState<EditableTag | null>(null);
    const [editName, setEditName] = useState("");
    const [editColor, setEditColor] = useState("");

    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const tags = (data?.tags ?? []) as TagModel[];

    const toggleTag = (id: string) => {
        if (selectedSet.has(id)) {
            onChange(selectedIds.filter((tagId) => tagId !== id));
            return;
        }

        onChange([...selectedIds, id]);
    };

    const handleCreate = async () => {
        const name = newName.trim();

        if (name.length < 2 || name.length > 30) {
            toast.error({ message: "Название тега должно содержать от 2 до 30 символов" });
            return;
        }

        try {
            const result = await createTag({
                variables: {
                    name,
                    color: normalizeColor(newColor)
                },
                refetchQueries: [{ query: GET_TAGS }],
                awaitRefetchQueries: true
            });

            const createdId = result.data?.createTag.id;
            if (createdId && !selectedSet.has(createdId)) {
                onChange([...selectedIds, createdId]);
            }

            setNewName("");
            setNewColor("");
            toast.success({ message: "Тег создан" });
        } catch {
            toast.error({ message: "Не удалось создать тег" });
        }
    };

    const startEditing = (tag: EditableTag) => {
        setEditingTag(tag);
        setEditName(tag.name);
        setEditColor(tag.color ?? "");
    };

    const cancelEditing = () => {
        setEditingTag(null);
        setEditName("");
        setEditColor("");
    };

    const handleUpdate = async () => {
        if (!editingTag) {
            return;
        }

        const name = editName.trim();

        if (name.length < 2 || name.length > 30) {
            toast.error({ message: "Название тега должно содержать от 2 до 30 символов" });
            return;
        }

        try {
            await updateTag({
                variables: {
                    id: editingTag.id,
                    name,
                    color: normalizeColor(editColor)
                },
                refetchQueries: [{ query: GET_TAGS }],
                awaitRefetchQueries: true
            });

            cancelEditing();
            toast.success({ message: "Тег обновлён" });
        } catch {
            toast.error({ message: "Не удалось обновить тег" });
        }
    };

    const handleDelete = async (tag: EditableTag) => {
        if (!window.confirm(`Удалить тег «${tag.name}»?`)) {
            return;
        }

        try {
            await deleteTag({
                variables: { id: tag.id },
                refetchQueries: [{ query: GET_TAGS }],
                awaitRefetchQueries: true,
                update: (cache) => {
                    const cacheId = cache.identify({ __typename: "TagEntity", id: tag.id });
                    if (cacheId) {
                        cache.evict({ id: cacheId });
                        cache.gc();
                    }
                }
            });

            if (selectedSet.has(tag.id)) {
                onChange(selectedIds.filter((tagId) => tagId !== tag.id));
            }

            if (editingTag?.id === tag.id) {
                cancelEditing();
            }

            toast.success({ message: "Тег удалён" });
        } catch {
            toast.error({ message: "Не удалось удалить тег" });
        }
    };

    return (
        <section className={cls.TagPicker}>
            <div className={cls.TagPickerHeader}>
                <div>
                    <strong>Теги</strong>
                    <span>Можно выбрать несколько</span>
                </div>

                <button
                    type="button"
                    className={cls.TagPickerManageButton}
                    onClick={() => setIsManaging((value) => !value)}
                >
                    {isManaging ? "Скрыть управление" : "Управление тегами"}
                </button>
            </div>

            {loading && <span className={cls.TagPickerHint}>Загрузка тегов…</span>}
            {error && <span className={cls.TagPickerError}>Не удалось загрузить теги</span>}

            {!loading && !error && tags.length === 0 && (
                <span className={cls.TagPickerHint}>Тегов пока нет</span>
            )}

            {tags.length > 0 && (
                <div className={cls.TagPickerTags}>
                    {tags.map((tag) => {
                        const selected = selectedSet.has(tag.id);

                        return (
                            <button
                                type="button"
                                key={tag.id}
                                className={selected ? cls.TagPickerTagSelected : cls.TagPickerTag}
                                onClick={() => toggleTag(tag.id)}
                                aria-pressed={selected}
                            >
                                <TagBadge tag={tag} />
                            </button>
                        );
                    })}
                </div>
            )}

            {isManaging && (
                <div className={cls.TagPickerManager}>
                    <div className={cls.TagPickerForm}>
                        <Input
                            sizeVariant="sm"
                            placeholder="Новый тег"
                            value={newName}
                            maxLength={30}
                            onChange={(event) => setNewName(event.target.value)}
                        />
                        <Input
                            sizeVariant="sm"
                            placeholder="Цвет, например #418AF4"
                            value={newColor}
                            onChange={(event) => setNewColor(event.target.value)}
                        />
                        <button
                            type="button"
                            className={cls.TagPickerPrimaryAction}
                            onClick={handleCreate}
                            disabled={isCreating}
                        >
                            {isCreating ? "Создание…" : "Создать"}
                        </button>
                    </div>

                    {tags.length > 0 && (
                        <div className={cls.TagPickerManageList}>
                            {tags.map((tag) => (
                                <div className={cls.TagPickerManageRow} key={tag.id}>
                                    {editingTag?.id === tag.id ? (
                                        <div className={cls.TagPickerEditForm}>
                                            <Input
                                                sizeVariant="sm"
                                                value={editName}
                                                maxLength={30}
                                                onChange={(event) => setEditName(event.target.value)}
                                            />
                                            <Input
                                                sizeVariant="sm"
                                                placeholder="Цвет"
                                                value={editColor}
                                                onChange={(event) => setEditColor(event.target.value)}
                                            />
                                            <div className={cls.TagPickerRowActions}>
                                                <button
                                                    type="button"
                                                    onClick={handleUpdate}
                                                    disabled={isUpdating}
                                                >
                                                    Сохранить
                                                </button>
                                                <button type="button" onClick={cancelEditing}>
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <TagBadge tag={tag} />
                                            <div className={cls.TagPickerRowActions}>
                                                <button type="button" onClick={() => startEditing(tag)}>
                                                    Изменить
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(tag)}
                                                    disabled={isDeleting}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};
