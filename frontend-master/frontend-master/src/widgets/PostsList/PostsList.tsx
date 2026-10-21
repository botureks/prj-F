import { useQuery } from "@apollo/client";

import { LoaderIcon } from "src/shared/ui/Icons/LoaderIcon";
import { PostCard } from "src/entities/Post/ui/PostCard";
import GET_POSTS from "src/entities/Post/api/gql/get-posts.model";

import cls from "./PostsList.module.less";

interface PostsListProps {
    search?: string;
    tagIds?: string[];
}

export const PostsList = ({ search = "", tagIds = [] }: PostsListProps) => {
    const { data, loading, error } = useQuery(GET_POSTS, {
        variables: {
            search: search || null,
            tagIds: tagIds.length ? tagIds : null
        }
    });

    if (loading) {
        return <LoaderIcon />;
    }

    if (error) {
        return <a>{error.message}</a>;
    }

    if (!data?.posts?.length) {
        return (
            <div className={cls.Empty}>
                {search || tagIds.length
                    ? "По вашему запросу постов не найдено"
                    : "Постов пока нет"}
            </div>
        );
    }

    return (
        <div className={cls.PostsList}>
            {data.posts.map((post) => (
                <PostCard key={post.id} {...post} />
            ))}
        </div>
    );
};