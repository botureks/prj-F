import { FormEvent, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import GET_TAGS from "src/entities/Tag/api/gql/get-tags.model";
import { TagModel } from "src/entities/Tag/model/types/tag";
import { TagBadge } from "src/entities/Tag/ui/TagBadge";
import { Button } from "src/shared/ui/Button";
import { Input } from "src/shared/ui/Input";

import cls from "./PostSearch.module.less";

export interface PostSearchFilters {
    search: string;
    tagIds: string[];
}

interface TagsQueryData {
    tags: TagModel[];
}

interface PostSearchProps {
    value: PostSearchFilters;
    onChange: (filters: PostSearchFilters) => void;
}

export const PostSearch = ({ value, onChange }: PostSearchProps) => {
    const [searchInput, setSearchInput] = useState(value.search);
    const { data, loading, error } = useQuery<TagsQueryData>(GET_TAGS);

    useEffect(() => {
        setSearchInput(value.search);
    }, [value.search]);

    const applySearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onChange({
            search: searchInput.trim(),
            tagIds: value.tagIds
        });
    };

    const toggleTag = (tagId: string) => {
        const isSelected = value.tagIds.includes(tagId);
        const tagIds = isSelected
            ? value.tagIds.filter((id) => id !== tagId)
            : [...value.tagIds, tagId];

        onChange({
            search: searchInput.trim(),
            tagIds
        });
    };

    const resetFilters = () => {
        setSearchInput("");
        onChange({
            search: "",
            tagIds: []
        });
    };

    const hasFilters = Boolean(searchInput.trim() || value.search || value.tagIds.length);

    return (
        <section className={cls.PostSearch}>
            <form className={cls.SearchRow} onSubmit={applySearch}>
                <Input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Поиск по постам..."
                    sizeVariant="sm"
                    fullWidth
                />

                <Button type="submit" size="sm">
                    Найти
                </Button>
            </form>

            {loading ? (
                <div className={cls.TagsMessage}>Загрузка тегов...</div>
            ) : error ? (
                <div className={cls.TagsMessage}>Не удалось загрузить теги</div>
            ) : data?.tags?.length ? (
                <div className={cls.TagsRow}>
                    {data.tags.map((tag) => {
                        const selected = value.tagIds.includes(tag.id);

                        return (
                            <button
                                key={tag.id}
                                type="button"
                                className={`${cls.TagButton} ${selected ? cls.TagButtonSelected : ""}`}
                                aria-pressed={selected}
                                onClick={() => toggleTag(tag.id)}
                            >
                                <TagBadge tag={tag} />
                            </button>
                        );
                    })}
                </div>
            ) : null}

            {hasFilters && (
                <button
                    type="button"
                    className={cls.ResetButton}
                    onClick={resetFilters}
                >
                    Сбросить фильтры
                </button>
            )}
        </section>
    );
};