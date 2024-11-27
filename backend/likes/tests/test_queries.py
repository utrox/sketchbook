import json
from graphene_django.utils.testing import GraphQLTestCase
from django.contrib.auth import get_user_model

from .queries import *
from ..models import CommentLike, PostLike
from posts.models import Post
from comments.models import Comment

User = get_user_model()


class CommentLikeQueryTests(GraphQLTestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username='testuser', password='testpassword')
        cls.post = Post.objects.create(content='test post', user=cls.user)
        cls.comment = Comment.objects.create(
            content='test comment', user=cls.user, post=cls.post)
        
        for i in range(24):
            u = User.objects.create_user(
                username=f'testuser{i}', password='testpassword')
            if i % 2 == 0:
                CommentLike.objects.create(
                    user=u, comment=cls.comment)
            else:
                PostLike.objects.create(
                    user=u, post=cls.post)
            
    def test_query_all_likers_for_comment(self):
        response = self.query(GET_LIKERS_FOR_COMMENT, variables={
            'commentId': self.comment.id,
            'first': 10,
            'after': None
        })
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content['data']['allLikersForComment']['edges']), 10)
        self.assertEqual(content['data']['allLikersForComment']['pageInfo']['hasNextPage'], True)

        response2 = self.query(GET_LIKERS_FOR_COMMENT, variables={
            'commentId': self.comment.id,
            'first': 10,
            'after': content['data']['allLikersForComment']['pageInfo']['endCursor']
        })
        content2 = json.loads(response2.content)
        self.assertResponseNoErrors(response2)
        self.assertEqual(len(content2['data']['allLikersForComment']['edges']), 2)
        self.assertEqual(content2['data']['allLikersForComment']['pageInfo']['hasNextPage'], False)

    def test_query_all_likers_for_post(self):
        response = self.query(GET_LIKERS_FOR_POST, variables={
            'postId': self.post.id,
            'first': 10
        })
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content['data']['allLikersForPost']['edges']), 10)
        self.assertEqual(content['data']['allLikersForPost']['pageInfo']['hasNextPage'], True)

        response2 = self.query(GET_LIKERS_FOR_POST, variables={
            'postId': self.post.id,
            'first': 10,
            'after': content['data']['allLikersForPost']['pageInfo']['endCursor']
        })
        content2 = json.loads(response2.content)
        self.assertResponseNoErrors(response2)
        self.assertEqual(len(content2['data']['allLikersForPost']['edges']), 2)
        self.assertEqual(content2['data']['allLikersForPost']['pageInfo']['hasNextPage'], False)

    def test_query_for_nonexistant_comment(self):
        response = self.query(GET_LIKERS_FOR_COMMENT, variables={
            'commentId': 9999,
            'first': 10
        })
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Comment does not exist.')

    def test_query_for_nonexistant_post(self):
        response = self.query(GET_LIKERS_FOR_POST, variables={
            'postId': 9999,
            'first': 10
        })
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Post does not exist.')

    def test_query_for_missing_comment_id(self):
        response = self.query(GET_LIKERS_FOR_COMMENT)
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "Variable '$commentId' of required type 'ID!' was not provided.")

    def test_query_for_missing_post_id(self):
        response = self.query(GET_LIKERS_FOR_POST)
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "Variable '$postId' of required type 'ID!' was not provided.")
