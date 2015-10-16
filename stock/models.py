from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _


class Stock(models.Model):
    name = models.CharField(_('Name'), max_length=200)
    market_name = models.CharField(_('Market Name'), max_length=50)
    code = models.CharField(_('Code'), max_length=30,
        help_text='Used to query api such as YQL code')

    def __str__(self):
        return '{} : {}'.format(self.market_name, self.name)


@receiver(post_save, sender=Stock)
def stock_on_created(sender, instance, created, **kwargs):
    from chat.models import Channel
    if created:
        Channel.objects.create(stock=instance, name=instance.name, is_system=True)
