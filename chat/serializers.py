from chat.models import Channel, ChannelSubscribers
from rest_framework import serializers
from stock.serializers import StockSerializer
from rest_framework.reverse import reverse


class ChannelSubscribersField(serializers.RelatedField):
    def to_representation(self, value):
        request = self.context.get('request', None)
        subscriber = dict(
            id=value.user.id,
            username=value.user.username,
            avatar=value.user.profile.avatar or None,
            is_moderator=value.is_moderator,
            url = reverse('users-detail', args=[value.user.pk], request=request)
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
            stock = StockSerializer(value.channel.stock).data
        )

        return channel


class ChannelSerializer(serializers.HyperlinkedModelSerializer):
    stock = StockSerializer(read_only=True)
    subscribers = ChannelSubscribersField(many=True, read_only=True)
    class Meta:
        model = Channel
        fields = ('id', 'name', 'is_system', 'stock', 'subscribers')


class ChannelSubscribersSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ChannelSubscribers
        fields = ('channel', 'user', 'is_moderator')


