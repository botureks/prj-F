import { gql } from "@apollo/client";

const PROFILE = gql`
    query Profile {
        profile {
            id
            username
            picture
            role
            isBlocked
        }
    }
`;

export default PROFILE;