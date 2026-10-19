import { gql } from "src/shared/api/generated";

const USER_LOGOUT = gql(`
    mutation UserLogout {
        userLogout {
            message
        }
    }
`);

export default USER_LOGOUT;