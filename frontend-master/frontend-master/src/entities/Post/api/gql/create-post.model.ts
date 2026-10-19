import { gql } from "@apollo/client";

import POST_MODEL from "./fragments/post.fragment";

const CREATE_POST = gql`
    ${POST_MODEL}
    mutation CreatePost(
        $title: String!
        $topic: String!
        $content: String!
        $tagIds: [String!]
    ) {
        createPost(
            createPostInput: {
                title: $title
                topic: $topic
                content: $content
                tagIds: $tagIds
            }
        ) {
            ...PostModel
        }
    }
`;

export default CREATE_POST;
