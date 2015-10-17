from django.contrib.auth.models import User
from member.models import Profile
from chat.serializers import UserChannelField
from rest_framework import serializers, validators

class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ('is_verified', 'follows', 'avatar')

class PublicUserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(read_only=True)
    channels = UserChannelField(many=True, read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'profile', 'channels')

class PrivateUserSerializer(PublicUserSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile', 'channels')


class SocialAuthSerializer(serializers.Serializer):
    """
    提供backend, access_token欄位
    """
    backend = serializers.CharField()
    access_token = serializers.CharField()


def password_validator(password):
    if len(password) < 8:
        raise serializers.ValidationError('Password too short')

class NewSocialAuthSerializer(serializers.Serializer):
    """
    提供backend, access_token欄位
    """
    backend = serializers.CharField()
    access_token = serializers.CharField()
    password = serializers.CharField(validators=[password_validator])
    username = serializers.CharField(validators=[validators.UniqueValidator(queryset=User.objects.all())])
