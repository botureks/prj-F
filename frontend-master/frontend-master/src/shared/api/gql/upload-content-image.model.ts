import { gql } from "@apollo/client";

const UPLOAD_CONTENT_IMAGE = gql`
    mutation UploadContentImage($file: Upload!) {
        uploadContentImage(file: $file)
    }
`;

export default UPLOAD_CONTENT_IMAGE;