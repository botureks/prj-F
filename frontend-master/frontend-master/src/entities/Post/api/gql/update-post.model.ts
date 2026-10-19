import { gql } from "@apollo/client";

import POST_MODEL from "./fragments/post.fragment";

const UPDATE_POST = gql`
    ${POST_MODEL}
    mutation UpdatePost(
        $id: String!
        $title: String
        $content: String
        $tagIds: [String!]
    ) {
        updatePost(
            id: $id
            updatePostInput: {
                title: $title
                content: $content
                tagIds: $tagIds
            }
        ) {
            ...PostModel
        }
    }
`;

export default UPDATE_POST;
