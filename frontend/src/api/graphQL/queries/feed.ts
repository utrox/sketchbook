import { gql } from "@apollo/client";

export const GET_FEED_DATA = gql`
  query GetFeed($first: Int, $after: String) {
    feed(first: $first, after: $after) {
      edges {
        node {
          id
          content
          image
          commentCount
          likeCount
          likedByUser
          createdAt
          updatedAt
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
