import Head from "next/head";
import { InferGetServerSidePropsType } from "next";

import { useQuery } from "@apollo/client";

import { LoaderIcon } from "src/shared/ui/Icons/LoaderIcon";
import { PostLayout } from "src/shared/layouts/PostLayout";

import GET_POST from "src/entities/Post/api/gql/get-post.model";

const PostPage = ({ postId }:  InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { data, loading, error } = useQuery(GET_POST, {
        variables: {
            id: postId
        }
    });

    if (loading) {
        return <LoaderIcon/>
    }

    if (error) {
        return <a>{ error.message }</a>
    }

    if (!data?.post) {
        return <a>Unknown post</a>
    }

    return (
        <>
            <Head>
                <title>{ data.post.title }</title>
            </Head>

            <PostLayout post={ data.post }/>
        </>
    )
}

export async function getServerSideProps(
    context: {
        params: {
            postId: string
        }
    },
): Promise<{
    props: {
        postId: string
    }
}> {
    const { postId } = context.params;

    return {
        props: {
            postId
        },
    };
}

export default PostPage;