from chat.models import Channel
from chat.serializers import ChannelSerializer

from rest_framework import viewsets, filters


class ChannelViewSet(viewsets.ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('subscribers__user__id',)