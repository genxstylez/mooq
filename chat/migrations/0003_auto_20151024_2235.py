# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_auto_20151016_1329'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='channelsubscribers',
            unique_together=set([('channel', 'user')]),
        ),
    ]
