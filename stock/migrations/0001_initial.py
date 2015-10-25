# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200, verbose_name='Name')),
                ('market_name', models.CharField(max_length=50, verbose_name='Market Name')),
                ('code', models.CharField(help_text='Used to query api such as YQL code', max_length=30, verbose_name='Code')),
            ],
        ),
    ]
