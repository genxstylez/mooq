# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings
import chat.models


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Channel',
            fields=[
                ('id', models.CharField(serialize=False, primary_key=True, max_length=32, editable=False, default=chat.models.id_generator)),
                ('name', models.CharField(max_length=40, verbose_name='Name')),
                ('is_system', models.BooleanField(default=False, verbose_name='System chatroom')),
            ],
        ),
        migrations.CreateModel(
            name='ChannelSubscribers',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('is_moderator', models.BooleanField(verbose_name='is_moderator')),
                ('channel', models.ForeignKey(related_name='subscribers', to='chat.Channel', verbose_name='Channel')),
                ('user', models.ForeignKey(related_name='channels', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
        ),
        migrations.AddField(
            model_name='channel',
            name='_subscribers',
            field=models.ManyToManyField(through='chat.ChannelSubscribers', to=settings.AUTH_USER_MODEL, verbose_name='Subscribers'),
        ),
        migrations.AddField(
            model_name='channel',
            name='stock',
            field=models.OneToOneField(blank=True, to='stock.Stock', null=True),
        ),
        migrations.AlterUniqueTogether(
            name='channelsubscribers',
            unique_together=set([('channel', 'user')]),
        ),
    ]
