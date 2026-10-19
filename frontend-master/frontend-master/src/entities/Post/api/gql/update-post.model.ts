import { gql } from "src/shared/api/generated";

const UPDATE_POST = gql(`
    mutation UpdatePost($id: String!, $title: String, $content: String!) {
        updatePost(
            id: $id,
            updatePostInput: {
                title: $title,
                content: $content
            }
        ) {
            ...PostModel
        }
    }
`);

export default UPDATE_POST;