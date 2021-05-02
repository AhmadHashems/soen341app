from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from api.models import Post, Comment, Report
from drf_extra_fields.fields import Base64ImageField


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def save(self):
        username = self.validated_data['username']
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            errors = {'errors': ["Passwords do not match."]}
            raise serializers.ValidationError(errors)
        try:
            validate_password(password, username)
            user = User.objects.create_user(username=username, password=password)
            user.save()
            return user
        except ValidationError as errors:
            error_messages = [error for error in errors]
            raise serializers.ValidationError({'errors': error_messages})


class PostSerializer(serializers.ModelSerializer):
    image = Base64ImageField()

    class Meta:
        model = Post
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    timestamp = serializers.DateTimeField(format="%d-%b-%Y, %I:%M %p", required=False)

    class Meta:
        model = Comment
        fields = ('post', 'user', 'username', 'timestamp', 'content')
        extra_kwargs = {'post': {'write_only': True}, 'user': {'write_only': True}}


class FeedSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%b-%Y, %H:%M", required=False)
    username = serializers.ReadOnlyField(source='user.username')
    comments = CommentSerializer(read_only=True, many=True)

    class Meta:
        model = Post
        fields = ('id', 'username', 'timestamp', 'image', 'caption', 'comments')


class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username',)


class FollowRelationSerializer(serializers.Serializer):
    user_to_follow = serializers.CharField()


class ReportSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    timestamp = serializers.DateTimeField(format="%d-%b-%Y, %I:%M %p", required=False)
    report_reason_value = serializers.ReadOnlyField(source='get_report_reason_display')

    class Meta:
        model = Report
        fields = ('id', 'report_reason', 'report_reason_value', 'post', 'user', 'username', 'timestamp', 'content')
        extra_kwargs = {'post': {'write_only': True}, 'user': {'write_only': True},
                        'report_reason': {'write_only': True}}


class ReportFeedSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%b-%Y, %I:%M %p", required=False)
    username = serializers.ReadOnlyField(source='user.username')
    reports = ReportSerializer(read_only=True, many=True)

    class Meta:
        model = Post
        fields = ('id', 'username', 'timestamp', 'image', 'caption', 'reports')
