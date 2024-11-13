import { gql } from "@apollo/client";

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($content: String!) {
    createPost(postData: { content: $content }) {
      post {
        content
        image
        createdAt
        user {
          username
          avatar
        }
      }
    }
  }
`;
