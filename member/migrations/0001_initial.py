# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import member.models
from django.conf import settings
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('avatar', sorl.thumbnail.fields.ImageField(upload_to=member.models.avatar_path, blank=True, null=True)),
                ('is_verified', models.BooleanField(default=False, verbose_name='Verified?')),
                ('follows', models.ManyToManyField(blank=True, related_name='followed_by', to='member.Profile', verbose_name='follows')),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
