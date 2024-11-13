import { gql } from "@apollo/client";

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($postId: ID!, $content: String!) {
    createComment(input: { postId: $postId, content: $content }) {
      comment {
        id
        content
        likeCount
        createdAt
        updatedAt
        user {
          username
          avatar
        }
      }
    }
  }
`;
