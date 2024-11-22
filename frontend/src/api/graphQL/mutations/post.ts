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

export const EDIT_POST_MUTATION = gql`
  mutation UpdatePost($id: Int!, $content: String!) {
    updatePost(id: $id, postData: { content: $content }) {
      post {
        content
        image
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

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id) {
      ok
    }
  }
`;
