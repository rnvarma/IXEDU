# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-04-09 12:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_unifiles_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='email',
            field=models.CharField(blank=True, default='', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='phone_number',
            field=models.CharField(blank=True, default='', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='bio',
            field=models.TextField(blank=True, default='', null=True),
        ),
    ]
