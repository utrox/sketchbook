GET_LIKERS_FOR_COMMENT = '''
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
'''

GET_LIKERS_FOR_POST = """
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
"""

TOGGLE_POST_LIKE = """
mutation TogglePostLike($postId: ID!) {
    togglePostLike(postId: $postId) {
      post {
        id
        likeCount
        likedByUser
      }
    }
  }
"""

TOGGLE_COMMENT_LIKE = """
mutation ToggleCommentLike($commentId: ID!) {
    toggleCommentLike(commentId: $commentId) {
      comment {
        id
        likeCount
        likedByUser
      }
    }
}
"""