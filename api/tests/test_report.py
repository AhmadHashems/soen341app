import tempfile
from django.conf import settings
from django.contrib.auth.models import User
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from api.models import Post, Report


class ReportTest(TestCase):
    def setUp(self):
        settings.MEDIA_ROOT = tempfile.mkdtemp()
        self.user = User.objects.create_user(username='travis', password='Concordia.1')
        self.admin = User.objects.create_superuser(username='admin', password='Concordia.1')
        self.client.login(username='travis', password='Concordia.1')
        self.image = SimpleUploadedFile(name='test_image.jpg', content=open('media/travis_test.png', 'rb').read(),
                                        content_type='image/jpeg')
        self.post = Post.objects.create(image=self.image, caption="post 1", user=self.user)
        self.report = Report.objects.create(post=self.post, report_reason=3, user=self.user, content="my report")

    def test_report_post_request(self):
        response = self.client.post('/api/report/', {"post": "1", "report_reason": 2, "content": "my 1st report"},
                                    format('application/json'))
        self.assertEqual(response.status_code, 200)

    def test_reports_feed_get_request(self):
        self.client.login(username='admin', password='Concordia.1')
        response = self.client.get('/api/report/')
        self.assertEqual(response.data[0]['reports'][0]['username'], 'travis')
        self.assertEqual(response.data[0]['reports'][0]['content'], 'my report')
        self.assertEqual(response.data[0]['reports'][0]['report_reason_value'], 'Harassment')

    def test_only_admin_see_reports(self):
        self.client.login(username='travis', password='Concordia.1')
        response = self.client.get('/api/report/')
        self.assertEqual(response.data['errors'],
                         'Please login as a superuser to see all the reports.')

    def test_dismiss_report_delete_request(self):
        self.client.login(username='admin', password='Concordia.1')
        response = self.client.delete('/api/report/', {'id': "1"}, format('application/json'))
        all_reports = self.client.get('/api/report/')
        self.assertEqual(response.data['success'], 'true')
        self.assertEqual(all_reports.data, [])


    def test_only_admin_dismiss_reports(self):
        self.client.login(username='travis', password='Concordia.1')
        response = self.client.delete('/api/report/', {'id': "1"}, format('application/json'))
        self.assertEqual(response.data['errors'],
                         'Please login as a superuser to see all the reports.')


    def test_delete_post_delete_request(self):
        self.client.login(username='admin', password='Concordia.1')
        response = self.client.delete('/api/feed/', {'id': "1"}, format('application/json'))
        all_reports = self.client.get('/api/feed/')
        self.assertEqual(response.data['success'], 'true')
        self.assertEqual(all_reports.data, [])


    def test_only_admin_delete_post(self):
        self.client.login(username='travis', password='Concordia.1')
        response = self.client.delete('/api/feed/', {'id': "1"}, format('application/json'))
        self.assertEqual(response.data['errors'],
                         'Please login as a superuser to see all the reports.')