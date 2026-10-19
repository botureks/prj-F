import { gql } from "src/shared/api/generated";

const USER_MODEL = gql(`
    fragment UserModel on UserEntity {
        id
        username
        picture
    }
`);

export default USER_MODEL;