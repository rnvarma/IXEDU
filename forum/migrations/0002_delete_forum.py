# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-04-08 03:30
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='forum',
        ),
    ]