import graphene

from comments.schema import Query as CommentsQuery, Mutation as CommentsMutation
from likes.schema import Query as LikesQuery, Mutation as LikesMutation
from posts.schema import Query as PostsQuery, Mutation as PostsMutation
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


class Mutation(
        CommentsMutation,
        PostsMutation,
        LikesMutation,
        graphene.ObjectType
    ):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
