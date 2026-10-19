import { gql } from "src/shared/api/generated/gql";

const UPLOAD_AVATAR = gql(`
    mutation UploadAvatar($file: Upload!) {
      uploadAvatar(file: $file) {
        id
        username
        picture
      }
  }
`);

export default UPLOAD_AVATAR;
