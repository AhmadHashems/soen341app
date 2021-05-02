from django.contrib.auth.models import User
from django.test import TestCase
from api.models import FollowRelation


class FollowTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='travis', password='Concordia.1')
        self.new_user = User.objects.create_user(username='new', password='Concordia.1')
        self.user_to_follow = User.objects.create_user(
            username='followed', password='Concordia.1')
        FollowRelation.objects.create(user=self.user, user_to_follow=self.user_to_follow)

    def test_follow_user_post_request(self):
        self.client.login(username='travis', password='Concordia.1')
        response = self.client.post('/api/follow/', {'user_to_follow': 'new'}, format('application/json'))
        self.assertEqual(response.status_code, 200)

    def test_get_users_to_follow_get_request(self):
        self.client.login(username='travis', password='Concordia.1')
        response = self.client.get('/api/follow/')
        self.assertEqual(response.data[0]['username'], 'new')

    def test_get_users_not_followed_yet_only(self):
        self.client.login(username='travis', password='Concordia.1')
        response = self.client.get('/api/follow/')
        self.assertEqual(len(response.data), 1)
        self.assertNotEqual(response.data[0]['username'], 'followed')
