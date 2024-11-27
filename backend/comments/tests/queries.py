GET_COMMENTS_FOR_POST = """
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
"""

CREATE_COMMENT = """
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
"""

UPDATE_COMMENT = """
mutation UpdateComment($id: ID!, $content: String!){
  updateComment(id: $id, content: $content) {
    comment {
      content,
      likeCount,
      createdAt,
      updatedAt
    }
  }
}
"""

DELETE_COMMENT = """
mutation DeleteComment($id: ID!) {
  deleteComment(id: $id) {
    ok
  }
}
"""