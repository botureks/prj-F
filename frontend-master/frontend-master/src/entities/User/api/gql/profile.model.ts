import { gql } from "src/shared/api/generated";

const PROFILE = gql(`
    query Profile {
        profile {
            ...UserModel
        }
    }
`);

export default PROFILE;