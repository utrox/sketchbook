GET_FEED_DATA = """
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
"""

GET_POST_BY_ID = """
query GetPostById ($id: ID!) {
  postById(id: $id) {
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
"""

CREATE_POST = """
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
"""

UPDATE_POST = """
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
"""

DELETE_POST = """
mutation DeletePost($id: Int!) {
  deletePost(id: $id) {
    ok
  }
}
"""

USER_POST_HISTORY = """
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
"""