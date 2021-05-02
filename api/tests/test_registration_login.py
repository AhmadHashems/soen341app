from django.contrib.auth.models import User
from django.test import TestCase


class RegisterLoginTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='travis', password='Concordia.1')

    def test_register_new_user(self):
        response = self.client.post('/api/register/', {'username': 'register', 'password': "Concordia.1",
                                                       'password2': "Concordia.1"})
        obj = User.objects.all()
        self.assertEqual(obj[1].username, 'register')
        self.assertEqual(response.status_code, 200)

    def test_login(self):
        self.assertEqual(self.client.cookies, {})
        response = self.client.post('/api/login/', {'username': 'travis', 'password': "Concordia.1"})
        self.assertNotEqual(self.client.cookies['sessionid'].value, "")
        self.assertEqual(response.status_code, 200)

    def test_logout(self):
        self.client.post('/api/login/', {'username': 'travis', 'password': "Concordia.1"})
        response = self.client.post('/api/logout/')
        self.assertEqual(self.client.cookies['sessionid'].value, "")
        self.assertEqual(response.status_code, 200)
