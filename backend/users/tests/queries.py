EDIT_USER_PROFILE = """
mutation EditUserProfile(
    $username: String
    $password: String
    $avatar: Upload
    $background: Upload
  ) {
    editUserProfile(
      username: $username
      password: $password
      avatar: $avatar
      background: $background
    ) {
      ok
      user {
        id
        username
        avatar
        background
      }
    }
  }
"""

QUERY_USER_PROFILE = """
query GetUser($username: String!) {
    userProfile(username: $username) {
      id
      username
      background
      avatar
      createdAt
    }
  }
"""

QUERY_ME = """
query Me {
    me {
      id
      username
      avatar
    }
  }
"""