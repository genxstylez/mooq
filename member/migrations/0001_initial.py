# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import member.models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('stream_key', models.CharField(unique=True, max_length=30, default=member.models.stream_keygen)),
                ('follows', models.ManyToManyField(to='member.Profile', related_name='followed_by')),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
