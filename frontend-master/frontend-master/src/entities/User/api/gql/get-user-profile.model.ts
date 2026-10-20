import { gql } from "@apollo/client";

import POST_MODEL from "src/entities/Post/api/gql/fragments/post.fragment";

const GET_USER_PROFILE = gql`
    ${POST_MODEL}
    query UserProfile($id: String!) {
        userProfile(id: $id) {
            id
            username
            picture
            description
            createdAt
        }
        postsByUser(userId: $id) {
            ...PostModel
        }
    }
`;

export default GET_USER_PROFILE;