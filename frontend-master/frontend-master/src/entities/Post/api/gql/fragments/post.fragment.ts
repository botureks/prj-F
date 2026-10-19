import { gql } from "@apollo/client";

const POST_MODEL = gql`
    fragment PostModel on PostEntity {
        id
        title
        topic
        content
        createdAt
        updatedAt
        editedAt
        isEdited
        author {
            id
            username
            picture
        }
        tags {
            id
            name
            slug
            color
            createdAt
            updatedAt
        }
    }
`;

export default POST_MODEL;
