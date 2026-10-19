import { useQuery } from "@apollo/client";

import { CommentBase } from "../Comment/CommentBase";
import { LoaderIcon } from "src/shared/ui/Icons/LoaderIcon";

import COMMENTS from "../../api/gql/comments.module";

import cls from "./CommentsSection.module.less";

interface CommentsSectionProps {
    postId: string;
}

export const CommentsSection = (props: CommentsSectionProps) => {
    const { postId } = props;

    const { data, loading, error } = useQuery(COMMENTS, {
        variables: {
            postId
        }
    });

    if (loading) {
        return <LoaderIcon/>;
    }

    if (error) {
        return <a>{ error.message }</a>;
    }

    if (!data?.comments) {
        return <a>No data</a>;
    }

    return (
        <div className={ cls.CommentsSection }>
            {
                data.comments.length > 0 ? (
                    data.comments.map((data, index) => (
                        <CommentBase comment={ data } key={ index }/>
                    ))
                ) : (
                    <a className={ cls.NoComments }>
                        Ответов еще нет, станьте первым
                    </a>
                )
            }
        </div>
    )
}