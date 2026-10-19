import { gql } from "src/shared/api/generated";

const UPDATE_COMMENT = gql(`
    mutation UpdateComment($id: String!, $content: String!) {
        updateComment(
            id: $id,
            updateCommentInput: {
                content: $content
            }
        ) {
            ...CommentModel
        }
    }
`);

export default UPDATE_COMMENT;