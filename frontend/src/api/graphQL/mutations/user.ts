import { gql } from "@apollo/client";

export const EDIT_USER_PROFILE = gql`
  mutation EditUserProfile(
    $username: String
    $password: String
    $avatar: Upload
    $background: Upload
  ) {
    editUserProfile(
      username: $username
      password: $password
      avatar: $avatar
      background: $background
    ) {
      ok
      user {
        id
        username
        avatar
        background
      }
    }
  }
`;
