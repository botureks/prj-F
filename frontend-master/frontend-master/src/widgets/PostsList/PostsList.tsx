import { useQuery } from "@apollo/client";

import { LoaderIcon } from "src/shared/ui/Icons/LoaderIcon";

import { PostCard } from "src/entities/Post/ui/PostCard";

import GET_POSTS from "src/entities/Post/api/gql/get-posts.model";

import cls from "./PostsList.module.less";

export const PostsList = () => {
    const { data, loading, error } = useQuery(GET_POSTS);

    if (loading) {
        return <LoaderIcon/>
    }

    if (error) {
        return <a>{ error.message }</a>;
    }

    if (!data?.posts) {
        return <a>No posts</a>;
    }

    return (
        <div className={cls.PostsList}>
            {data.posts.map((post, index) => (
                <PostCard {...post}/>
            ))}
        </div>
    )
}