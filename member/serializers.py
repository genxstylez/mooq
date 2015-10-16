from django.contrib.auth.models import User
from member.models import Profile
from chat.serializers import UserChannelField
from rest_framework import serializers

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