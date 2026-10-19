import { gql } from "@apollo/client";

const UNBLOCK_USER = gql`
    mutation UnblockUser($id: String!) {
        unblockUser(id: $id) {
            id
            isBlocked
        }
    }
`;

export default UNBLOCK_USER;