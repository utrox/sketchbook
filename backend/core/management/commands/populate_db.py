import os
import random
import string
import requests
from datetime import datetime
from collections import defaultdict

from faker import Faker
from django.conf import settings
from django.core.management.base import BaseCommand

from posts.models import Post
from comments.models import Comment
from likes.models import PostLike, CommentLike
from users.models import User, BACKGROUND_UPLOAD_PATH, AVATAR_UPLOAD_PATH


# TODO: random created_at
fake = Faker()

NO_USERS = 20
NO_POSTS = 100
NO_COMMENTS = 500
# If you modify these values too high, the command will take
# a long time to run, or might run infinitely.
NO_POST_LIKES = 1000
NO_COMMENT_LIKES = 3000  

class Command(BaseCommand):
    """
    With this command we can populate the database with random data.
    Still more comprehensive than twitter.
    """

    help = "Populate the database with random data."

    def _generate_password(self) -> str:
        return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(10))

    def _generate_users(self, no_users: int) -> None:        
        users = []
        
        self.stdout.write("Creating users...")
        for i in range(no_users):
            bg_request = requests.get("https://picsum.photos/800/300")
            
            file_name = f"bg-{i}.png"
            with open(os.path.join(settings.MEDIA_ROOT, BACKGROUND_UPLOAD_PATH, file_name), "wb") as f:
                f.write(bg_request.content)
            
            avatar_request = requests.get("https://picsum.photos/200")
            avatar_file_name = f"avatar-{i}.png"
            with open(os.path.join(settings.MEDIA_ROOT, AVATAR_UPLOAD_PATH, avatar_file_name), "wb") as f:
                f.write(avatar_request.content)
            
            user = User(
                username=fake.profile()['username'],
                password=self._generate_password(),
                avatar=os.path.join(AVATAR_UPLOAD_PATH, avatar_file_name),
                background=os.path.join(BACKGROUND_UPLOAD_PATH, file_name)
                )
            users.append(user)
        User.objects.bulk_create(users)
        self.stdout.write(f"Created {no_users} users.")

    def _generate_posts(self, no_posts: int) -> None:
        self.stdout.write("Creating posts...")
        posts = []
        for _ in range(no_posts):
            user = User.objects.order_by('?').first()
            post = Post(
                user=user,
                content=fake.text(),
            )

            posts.append(post)

        Post.objects.bulk_create(posts)

        # Force the database to update the created_at field
        # to a random date in the past year.
        for p in posts:
            fake_date1 = fake.date_time_this_month(before_now=True, after_now=False)
            p.created_at = p.updated_at = fake_date1

            if random.random() < 0.2:
                p.updated_at = fake.date_time_between_dates(fake_date1, datetime.now())
        
        Post.objects.bulk_update(posts, ['created_at', 'updated_at'])
        self.stdout.write(f"Created {no_posts} posts.")

    def _generate_comments(self, no_comments: int) -> None:
        self.stdout.write("Creating comments...")
        comments = []

        for _ in range(no_comments):
            user = User.objects.order_by('?').first()
            post = Post.objects.order_by('?').first()
            
            comment = Comment(
                user=user,
                post=post,
                content=fake.text(),
            )
            comments.append(comment)
        Comment.objects.bulk_create(comments)

        # Force the database to update the created_at field
        # to a random date in the past year.
        for c in comments:
            fake_date1 = fake.date_time_this_month(before_now=True, after_now=False)
            c.created_at = c.updated_at = fake_date1

            if random.random() < 0.2:
                c.updated_at = fake.date_time_between_dates(fake_date1, datetime.now())
        
        Comment.objects.bulk_update(comments, ['created_at', 'updated_at'])
        self.stdout.write(f"Created {no_comments} comments.")

    def _generate_post_likes(self, no_post_likes: int) -> None:
        self.stdout.write("Creating post likes...")
        post_likes = []
        mapping = defaultdict(list)

        for _ in range(no_post_likes):
            user = User.objects.order_by('?').first()
            post = Post.objects.order_by('?').first()

            # Avoid duplicate likes on the same item,
            # as that would throw an unique together exception.
            while post.pk in mapping[user.pk]:
                post = Post.objects.order_by('?').first()
            
            post_like = PostLike(
                user=user,
                post=post
            )
            post_likes.append(post_like)
            mapping[user.pk].append(post.pk)
        PostLike.objects.bulk_create(post_likes)
        self.stdout.write(f"Created {no_post_likes} post likes.")

    def _generate_comment_likes(self, no_comment_likes: int) -> None:
        self.stdout.write("Creating comment likes...")
        comment_likes = []
        mapping = defaultdict(list)

        for _ in range(no_comment_likes):
            user = User.objects.order_by('?').first()
            comment = Comment.objects.order_by('?').first()
            # Avoid duplicate likes on the same item,
            # as that would throw an unique together exception.
            while comment.pk in mapping[user.pk]:
                comment = Comment.objects.order_by('?').first()
            
            comment_like = CommentLike(
                user=user,
                comment=comment
            )
            comment_likes.append(comment_like)
            mapping[user.pk].append(comment.pk)

        CommentLike.objects.bulk_create(comment_likes)
        self.stdout.write(f"Created {no_comment_likes} comment likes.")

    def handle(self, *args, **options):
        self.stdout.write("Populating the database with random data...")
        self._generate_users(NO_USERS)
        self._generate_posts(NO_POSTS)
        self._generate_comments(NO_COMMENTS)
        self._generate_post_likes(NO_POST_LIKES)
        self._generate_comment_likes(NO_COMMENT_LIKES)
        self.stdout.write("Database populated successfully.")
