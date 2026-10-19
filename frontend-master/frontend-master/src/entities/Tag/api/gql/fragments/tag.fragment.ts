import { gql } from "@apollo/client";

const TAG_MODEL = gql`
    fragment TagModel on TagEntity {
        id
        name
        slug
        color
        createdAt
        updatedAt
    }
`;

export default TAG_MODEL;
