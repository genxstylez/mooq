from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from chat.models import Chatroom


class Stock(models.Model):
    name = models.CharField(_('Name'), max_length=200)
    trading_name = models.CharField(_('Trading Name'), max_length=30)
    market_name = models.CharField(_('Market Name'), max_length=50)
    chatroom = models.OneToOneField(Chatroom)


@receiver(post_save, sender=Stock)
def stock_on_created(sender, instance, created, **kwargs):
    Chatroom.objects.get_or_create(id=instance.trading_name)
    pass

