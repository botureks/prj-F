import { gql } from "src/shared/api/generated";

const POST_MODEL = gql(`
    fragment PostModel on PostEntity {
        id
        title
        topic
        content
        createdAt
        updatedAt
        author {
            ...UserModel
        }
    }
`)

export default POST_MODEL;