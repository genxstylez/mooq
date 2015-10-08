# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Name')),
                ('trading_name', models.CharField(max_length=30, verbose_name='Trading Name')),
                ('market_name', models.CharField(max_length=50, verbose_name='Market Name')),
                ('chatroom', models.OneToOneField(to='chat.Chatroom')),
            ],
        ),
    ]
