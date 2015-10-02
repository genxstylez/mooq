# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='birthday',
            field=models.DateField(verbose_name='Birthday', default=datetime.date(1970, 1, 1)),
        ),
        migrations.AddField(
            model_name='profile',
            name='gender',
            field=models.PositiveSmallIntegerField(verbose_name='Gender', default=0, choices=[(0, 'Male'), (1, 'Female')]),
        ),
    ]
