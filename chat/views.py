from chat.models import Channel
from chat.serializers import ChannelSerializer

from rest_framework import viewsets

class ChannelViewSet(viewsets.ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer