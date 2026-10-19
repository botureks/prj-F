import { gql } from "@apollo/client";

import TAG_MODEL from "./fragments/tag.fragment";

const GET_TAGS = gql`
    ${TAG_MODEL}
    query Tags {
        tags {
            ...TagModel
        }
    }
`;

export default GET_TAGS;
