from django.contrib.auth import get_user_model
from chat.models import Channel, ChannelSubscribers
from rest_framework import serializers
from mooq.serializers import DynamicFieldsHyperlinkedModelSerializer, DynamicFieldsModelSerializer
from stock.serializers import StockSerializer
from rest_framework.reverse import reverse

User = get_user_model()


class ChannelSubscribersField(serializers.RelatedField):
    def to_representation(self, value):
        request = self.context.get('request', None)
        subscriber = dict(
            id=value.user.id,
            username=value.user.username,
            avatar=value.user.profile.avatar.url if value.user.profile.avatar else None,
            is_moderator=value.is_moderator,
            url = reverse('user-detail', args=[value.user.pk], request=request)
        )
        return subscriber


class UserChannelField(serializers.RelatedField):
    def to_representation(self, value):
        # value is an instance of ChannelSubscribers
        channel = dict(
            id = value.channel.id,
            name = value.channel.name,
            is_system = value.channel.is_system,
            is_moderator = value.is_moderator,
            # stock = StockSerializer(value.channel.stock).data
        )

        return channel


class ChannelSerializer(DynamicFieldsHyperlinkedModelSerializer):
    stock = StockSerializer(read_only=True)
    subscribers = ChannelSubscribersField(many=True, read_only=True)
    subscribers_count = serializers.IntegerField(source='subscribers.count', read_only=True)
    class Meta:
        model = Channel
        fields = ('id', 'name', 'is_system', 'stock', 'subscribers', 'subscribers_count')


class ChannelField(serializers.RelatedField):
    def to_representation(self, value):
        return dict(
            id=value.id,
            name=value.name,
            is_system=value.is_system,
        )

    def to_internal_value(self, data):
        return Channel.objects.get(id=data)


class UserField(serializers.RelatedField):
    def to_representation(self, value):
        return dict(
            id=value.id,
            username=value.username
        )

    def to_internal_value(self, data):
        return User.objects.get(id=data)

class ChannelSubscribersSerializer(DynamicFieldsModelSerializer):
    channel = ChannelField(queryset=Channel.objects.all())
    user = UserField(queryset=User.objects.all())
    is_moderator = serializers.BooleanField(default=False)
    class Meta:
        model = ChannelSubscribers
        fields = ('id', 'channel', 'user', 'is_moderator')
