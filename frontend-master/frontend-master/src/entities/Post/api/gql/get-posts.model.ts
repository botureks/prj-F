import { gql } from "src/shared/api/generated";

const GET_POSTS = gql(`
    query Posts {
        posts {
            ...PostModel
        }
    }
`);

export default GET_POSTS;