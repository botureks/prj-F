import { gql } from "@apollo/client";

import TAG_MODEL from "./fragments/tag.fragment";

const GET_TAG = gql`
    ${TAG_MODEL}
    query Tag($id: String!) {
        tag(id: $id) {
            ...TagModel
        }
    }
`;

export default GET_TAG;
