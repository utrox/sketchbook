import { gql } from "@apollo/client";

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
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

export const EDIT_COMMENT_MUTATION = gql`
  mutation UpdateComment($id: ID!, $content: String!) {
    updateComment(id: $id, content: $content) {
      comment {
        content
        likeCount
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;