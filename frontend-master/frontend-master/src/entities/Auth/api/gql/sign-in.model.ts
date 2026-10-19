import { gql } from "@apollo/client";

const SIGN_IN = gql`
    mutation SignIn($username: String!, $password: String!) {
        signIn(input: { username: $username, password: $password }) {
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

export default SIGN_IN;