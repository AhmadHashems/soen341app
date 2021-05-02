import tempfile
from django.conf import settings
from django.contrib.auth.models import User
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

class PostTest(TestCase):
    def setUp(self):
        settings.MEDIA_ROOT = tempfile.mkdtemp()
        self.user = User.objects.create_user(
            username='travis', password='Concordia.1')
        self.image = SimpleUploadedFile(name='test_image.jpg', content=open('media/travis_test.png', 'rb').read(),
                                        content_type='image/jpeg')

    def test_create_post_post_request(self):
        self.client.login(username='travis', password='Concordia.1')
        response = self.client.post('/api/post/', {'image': self.image, 'caption': "test"})
        self.assertEqual(response.status_code, 200)