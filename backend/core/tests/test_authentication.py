import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from core.exceptions import BadRequestException, UnauthorizedException, ConflictException

User = get_user_model()


class AuthenticationViewsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user_password = 'StrongP@ssw0rd'
        self.user = User.objects.create_user(username='testuser', password=self.user_password)

    def test_login_successful(self):
        response = self.client.post(
            reverse('login_view'),
            data=json.dumps({'username': self.user.username, 'password': self.user_password}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 302)  # Redirect on success
        self.assertEqual(response.url, '/')  # Redirects to home
        self.assertTrue(response.wsgi_request.user.is_authenticated)

    def test_login_invalid_credentials(self):
        response = self.client.post(
            reverse('login_view'),
            data=json.dumps({'username': self.user.username, 'password': 'wrongpassword'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)  # Unauthorized
        self.assertFalse(response.wsgi_request.user.is_authenticated)

    def test_login_empty_body(self):
        response = self.client.post(reverse('login_view'), data='', content_type='application/json')
        self.assertEqual(response.status_code, 400)  # Bad Request
        self.assertFalse(response.wsgi_request.user.is_authenticated)

    def test_login_invalid_json(self):
        response = self.client.post(reverse('login_view'), data='invalid json', content_type='application/json')
        self.assertEqual(response.status_code, 400)  # Bad Request

    def test_login_missing_fields(self):
        response = self.client.post(
            reverse('login_view'),
            data=json.dumps({'username': ''}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)  # Bad Request
        self.assertFalse(response.wsgi_request.user.is_authenticated)

    def test_logout_successful(self):
        self.client.force_login(self.user)  # Log in the user first
        response = self.client.post(reverse('logout_view'))
        self.assertEqual(response.status_code, 302)  # Redirects on success
        self.assertEqual(response.url, '/')  # Redirects to home
        self.assertFalse(response.wsgi_request.user.is_authenticated)

    def test_logout_unauthenticated(self):
        response = self.client.post(reverse('logout_view'))
        self.assertEqual(response.status_code, 302)  # Redirects on success
        self.assertEqual(response.url, '/')  # Redirects to home
        self.assertFalse(response.wsgi_request.user.is_authenticated)

    def test_register_empty_body(self):
        response = self.client.post(reverse('register_view'), data='', content_type='application/json')
        self.assertEqual(response.status_code, 400)  # Bad Request

    def test_register_invalid_json(self):
        response = self.client.post(reverse('register_view'), data='invalid json', content_type='application/json')
        self.assertEqual(response.status_code, 400)  # Bad Request

    def test_register_missing_fields(self):
        response = self.client.post(
            reverse('register_view'),
            data=json.dumps({'username': 'newuser'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)  # Bad Request

    def test_register_invalid_password_short(self):
        response = self.client.post(
            reverse('register_view'),
            data=json.dumps({'username': 'newuser', 'password': 'Asztal2'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)  # Bad Request

    def test_register_invalid_password_numeric(self):
        response = self.client.post(
            reverse('register_view'),
            data=json.dumps({'username': 'newuser', 'password': '12345678'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)  # Bad Request

    def test_register_invalid_password_common(self):
        response = self.client.post(
            reverse('register_view'),
            data=json.dumps({'username': 'newuser', 'password': 'Password123'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)  # Bad Request

    def test_register_duplicate_username(self):
        response = self.client.post(
            reverse('register_view'),
            data=json.dumps({'username': self.user.username, 'password': 'StrongP@ssw0rd'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 409)  # Conflict

    def test_register_successful(self):
        response = self.client.post(
            reverse('register_view'),
            data=json.dumps({'username': 'newuser', 'password': 'StrongP@ssw0rd'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 302)  # Redirects on success
        self.assertEqual(response.url, '/')  # Redirects to home
        self.assertTrue(User.objects.filter(username='newuser').exists())

