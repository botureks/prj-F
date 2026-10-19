import { gql } from "src/shared/api/generated";

const DELETE_COMMENT = gql(`
    mutation DeleteComment($id: String!) {
        deleteComment(id: $id)
    }
`);

export default DELETE_COMMENT;