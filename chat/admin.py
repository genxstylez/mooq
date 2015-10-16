from django.contrib import admin
from chat.models import Channel, ChannelSubscribers

admin.site.register(Channel)
admin.site.register(ChannelSubscribers)
