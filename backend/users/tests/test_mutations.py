import os
import json
import uuid

from django.http import HttpResponse
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from graphene_django.utils.testing import GraphQLTestCase

from .queries import EDIT_USER_PROFILE


User = get_user_model()
CURRENT_DIRECTORY = os.path.dirname(os.path.realpath(__file__))


class UserProfileEditTests(GraphQLTestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.user2 = User.objects.create_user(
            username="testuser2", password="testpassword"
        )
        self.client.login(username="testuser", password="testpassword")


class UserProfileFieldsEditTests(UserProfileEditTests):
    def test_modify_username_successfully(self):
        new_username = "newusername"
        response = self.query(EDIT_USER_PROFILE, variables={"username": new_username})
        content = response.json()
        self.assertResponseNoErrors(response)
        self.assertEqual(
            content["data"]["editUserProfile"]["user"]["username"], new_username
        )
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "newusername")

    def test_modify_username_invalid(self):
        test_cases = [
            ("aa", "Username must be at least 3 and at most 20 characters long."),
            ("a" * 31, "Username must be at least 3 and at most 20 characters long."),
            ("testuser2", "A user with that username already exists."),
            ("test user", "Username must be alphanumeric."),
        ]
        for new_username, expected_error in test_cases:
            response = self.query(
                EDIT_USER_PROFILE, variables={"username": new_username}
            )
            self.assertResponseHasErrors(response)

            content = response.json()
            self.assertIn(
                expected_error,
                content["errors"][0]["message"],
            )
            self.user.refresh_from_db()
            self.assertEqual(self.user.username, "testuser")

    def test_modify_password_successfully(self):
        new_password = "3p1cP@ssw0rd"
        response = self.query(EDIT_USER_PROFILE, variables={"password": new_password})

        self.assertResponseNoErrors(response)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(new_password))

    def test_modify_password_invalid(self):
        test_cases = [
            (
                "aa",
                "This password is too short. It must contain at least 8 characters.",
            ),
            ("a" * 129, "Password must be at most 32 characters long."),
            ("password", "This password is too common."),
            ("123412321", "This password is entirely numeric."),
        ]

        for new_password, expected_error in test_cases:
            response = self.query(
                EDIT_USER_PROFILE, variables={"password": new_password}
            )
            self.assertResponseHasErrors(response)

            content = response.json()
            self.assertIn(
                expected_error,
                content["errors"][0]["message"],
            )
            self.user.refresh_from_db()
            self.assertTrue(self.user.check_password("testpassword"))


