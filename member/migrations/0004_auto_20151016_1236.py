# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0003_auto_20151016_1235'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='follows',
            field=models.ManyToManyField(to='member.Profile', verbose_name='follows', related_name='followed_by'),
        ),
    ]
