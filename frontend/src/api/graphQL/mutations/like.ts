import { gql } from "@apollo/client";

export const TOGGLE_POST_LIKE = gql`
  mutation TogglePostLike($postId: ID!) {
    togglePostLike(postId: $postId) {
      post {
        id
        likeCount
        likedByUser
      }
    }
  }
`;

export const TOGGLE_COMMENT_LIKE = gql`
  mutation ToggleCommentLike($commentId: ID!) {
    toggleCommentLike(commentId: $commentId) {
      comment {
        id
        likeCount
        likedByUser
      }
    }
  }
`;
