import { gql } from "@apollo/client";

import POST_MODEL from "./fragments/post.fragment";

const GET_POSTS = gql`
    ${POST_MODEL}
    query Posts($search: String, $tagIds: [String!]) {
        posts(search: $search, tagIds: $tagIds) {
            ...PostModel
        }
    }
`;

export default GET_POSTS;