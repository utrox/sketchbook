import json
from graphene_django.utils.testing import GraphQLTestCase
from django.contrib.auth import get_user_model

from .queries import *
from ..models import CommentLike, PostLike

from comments.models import Comment
from posts.models import Post

User = get_user_model()

class PostLikeMutationTests(GraphQLTestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.post = Post.objects.create(content='test post', user=self.user)
        self.post2 = Post.objects.create(content='test post 2', user=self.user)
        PostLike.objects.create(user=self.user, post=self.post2)
    
    def test_toggle_post_like_on(self):
        self.client.force_login(self.user)
        response = self.query(TOGGLE_POST_LIKE, variables={'postId': self.post.id})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['togglePostLike']['post']['likeCount'], 1)
        self.assertTrue(content['data']['togglePostLike']['post']['likedByUser'])

    def test_toggle_post_like_off(self):
        self.client.force_login(self.user)
        response = self.query(TOGGLE_POST_LIKE, variables={'postId': self.post2.id})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['togglePostLike']['post']['likeCount'], 0)
        self.assertFalse(content['data']['togglePostLike']['post']['likedByUser'])

    def test_toggle_post_like_twice(self):
        self.client.force_login(self.user)
        response = self.query(TOGGLE_POST_LIKE, variables={'postId': self.post.id})
        response = self.query(TOGGLE_POST_LIKE, variables={'postId': self.post.id})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['togglePostLike']['post']['likeCount'], 0)
        self.assertFalse(content['data']['togglePostLike']['post']['likedByUser'])
    
    def test_toggle_post_like_unauthenticated(self):
        response = self.query(TOGGLE_POST_LIKE, variables={'postId': self.post.id})
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "You must be logged in to like a post.")
    
    def test_toggle_post_like_missing_post_id(self):
        self.client.force_login(self.user)
        response = self.query(TOGGLE_POST_LIKE)
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "Variable '$postId' of required type 'ID!' was not provided.")
    
    def test_toggle_post_like_nonexistant_post(self):
        self.client.force_login(self.user)
        response = self.query(TOGGLE_POST_LIKE, variables={'postId': 9999})
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "Post does not exist.")
    

class CommentLikeMutationTests(GraphQLTestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.post = Post.objects.create(content='test post', user=self.user)
        self.comment = Comment.objects.create(
            content='test comment', user=self.user, post=self.post)
        self.comment2 = Comment.objects.create(
            content='test comment 2', user=self.user, post=self.post)
        CommentLike.objects.create(user=self.user, comment=self.comment2)

    def test_toggle_comment_like_on(self):
        self.client.force_login(self.user)
        response = self.query(TOGGLE_COMMENT_LIKE, variables={'commentId': self.comment.id})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['toggleCommentLike']['comment']['likeCount'], 1)
        self.assertTrue(content['data']['toggleCommentLike']['comment']['likedByUser'])

    def test_toggle_comment_like_off(self):
        self.client.force_login(self.user)
        response = self.query(TOGGLE_COMMENT_LIKE, variables={'commentId': self.comment2.id})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['toggleCommentLike']['comment']['likeCount'], 0)
        self.assertFalse(content['data']['toggleCommentLike']['comment']['likedByUser'])

    def test_toggle_comment_like_twice(self):
        self.client.force_login(self.user)
        response = self.query(TOGGLE_COMMENT_LIKE, variables={'commentId': self.comment.id})
        response = self.query(TOGGLE_COMMENT_LIKE, variables={'commentId': self.comment.id})
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['toggleCommentLike']['comment']['likeCount'], 0)
        self.assertFalse(content['data']['toggleCommentLike']['comment']['likedByUser'])

    def test_toggle_comment_like_unauthenticated(self):
        response = self.query(TOGGLE_COMMENT_LIKE, variables={'commentId': self.comment.id})
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "You must be logged in to like a comment.")
    
    def test_toggle_comment_like_missing_comment_id(self):
        self.client.force_login(self.user)
        response = self.query(TOGGLE_COMMENT_LIKE)
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "Variable '$commentId' of required type 'ID!' was not provided.")
    
    def test_toggle_comment_like_nonexistant_comment(self):
        self.client.force_login(self.user)
        response = self.query(TOGGLE_COMMENT_LIKE, variables={'commentId': 9999})
        content = json.loads(response.content)
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "Comment does not exist.")
         