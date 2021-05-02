import tempfile
from django.conf import settings
from django.contrib.auth.models import User
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from api.models import Post, Comment




class CommentTest(TestCase):
    def setUp(self):
        settings.MEDIA_ROOT = tempfile.mkdtemp()
        self.user = User.objects.create_user(username='travis', password='Concordia.1')
        self.new_user = User.objects.create_user(username='new', password='Concordia.1')
        self.client.login(username='travis', password='Concordia.1')
        self.image = SimpleUploadedFile(name='test_image.jpg', content=open('media/travis_test.png', 'rb').read(),
                                        content_type='image/jpeg')
        self.post = Post.objects.create(image=self.image, caption="post 1", user=self.user)
        Comment.objects.create(post=self.post, user=self.user, content="my comment")
        Comment.objects.create(post=self.post, user=self.new_user, content="new user comment")

    def test_comment_post_request(self):
        response = self.client.post('/api/comment/', {"post": "1", "content": "my 1st comment"},
                                    format('application/json'))
        self.assertEqual(response.status_code, 200)

    def test_comment_feed_get_request(self):
        response = self.client.get('/api/feed/')
        self.assertEqual(response.data[0]['comments'][0]['username'], 'travis')
        self.assertEqual(response.data[0]['comments'][0]['content'], 'my comment')

    def test_other_users_comments_feed_get_request(self):
        response = self.client.get('/api/feed/')
        self.assertEqual(response.data[0]['comments'][1]['username'], 'new')
        self.assertEqual(response.data[0]['comments'][1]['content'], 'new user comment')
