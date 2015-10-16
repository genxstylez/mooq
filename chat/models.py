import uuid
from stock.models import Stock
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

class Channel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('Name'), max_length=40)
    stock = models.OneToOneField(Stock, null=True, blank=True)
    is_system = models.BooleanField(_('System chatroom'), default=False)
    _subscribers = models.ManyToManyField(User,
        verbose_name=_('Subscribers'), through='ChannelSubscribers')

    def __str__(self):
        return '{} : {}'.format(self.name, self.id)


class ChannelSubscribers(models.Model):
    channel = models.ForeignKey(Channel, verbose_name=_('Channel'), related_name='subscribers')
    user = models.ForeignKey(User, verbose_name=_('User'), related_name='channels')
    is_moderator = models.BooleanField(_('is_moderator'))


