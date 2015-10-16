# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0002_auto_20151016_1233'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=sorl.thumbnail.fields.ImageField(null=True, blank=True, upload_to='wherever'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='follows',
            field=models.ManyToManyField(null=True, to='member.Profile', blank=True, related_name='followed_by', verbose_name='follows'),
        ),
    ]
