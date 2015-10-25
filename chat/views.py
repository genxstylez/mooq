import os
from django.conf import settings
from django.db.models import Count
from chat.models import Channel, ChannelSubscribers
from chat.serializers import ChannelSerializer, ChannelSubscribersSerializer

from rest_framework.response import Response
from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_jwt.utils import jwt_decode_handler

from mooq.authentication import CsrfExemptAuthentication

from mooq.fields import DynamicFields

from pubnub import Pubnub

PUB_KEY = os.environ.get('PUBNUB_PUB_KEY')
SUB_KEY = os.environ.get('PUBNUB_SUB_KEY')
SECRET_KEY = os.environ.get('PUBNUB_SECRET_KEY')
pubnub = Pubnub(publish_key=PUB_KEY, subscribe_key=SUB_KEY, secret_key=SECRET_KEY, ssl_on=not settings.DEBUG)

class ChannelViewSet(DynamicFields, viewsets.ModelViewSet):
    queryset = Channel.objects.annotate(subscribers_count=Count('subscribers'))
    serializer_class = ChannelSerializer
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_fields = ('subscribers__user__id', )
    ordering_fields = ('subscribers_count', )
    search_fields = ('name', )

class ChannelSubscribersViewSet(DynamicFields, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = ChannelSubscribers.objects.all()
    serializer_class = ChannelSubscribersSerializer
    filter_backends = (filters.DjangoFilterBackend, )
    filter_fields = ('channel__id', 'user__id', 'channel__name')


@api_view(['POST'])
@permission_classes((permissions.AllowAny, ))
@authentication_classes((CsrfExemptAuthentication,))
def grant(request):
    authKey = request.data.get('authKey')
    try:
        jwt_decode_handler(authKey)
        authenticated = True
    except:
        authenticated = False

    channels = request.data.get('channels')
    channels += [channel + '-pnpres' for channel in channels]
    channels = ','.join(channels)

    try:
        pubnub.grant(channel=channels, auth_key=authKey, read=True, write=authenticated)
        return Response({'message': 'Granted!'})
    except:
        return Response({'message': 'Failed!'}, status=status.HTTP_401_UNAUTHORIZED)