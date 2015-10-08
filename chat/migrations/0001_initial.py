# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Chatroom',
            fields=[
                ('id', models.CharField(primary_key=True, max_length=100, serialize=False, verbose_name='ID')),
                ('is_system', models.BooleanField(default=False, verbose_name='System chatroom')),
            ],
        ),
        migrations.CreateModel(
            name='ChatroomSubscribers',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_moderator', models.BooleanField(verbose_name='is_moderator')),
                ('chatroom', models.ForeignKey(to='chat.Chatroom', verbose_name='Chatroom')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
        ),
        migrations.AddField(
            model_name='chatroom',
            name='subscribers',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL, through='chat.ChatroomSubscribers', verbose_name='Subscribers'),
        ),
    ]
