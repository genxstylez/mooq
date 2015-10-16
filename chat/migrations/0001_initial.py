# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import uuid
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('stock', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Channel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False, editable=False)),
                ('name', models.CharField(verbose_name='Name', max_length=40)),
                ('is_system', models.BooleanField(default=False, verbose_name='System chatroom')),
                ('stock', models.OneToOneField(blank=True, to='stock.Stock', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ChannelSubscribers',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_moderator', models.BooleanField(verbose_name='is_moderator')),
                ('channel', models.ForeignKey(verbose_name='Channel', to='chat.Channel')),
                ('user', models.ForeignKey(verbose_name='User', related_name='channels', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='channel',
            name='subscribers',
            field=models.ManyToManyField(verbose_name='Subscribers', to=settings.AUTH_USER_MODEL, through='chat.ChannelSubscribers'),
        ),
    ]
