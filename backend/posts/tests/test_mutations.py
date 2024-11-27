import json
from graphene_django.utils.testing import GraphQLTestCase
from django.contrib.auth import get_user_model

from .queries import *
from ..models import Post

User = get_user_model()

class PostMutationTests(GraphQLTestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpassword2')
        self.post = Post.objects.create(
            content="Hello, world!", user=self.user2)

    def test_create_post_unauthenticated(self):
        response = self.query(
            CREATE_POST,
            variables={'content': "Test content."},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("You must be logged in to create a post.", content['errors'][0]['message'])

    def test_create_post_empty_content(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            CREATE_POST,
            variables={'content': ""},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("This field cannot be blank.", content['errors'][0]['message'])

    def test_create_post_too_long(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            CREATE_POST,
            variables={'content': "a" * 281},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Ensure this value has at most 280 characters (it has 281).", content['errors'][0]['message'])

    def test_create_post_too_short(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            CREATE_POST,
            variables={'content': "a" * 2},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Ensure this value has at least 3 characters (it has 2).", content['errors'][0]['message'])

    def test_create_post_successfully(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            CREATE_POST,
            variables={'content': "Test content."},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['createPost']['post']['content'], "Test content.")
        self.assertEqual(content['data']['createPost']['post']['user']['username'], "testuser")
        self.assertTrue(Post.objects.filter(content="Test content.", user=self.user).exists())

    def test_update_post_unauthenticated(self):
        response = self.query(
            UPDATE_POST,
            variables={'id': self.post.id, 'content': "Updated content."},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("You are not authorized to edit this post.", content['errors'][0]['message'])

    def test_update_post_unauthorized(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            UPDATE_POST,
            variables={'id': self.post.id, 'content': "Updated content."},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("You are not authorized to edit this post.", content['errors'][0]['message'])
        
    def test_update_post_successfully(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            UPDATE_POST,
            variables={'id': self.post.id, 'content': "Updated content."},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['updatePost']['post']['content'], "Updated content.")
        self.assertEqual(content['data']['updatePost']['post']['user']['username'], "testuser2")
        self.assertTrue(Post.objects.filter(content="Updated content.", user=self.user2).exists())

    def test_update_post_not_found(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            UPDATE_POST,
            variables={'id': 999, 'content': "Updated content."},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Post does not exist.", content['errors'][0]['message'])

    def test_update_post_empty_content(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            UPDATE_POST,
            variables={'id': self.post.id, 'content': ""},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("This field cannot be blank.", content['errors'][0]['message'])

    def test_update_post_too_long(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            UPDATE_POST,
            variables={'id': self.post.id, 'content': "a" * 281},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Ensure this value has at most 280 characters (it has 281).", content['errors'][0]['message'])

    def test_update_post_too_short(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            UPDATE_POST,
            variables={'id': self.post.id, 'content': "a" * 2},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Ensure this value has at least 3 characters (it has 2).", content['errors'][0]['message'])

    def test_delete_post_unauthenticated(self):
        response = self.query(
            DELETE_POST,
            variables={'id': self.post.id},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("You are not authorized to delete this post.", content['errors'][0]['message'])
    
    def test_delete_post_unauthorized(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            DELETE_POST,
            variables={'id': self.post.id},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("You are not authorized to delete this post.", content['errors'][0]['message'])
    
    def test_delete_post_successfully(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            DELETE_POST,
            variables={'id': self.post.id},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        self.assertTrue(content['data']['deletePost']['ok'])
        self.assertFalse(Post.objects.filter(id=self.post.id).exists())

    def test_delete_post_not_found(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            DELETE_POST,
            variables={'id': 999},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Post does not exist.", content['errors'][0]['message'])