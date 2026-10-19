import { gql } from "src/shared/api/generated";

const CREATE_POST = gql(`
    mutation CreatePost($title: String!, $topic: String!, $content: String!) {
        createPost(createPostInput: { title: $title, topic: $topic, content: $content }) {
            ...PostModel
        }
    }
`);

export default CREATE_POST;