class UserProfileImagesEditTests(UserProfileEditTests):
    def _get_test_simple_file(
        self, 
        filepath: str, 
        file_upload_name: str, 
        file_ext: str, 
        content_type: str
    ) -> SimpleUploadedFile:
        # Create a SimpleUploadedFile object from the parameterized file
        upload_filepath = os.path.join(CURRENT_DIRECTORY, "files", filepath)
        with open(upload_filepath, "rb") as file:
            file_data = file.read()

        return SimpleUploadedFile(
            name=f"{file_upload_name}.{file_ext}",
            content=file_data,
            content_type=content_type,
        )

    def _make_image_upload_request(
        self, 
        t_file: SimpleUploadedFile, 
        variable_name: str
    ) -> HttpResponse:
        # Send the request to the server
        response = self.client.post(
            "/graphql",
            data={
                "operations": json.dumps(
                    {
                        "query": EDIT_USER_PROFILE,
                        "variables": {
                            variable_name: None,
                        },
                    }
                ),
                "t_file": t_file,
                "map": json.dumps(
                    {
                        "t_file": [f"variables.{variable_name}"],
                    }
                ),
            },
        )

        return response

    def test_modify_background_invalid(self):
        test_cases = [
            (
                "wrong_filetype.txt",
                "txt",
                "text/plain",
                "File type is not supported. Supported file types are: jpg, jpeg, png, webp.",
            ),
            (
                "too_small.png",
                "png",
                "image/png",
                "Image dimensions must be at least 100x100 pixels.",
            ),
            (
                "too_big.png",
                "png",
                "image/png",
                "Image dimensions must be at most 2000x2000 pixels.",
            ),
        ]

        for filepath, file_ext, content_type, expected_error in test_cases:
            # Create a SimpleUploadedFile object from the parameterized file
            unique_img_name = uuid.uuid4().hex
            simple_file = self._get_test_simple_file(
                filepath, unique_img_name, file_ext, content_type
            )
            response = self._make_image_upload_request(simple_file, "background")

            # Do basic error checking
            self.assertResponseHasErrors(response)
            content = response.json()

            # Check if the error message is as expected
            self.assertEqual(
                content["errors"][0]["message"],
                expected_error,
            )

            # Make sure the background image wasn't changed
            self.user.refresh_from_db()
            self.assertEqual(
                self.user.background.url, "/images/backgrounds/default.png"
            )

            # Make sure image was not uploaded and saved on the server
            self.assertFalse(
                os.path.exists(
                    os.path.join(
                        settings.MEDIA_IMAGES_ROOT,
                        "backgrounds",
                        f"{unique_img_name}.{file_ext}",
                    )
                )
            )

    def test_modify_background_successfully(self):
        unique_img_name = uuid.uuid4().hex
        simple_file = self._get_test_simple_file(
            "correct.png", unique_img_name, "png", "image/png"
        )

        response = self._make_image_upload_request(simple_file, "background")

        self.assertResponseNoErrors(response)
        content = response.json()
        filepath = os.path.join(
            settings.MEDIA_IMAGES_ROOT, "backgrounds", f"{unique_img_name}.png"
        )

        try:
            self.assertEqual(content["data"]["editUserProfile"]["ok"], True)

            # Make sure the background image was changed
            self.user.refresh_from_db()
            print("sometimes you gotta pop up and show ",self.user.background.url)
            self.assertTrue(self.user.background.url.endswith(f"{unique_img_name}.png"))

            # Make sure image was uploaded and saved on the server

            self.assertTrue(os.path.exists(filepath))
        finally:
            # Remove the uploaded image
            os.remove(
                os.path.join(
                    settings.MEDIA_IMAGES_ROOT, "backgrounds", f"{unique_img_name}.png"
                )
            )

    def test_modify_avatar_invalid(self):
        test_cases = [
            (
                "wrong_filetype.txt",
                "txt",
                "text/plain",
                "File type is not supported. Supported file types are: jpg, jpeg, png, webp.",
            ),
            (
                "too_small.png",
                "png",
                "image/png",
                "Image dimensions must be at least 100x100 pixels.",
            ),
            (
                "too_big.png",
                "png",
                "image/png",
                "Image dimensions must be at most 2000x2000 pixels.",
            ),
        ]

        for filename, file_ext, content_type, expected_error in test_cases:
            # Create a SimpleUploadedFile object from the parameterized file
            unique_img_name = uuid.uuid4().hex
            simple_file = self._get_test_simple_file(
                filename, unique_img_name, file_ext, content_type
            )

            # Send the request to the server
            response = self._make_image_upload_request(simple_file, "avatar")

            # Do basic error checking
            self.assertResponseHasErrors(response)
            content = response.json()

            # Check if the error message is as expected
            self.assertEqual(content["errors"][0]["message"], expected_error)

            # Make sure the avatar image wasn't changed
            self.user.refresh_from_db()
            self.assertEqual(self.user.avatar.url, "/images/avatars/default.png")

            # Make sure image was not uploaded and saved on the server
            self.assertFalse(
                os.path.exists(
                    os.path.join(
                        settings.MEDIA_IMAGES_ROOT, "avatars", f"{unique_img_name}.png"
                    )
                )
            )

    def test_modify_avatar_successfully(self):
        unique_img_name = uuid.uuid4().hex

        simple_file = self._get_test_simple_file(
            "correct.png", unique_img_name, "png", "image/png"
        )
        response = self._make_image_upload_request(simple_file, "avatar")

        self.assertResponseNoErrors(response)
        content = response.json()
        filepath = os.path.join(
            settings.MEDIA_IMAGES_ROOT, "avatars", f"{unique_img_name}.png"
        )

        try:
            self.assertEqual(content["data"]["editUserProfile"]["ok"], True)

            # Make sure the avatar image was changed
            self.user.refresh_from_db()
            self.assertTrue(self.user.avatar.url.endswith(f"{unique_img_name}.png"))

            # Make sure image was uploaded and saved on the server
            self.assertTrue(os.path.exists(filepath))
        finally:
            # Remove the uploaded image
            os.remove(filepath)
