import { gql } from "src/shared/api/generated";

const COMMENT_MODEL = gql(`
    fragment CommentModel on CommentEntity {
            id
            postId
            replyTo
            content
            views
            createdAt
            updatedAt
            author {
                id
                username
                picture
            }
        }
`);

export default COMMENT_MODEL;