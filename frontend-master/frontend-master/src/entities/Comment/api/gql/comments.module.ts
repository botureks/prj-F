import { gql } from "src/shared/api/generated";

const COMMENTS = gql(`
    query Comments($postId: String!) {
        comments(postId: $postId) {
            ...CommentModel
        }
    }
`);

export default COMMENTS;