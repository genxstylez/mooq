import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

class Chatroom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_system = models.BooleanField(_('System chatroom'), default=False)
    subscribers = models.ManyToManyField(User,
        verbose_name=_('Subscribers'), through='ChatroomSubscribers')

class ChatroomSubscribers(models.Model):
    chatroom = models.ForeignKey(Chatroom, verbose_name=_('Chatroom'))
    user = models.ForeignKey(User, verbose_name=_('User'))
    is_moderator = models.BooleanField(_('is_moderator'))


