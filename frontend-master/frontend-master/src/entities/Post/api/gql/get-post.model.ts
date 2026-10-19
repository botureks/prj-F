import { gql } from "src/shared/api/generated";

const GET_POST = gql(`
    query Post($id: String!) {
        post(id: $id) {
            ...PostModel
        }
    }
`);

export default GET_POST;