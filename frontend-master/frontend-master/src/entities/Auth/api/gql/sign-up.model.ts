import { gql } from "@apollo/client";

const SIGN_UP = gql`
    mutation SignUp($username: String!, $password: String!) {
        signUp(input: { username: $username, password: $password }) {
            message
            user {
                id
                username
                picture
                role
                isBlocked
            }
        }
    }
`;

export default SIGN_UP;