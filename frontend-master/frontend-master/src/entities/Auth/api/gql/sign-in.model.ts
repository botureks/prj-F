import { gql } from "src/shared/api/generated";

const SIGN_IN = gql(`
    mutation SignIn($username: String!, $password: String!) {
        signIn(input: { username: $username, password: $password }) {
            message
            user {
                ...UserModel
            }
        }
    }
`);

export default SIGN_IN;