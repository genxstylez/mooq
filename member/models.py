from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from sorl.thumbnail import ImageField


def avatar_path(instance, filename):
    return '{user_id}/{filename}.{ext}'.format(user_id=instance.user.id,
            filename=filename.split('.')[0], ext=filename.split('.')[-1])


class Profile(models.Model):
    user = models.OneToOneField(User)
    follows = models.ManyToManyField('Profile', verbose_name=_('follows'), related_name='followed_by', blank=True)
    avatar = ImageField(upload_to=avatar_path, null=True, blank=True)
    is_verified = models.BooleanField(_('Verified?'), default=False)

    def __str__(self):
        return self.user.username
