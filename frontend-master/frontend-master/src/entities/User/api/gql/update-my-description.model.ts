import { gql } from "@apollo/client";

const UPDATE_MY_DESCRIPTION = gql`
    mutation UpdateMyDescription($description: String) {
        updateMyDescription(description: $description) {
            id
            username
            picture
            description
            createdAt
        }
    }
`;

export default UPDATE_MY_DESCRIPTION;