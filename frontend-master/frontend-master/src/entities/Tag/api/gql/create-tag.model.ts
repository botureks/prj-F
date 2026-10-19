import { gql } from "@apollo/client";

import TAG_MODEL from "./fragments/tag.fragment";

const CREATE_TAG = gql`
    ${TAG_MODEL}
    mutation CreateTag($name: String!, $color: String) {
        createTag(createTagInput: { name: $name, color: $color }) {
            ...TagModel
        }
    }
`;

export default CREATE_TAG;
