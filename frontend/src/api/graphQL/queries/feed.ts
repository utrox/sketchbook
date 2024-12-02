import { gql } from "@apollo/client";

export const GET_FEED_DATA = gql`
  query GetFeed($first: Int, $after: String, $before: String) {
    feed(first: $first, after: $after, before: $before) {
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
            id
            username
            avatar
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
`;
