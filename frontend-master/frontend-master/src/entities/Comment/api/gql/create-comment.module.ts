import { gql } from "src/shared/api/generated";

const CREATE_COMMENT = gql(`
    mutation CreateComment($postId: String!, $content: String!, $replyTo: String) {
        createComment(createCommentInput: { postId: $postId, content: $content, replyTo: $replyTo }) {
            ...CommentModel
        }
    }
`);

export default CREATE_COMMENT;