from django.contrib.auth.models import User
from django.db import models
from django.conf import settings


# Create your models here.
class Post(models.Model):
    caption = models.TextField(max_length=200, error_messages={'invalid': 'Make sure you wrote at most 200 chars!'})
    image = models.ImageField(upload_to='postimages/', blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="posts", on_delete=models.CASCADE)

    def __str__(self):
        return "{0} posted {1}".format(self.user.username, self.caption)

    class Meta:
        ordering = ("-timestamp",)


class FollowRelation(models.Model):
    user = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)
    user_to_follow = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'user_to_follow',)

    def __str__(self):
        return "{0} follows {1}".format(self.user.username, self.user_to_follow.username)


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="comments", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True)
    content = models.TextField(max_length=200,
                               error_messages={'invalid': 'Make sure you wrote at most 200 chars!'})

    class Meta:
        ordering = ("timestamp",)

    def __str__(self):
        return "{0} commented on post_id {1}".format(self.user.username, self.post.id)


class Report(models.Model):
    report_reason_choices = [
        (1, 'Spam'),
        (2, 'Violence'),
        (3, 'Harassment'),
        (4, 'False Information'),
        (5, 'Hate Speech'),
    ]
    report_reason = models.IntegerField(choices=report_reason_choices, default=1, )
    post = models.ForeignKey(Post, related_name="reports", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="reports", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True, )
    content = models.TextField(max_length=200,
                               error_messages={'invalid': 'Make sure you wrote at most 200 chars!'})

    class Meta:
        ordering = ("timestamp",)

    def __str__(self):
        return "{0} reported post_id {1}".format(self.user.username, self.post.id)
