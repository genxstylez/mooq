import re
from django.contrib.auth import get_user_model
from member.models import Profile
from chat.serializers import UserChannelField
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ('is_verified', 'follows', 'avatar')


class PublicUserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(read_only=True)
    channels = UserChannelField(many=True, read_only=True)

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'profile', 'channels')
        read_only_fields = ('id', )



class PrivateUserSerializer(PublicUserSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'password', 'email', 'profile', 'channels')
        write_only_fields = ('password', )
        read_only_fields = ('id', )

    def create(self, validated_data):
        User = get_user_model()
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

    def validate(self, data):
        User = get_user_model()
        if User.objects.filter(email=data['email']).count() > 0:
            raise serializers.ValidationError('Email must be unique')

        if not re.match(r'(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}', data['password']):
            raise serializers.ValidationError('Password must contains at least one lowercase, one uppercase, one digit of number and length must be 8')
        return data

    def to_representation(self, obj):
        data = super().to_representation(obj)
        payload = jwt_payload_handler(obj)
        data['token'] = jwt_encode_handler(payload)
        return data


class SocialAuthSerializer(serializers.Serializer):
    """
    提供backend, access_token欄位
    """
    backend = serializers.CharField()
    access_token = serializers.CharField()
