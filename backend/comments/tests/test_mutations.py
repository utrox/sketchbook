import json
import logging

from graphene_django.utils.testing import GraphQLTestCase
from django.contrib.auth import get_user_model

from posts.models import Post

from .queries import *
from ..models import Comment

User = get_user_model()

class CommentMutationTests(GraphQLTestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpassword2')
        self.post = Post.objects.create(
            content="This is my post!", user=self.user2)
        self.comment = Comment.objects.create(
            content="Hello, world!", 
            user=self.user2,
            post=self.post
        )
        logging.disable(logging.CRITICAL)

    def assertCommentNotAddedToPost(self):
        self.assertEqual(len(self.post.comments.all()), 1)

    def assertCommentAddedToPost(self):
        self.assertEqual(len(self.post.comments.all()), 2)

    def test_create_comment_unauthenticated(self):
        response = self.query(
            CREATE_COMMENT,
            variables={
                'postId': self.post.id,
                'content': "Test content."
            },
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("You must be logged in to create a comment.", content['errors'][0]['message'])
        self.assertFalse(Comment.objects.filter(content="Test content.", user=self.user).exists())
        self.assertCommentNotAddedToPost()

    def test_create_comment_empty_content(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            CREATE_COMMENT,
            variables={
                'postId': self.post.id,
                'content': ""
            },
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("This field cannot be blank.", content['errors'][0]['message'])
        self.assertCommentNotAddedToPost()

    def test_create_comment_for_non_existent_post(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            CREATE_COMMENT,
            variables={
                'postId': 999,
                'content': "Test content."
            },
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Post does not exist.", content['errors'][0]['message'])
        self.assertFalse(Comment.objects.filter(content="Test content.", user=self.user).exists())

    def test_create_comment_too_long(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            CREATE_COMMENT,
            variables={
                'postId': self.post.id,
                'content': "a" * 281
            },
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Ensure this value has at most 280 characters (it has 281).", content['errors'][0]['message'])
        self.assertCommentNotAddedToPost()

    def test_create_comment_too_short(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            CREATE_COMMENT,
            variables={
                'postId': self.post.id,
                'content': "aa"
            },
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Ensure this value has at least 3 characters (it has 2).", content['errors'][0]['message'])
        self.assertCommentNotAddedToPost()

    def test_create_comment_successfully(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            CREATE_COMMENT,
            variables={
                'postId': self.post.id,
                'content': "Test content."
            },
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['createComment']['comment']['content'], "Test content.")
        self.assertEqual(content['data']['createComment']['comment']['user']['username'], "testuser")
        self.assertTrue(Comment.objects.filter(content="Test content.", user=self.user).exists())
        self.assertEqual(len(self.post.comments.all()), 2)

    def test_update_comment_unauthenticated(self):
        response = self.query(
            UPDATE_COMMENT,
            variables={'id': self.comment.id, 'content': "Updated content."},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("You are not authorized to edit this comment.", content['errors'][0]['message'])
        self.assertTrue(Comment.objects.filter(content="Hello, world!").exists())

    def test_update_comment_unauthorized(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            UPDATE_COMMENT,
            variables={'id': self.comment.id, 'content': "Updated content."},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("You are not authorized to edit this comment.", content['errors'][0]['message'])
        self.assertTrue(Comment.objects.filter(content="Hello, world!").exists())

    def test_update_comment_not_found(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            UPDATE_COMMENT,
            variables={'id': 999, 'content': "Updated content."},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Comment does not exist.", content['errors'][0]['message'])
    
    def test_update_comment_too_long(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            UPDATE_COMMENT,
            variables={'id': self.comment.id, 'content': "a" * 281},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Ensure this value has at most 280 characters (it has 281).", content['errors'][0]['message'])
        self.assertTrue(Comment.objects.filter(content="Hello, world!").exists())

    def test_update_comment_too_short(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            UPDATE_COMMENT,
            variables={'id': self.comment.id, 'content': "aa"},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Ensure this value has at least 3 characters (it has 2).", content['errors'][0]['message'])
        self.assertTrue(Comment.objects.filter(content="Hello, world!").exists())

    def test_update_comment_successfully(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            UPDATE_COMMENT,
            variables={'id': self.comment.id, 'content': "Updated content."},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['updateComment']['comment']['content'], "Updated content.")
        self.assertTrue(Comment.objects.filter(content="Updated content.", post=self.post).exists())

    def test_delete_comment_unauthenticated(self):
        response = self.query(
            DELETE_COMMENT,
            variables={'id': self.comment.id},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("You are not authorized to delete this comment.", content['errors'][0]['message'])
        self.assertCommentNotAddedToPost()
    
    def test_delete_comment_unauthorized(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(
            DELETE_COMMENT,
            variables={'id': self.comment.id},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("You are not authorized to delete this comment.", content['errors'][0]['message'])
        self.assertCommentNotAddedToPost()

    def test_delete_comment_not_found(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            DELETE_COMMENT,
            variables={'id': 999},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        self.assertIn("Comment does not exist.", content['errors'][0]['message'])
    
    def test_delete_comment_successfully(self):
        self.client.login(username='testuser2', password='testpassword2')
        response = self.query(
            DELETE_COMMENT,
            variables={'id': self.comment.id},
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        self.assertFalse(Comment.objects.filter(content="Hello, world!").exists())
        self.assertEqual(len(self.post.comments.all()), 0)
        self.assertEqual(content['data']['deleteComment']['ok'], True)
