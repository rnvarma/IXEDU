# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-04-05 04:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_auto_20160405_0418'),
    ]

    operations = [
        migrations.AddField(
            model_name='filledsubcategory',
            name='name',
            field=models.CharField(default='', max_length=200),
        ),
    ]
