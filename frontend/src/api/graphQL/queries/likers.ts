import { gql } from "@apollo/client";

export const GET_LIKERS_FOR_COMMENT = gql`
  query GetLikersForComment($commentId: ID!, $first: Int!, $after: String) {
    allLikersForComment(commentId: $commentId, first: $first, after: $after) {
      edges {
        node {
          user {
            username
            avatar
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_LIKERS_FOR_POST = gql`
  query GetLikersForPost($postId: ID!, $first: Int!, $after: String) {
    allLikersForPost(postId: $postId, first: $first, after: $after) {
      edges {
        node {
          user {
            username
            avatar
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
