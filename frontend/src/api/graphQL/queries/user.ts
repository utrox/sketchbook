import { gql } from "@apollo/client";

export const GET_USER_DATA = gql`
  query GetUser($username: String!) {
    userProfile(username: $username) {
      id
      username
      background
      avatar
      createdAt
    }
  }
`;

export const GET_USER_POST_HISTORY = gql`
  query GetUserPostHistory($username: String!, $after: String, $first: Int) {
    postHistory(username: $username, after: $after, first: $first) {
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
      }
    }
  }
`;
