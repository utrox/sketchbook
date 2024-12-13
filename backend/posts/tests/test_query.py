import json
import logging

from graphene_django.utils.testing import GraphQLTestCase
from django.contrib.auth import get_user_model

from likes.models import PostLike

from .queries import *
from ..models import Post


User = get_user_model()


class PostQueryBase(GraphQLTestCase):
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


class PostQueryTests(PostQueryBase):
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


class PostHistoryQueryTests(PostQueryBase):
    def setUp(self):
        super().setUp()
        self.posts2 = []
        for i in range(5):
            self.posts2.append(Post.objects.create(content=f"{i}-post", user=self.user2))

    def test_post_history_shows_correct_posts(self):
        response = self.query(USER_POST_HISTORY, variables={'username': 'testuser'})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content['data']['postHistory']['edges']), 12)
        self.assertEqual(content['data']['postHistory']['pageInfo']['hasNextPage'], False)
        posts = content['data']['postHistory']['edges']

        expected_post_contents = [f"{i}-post" for i in range(12)]
        for post in posts:
            if post['node']['content'] in expected_post_contents:
                expected_post_contents.remove(post['node']['content'])
            else:
                self.fail("Post content not in results.")

        if len(expected_post_contents) > 0:
            self.fail("Not all correct posts were returned.")
    
    def test_post_history_pagination(self):
        response = self.query(USER_POST_HISTORY, variables={'first': 5, 'username': 'testuser'})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content['data']['postHistory']['edges']), 5)
        self.assertEqual(content['data']['postHistory']['pageInfo']['hasNextPage'], True)

        response2 = self.query(USER_POST_HISTORY, variables={
            'first': 5,
            'username': 'testuser',
            'after': content['data']['postHistory']['pageInfo']['endCursor']
        })
        content2 = json.loads(response2.content)
        self.assertResponseNoErrors(response2)
        self.assertEqual(len(content2['data']['postHistory']['edges']), 5)
        self.assertEqual(content2['data']['postHistory']['pageInfo']['hasNextPage'], True)

        response3 = self.query(USER_POST_HISTORY, variables={
            'first': 5,
            'username': 'testuser',
            'after': content2['data']['postHistory']['pageInfo']['endCursor']
        })
        content3 = json.loads(response3.content)
        self.assertResponseNoErrors(response3)
        self.assertEqual(len(content3['data']['postHistory']['edges']), 2)
        self.assertEqual(content3['data']['postHistory']['pageInfo']['hasNextPage'], False)
    
    def test_post_history_no_posts(self):
        response = self.query(USER_POST_HISTORY, variables={'username': 'testuser3'})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content['data']['postHistory']['edges']), 0)
        self.assertEqual(content['data']['postHistory']['pageInfo']['hasNextPage'], False)

    def test_post_history_nonexistant_user(self):
        response = self.query(USER_POST_HISTORY, variables={'username': 'nonexistantuser'})
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertIn("User not found.", content['errors'][0]['message'])
