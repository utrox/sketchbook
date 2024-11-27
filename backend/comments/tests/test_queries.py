import json
from graphene_django.utils.testing import GraphQLTestCase
from django.contrib.auth import get_user_model

from .queries import *
from ..models import Comment
from posts.models import Post

User = get_user_model()


class CommentQueryTests(GraphQLTestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.post = Post.objects.create(content='test post', user=self.user)
        self.comments = []
        for i in range(12):
            self.comments.append(Comment.objects.create(
                content=f"{i}-comment", user=self.user, post=self.post))
            
    def test_query_comments(self):
        response = self.query(GET_COMMENTS_FOR_POST, variables={'postId': self.post.id, 'first': 10})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content['data']['allCommentsForPost']['edges']), 10)
        self.assertEqual(content['data']['allCommentsForPost']['pageInfo']['hasNextPage'], True)

        response2 = self.query(GET_COMMENTS_FOR_POST, variables={'postId': self.post.id, 'first': 10, 'after': content['data']['allCommentsForPost']['pageInfo']['endCursor']})
        content2 = json.loads(response2.content)

        self.assertResponseNoErrors(response2)
        self.assertEqual(len(content2['data']['allCommentsForPost']['edges']), 2)
        self.assertEqual(content2['data']['allCommentsForPost']['pageInfo']['hasNextPage'], False)

    def test_query_for_nonexistant_post(self):
        response = self.query(GET_COMMENTS_FOR_POST, variables={'postId': 9999})
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Post does not exist.')

    def test_query_for_missing_post_id(self):
        response = self.query(GET_COMMENTS_FOR_POST)
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "Variable '$postId' of required type 'ID!' was not provided.")
