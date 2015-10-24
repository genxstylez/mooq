# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import sorl.thumbnail.fields
import member.models


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0005_auto_20151016_1329'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=sorl.thumbnail.fields.ImageField(upload_to=member.models.avatar_path, blank=True, null=True),
        ),
    ]
