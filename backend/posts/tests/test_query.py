import json
import logging

from graphql_relay import to_global_id
from graphene_django.utils.testing import GraphQLTestCase
from django.contrib.auth import get_user_model

from likes.models import PostLike

from .queries import *
from ..models import Post


User = get_user_model()

class PostQueryTests(GraphQLTestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpassword2')
        self.user3 = User.objects.create_user(
            username='testuser3', password='testpassword3')
        self.posts = []
        for i in range(12):
            self.posts.append(Post.objects.create(content=f"{i}-post", user=self.user))
        PostLike.objects.create(post=self.posts[0], user=self.user)
        PostLike.objects.create(post=self.posts[0], user=self.user2)
        # Disable logging for tests
        logging.disable(logging.CRITICAL)

    def test_query_posts(self):
        response = self.query(GET_FEED_DATA, variables={'first': 10})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content['data']['feed']['edges']), 10)
        self.assertEqual(content['data']['feed']['pageInfo']['hasNextPage'], True)

        response2 = self.query(GET_FEED_DATA, variables={'first': 10, 'after': content['data']['feed']['pageInfo']['endCursor']})
        content2 = json.loads(response2.content)

        self.assertResponseNoErrors(response2)
        self.assertEqual(len(content2['data']['feed']['edges']), 2)
        self.assertEqual(content2['data']['feed']['pageInfo']['hasNextPage'], False)

    def test_liker_count(self):
        response = self.query(GET_POST_BY_ID, variables={'id': self.posts[0].id})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['postById']['likeCount'], 2)

        response = self.query(GET_POST_BY_ID, variables={'id': self.posts[1].id})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['postById']['likeCount'], 0)

    def test_liked_by_user(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(GET_POST_BY_ID, variables={'id': self.posts[0].id})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['postById']['likedByUser'], True)

        response = self.query(GET_POST_BY_ID, variables={'id': self.posts[1].id})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['postById']['likedByUser'], False)
