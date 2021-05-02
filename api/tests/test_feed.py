import tempfile
from django.conf import settings
from django.contrib.auth.models import User
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from api.models import FollowRelation, Post


class FeedTest(TestCase):
    def setUp(self):
        settings.MEDIA_ROOT = tempfile.mkdtemp()
        self.user = User.objects.create_user(username='travis', password='Concordia.1')
        self.client.login(username='travis', password='Concordia.1')
        self.image = SimpleUploadedFile(name='test_image.jpg', content=open('media/travis_test.png', 'rb').read(),
                                        content_type='image/jpeg')
        self.new_user = User.objects.create_user(username='new', password='Concordia.1')
        self.dont_follow = User.objects.create_user(username='dont_follow', password='Concordia.1')
        FollowRelation.objects.create(user=self.user, user_to_follow=self.new_user)
        Post.objects.create(image=self.image, caption="post 1", user=self.new_user)
        Post.objects.create(image=self.image, caption="post 2", user=self.user)
        Post.objects.create(image=self.image, caption="post 3", user=self.dont_follow)

    def test_feed_get_request(self):
        self.client.login(username='travis', password='Concordia.1')
        response = self.client.get('/api/feed/')
        self.assertEqual(response.data[0]['username'], 'travis')
        self.assertEqual(response.data[0]['caption'], 'post 2')
        self.assertEqual(response.data[1]['username'], 'new')
        self.assertEqual(response.data[1]['caption'], 'post 1')

    def test_get_following_posts_only(self):
        self.client.login(username='travis', password='Concordia.1')
        response = self.client.get('/api/feed/')
        self.assertEqual(len(response.data), 2)
        self.assertNotEqual(response.data[0]['username'], 'dont_follow')
        self.assertNotEqual(response.data[1]['username'], 'dont_follow')