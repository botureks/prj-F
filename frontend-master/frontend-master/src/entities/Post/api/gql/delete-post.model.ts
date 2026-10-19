import { gql } from "@apollo/client";

const DELETE_POST = gql`
    mutation DeletePost($id: String!) {
        deletePost(id: $id)
    }
`;

export default DELETE_POST;