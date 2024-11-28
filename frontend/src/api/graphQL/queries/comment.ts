import { gql } from "@apollo/client";

export const GET_COMMENTS_FOR_POST = gql`
  query GetCommentsForPost($postId: ID!, $first: Int, $after: String) {
    allCommentsForPost(postId: $postId, first: $first, after: $after) {
      edges {
        node {
          id
          content
          likeCount
          likedByUser
          createdAt
          updatedAt
          user {
            id
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
