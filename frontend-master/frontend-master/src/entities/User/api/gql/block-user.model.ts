import { gql } from "@apollo/client";

const BLOCK_USER = gql`
    mutation BlockUser($id: String!) {
        blockUser(id: $id) {
            id
            isBlocked
        }
    }
`;

export default BLOCK_USER;