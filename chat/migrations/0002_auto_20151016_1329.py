# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='channel',
            old_name='subscribers',
            new_name='_subscribers',
        ),
        migrations.AlterField(
            model_name='channelsubscribers',
            name='channel',
            field=models.ForeignKey(to='chat.Channel', verbose_name='Channel', related_name='subscribers'),
        ),
    ]
