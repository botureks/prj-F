import { gql } from "src/shared/api/generated";

const SIGN_UP = gql(`
    mutation SignUp($username: String!, $password: String!) {
        signUp(input: { username: $username, password: $password }) {
            message
            user {
                ...UserModel
            }
        }
    }
`);

export default SIGN_UP;