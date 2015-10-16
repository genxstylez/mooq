# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(verbose_name='Name', max_length=200)),
                ('market_name', models.CharField(verbose_name='Market Name', max_length=50)),
                ('code', models.CharField(verbose_name='Code', help_text='Used to query api such as YQL code', max_length=30)),
            ],
        ),
    ]
