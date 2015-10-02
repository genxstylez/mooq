# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0002_auto_20151002_1619'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='locale',
            field=models.CharField(blank=True, max_length=10, null=True, verbose_name='Locale'),
        ),
        migrations.AddField(
            model_name='profile',
            name='location',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Location'),
        ),
        migrations.AddField(
            model_name='profile',
            name='timezone',
            field=models.SmallIntegerField(default=0, verbose_name='Timezone'),
        ),
    ]
