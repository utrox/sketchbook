import graphene

from comments.schema import Query as CommentsQuery
from likes.schema import Query as LikesQuery
from posts.schema import Query as PostsQuery
from users.schema import Query as UsersQuery


# Merge all queries into one
class Query(
        CommentsQuery,
        LikesQuery,
        PostsQuery,
        UsersQuery,
        graphene.ObjectType
    ):
    pass


schema = graphene.Schema(query=Query)
