from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from sorl.thumbnail import ImageField


class Profile(models.Model):
    user = models.OneToOneField(User)
    follows = models.ManyToManyField('Profile', verbose_name=_('follows'), related_name='followed_by', blank=True)
    avatar = ImageField(upload_to='wherever', null=True, blank=True)
    is_verified = models.BooleanField(_('Verified?'), default=False)

    def __str__(self):
        return self.user.username
