import { gql } from "@apollo/client";

import TAG_MODEL from "./fragments/tag.fragment";

const UPDATE_TAG = gql`
    ${TAG_MODEL}
    mutation UpdateTag($id: String!, $name: String, $color: String) {
        updateTag(
            id: $id
            updateTagInput: { name: $name, color: $color }
        ) {
            ...TagModel
        }
    }
`;

export default UPDATE_TAG;
