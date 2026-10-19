import { gql } from "@apollo/client";

const GET_USERS = gql`
    query Users {
        users {
            id
            username
            picture
            role
            isBlocked
        }
    }
`;

export default GET_USERS;