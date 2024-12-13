from django.contrib.auth import get_user_model
from graphene_django.utils.testing import GraphQLTestCase

from .queries import QUERY_USER_PROFILE, QUERY_ME

User = get_user_model()


class UserProfileTest(GraphQLTestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_user_profile(self):
        response = self.query(QUERY_USER_PROFILE, variables={'username': 'testuser'})
        content = response.json()
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['userProfile']['username'], 'testuser')
        self.assertTrue(content['data']['userProfile']['avatar'].endswith('default.png'))
        self.assertTrue(content['data']['userProfile']['background'].endswith('default.png'))

    
    def test_user_profile_nonexistent_user(self):
        response = self.query(QUERY_USER_PROFILE, variables={'username': 'nonexistentuser'})
        content = response.json()
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'User matching query does not exist.')


class QueryMeTest(GraphQLTestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_query_me(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.query(QUERY_ME)
        content = response.json()
        self.assertResponseNoErrors(response)
        self.assertTrue(content['data']['me']['username'], 'testuser')
        self.assertTrue(content['data']['me']['avatar'].endswith('default.png'))
    
    def test_query_me_unauthenticated(self):
        response = self.query(QUERY_ME)
        content = response.json()
        self.assertResponseNoErrors(response)
        self.assertEqual(content["data"]["me"], None)
