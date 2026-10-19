import { gql } from "@apollo/client";

import POST_MODEL from "./fragments/post.fragment";

const GET_POST = gql`
    ${POST_MODEL}
    query Post($id: String!) {
        post(id: $id) {
            ...PostModel
        }
    }
`;

export default GET_POST;
