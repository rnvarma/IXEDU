# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-04-05 04:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profilecategory',
            name='order',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='profilesubcategory',
            name='order',
            field=models.IntegerField(default=0),
        ),
    ]