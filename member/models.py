import shortuuid

from django.db import models
from django.contrib.auth.models import User

def stream_keygen():
    return shortuuid.ShortUUID().random(length=30)

class Profile(models.Model):
    user = models.OneToOneField(User)
    stream_key = models.CharField(max_length=30, unique=True, default=stream_keygen)
    follows = models.ManyToManyField('Profile', related_name='followed_by')

    def __str__(self):
        return self.user.username
