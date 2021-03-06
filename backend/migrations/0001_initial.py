# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-20 19:10
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=100)),
                ('bio', models.TextField(default='')),
                ('position', models.CharField(default='', max_length=200)),
                ('role', models.CharField(default='', max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='FilledCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='FilledSubcategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_offered', models.BooleanField(default=False)),
                ('description', models.TextField(default='')),
                ('filled_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='filled_subcategories', to='backend.FilledCategory')),
            ],
        ),
        migrations.CreateModel(
            name='PrivateLike',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='PrivatePost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=500)),
                ('content', models.TextField(default='')),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='private_posts', to='backend.CustomUser')),
            ],
        ),
        migrations.CreateModel(
            name='PrivateResponse',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('content', models.TextField(default='')),
                ('creator', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='private_responses', to='backend.CustomUser')),
            ],
        ),
        migrations.CreateModel(
            name='ProfileCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='ProfileSubcategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=200)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subcategories', to='backend.ProfileCategory')),
            ],
        ),
        migrations.CreateModel(
            name='PublicLike',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='PublicPost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=500)),
                ('content', models.TextField(default='')),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('is_anonymous', models.BooleanField(default=True)),
                ('creator_name', models.CharField(default='', max_length=80)),
                ('creator', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='public_posts', to='backend.CustomUser')),
            ],
        ),
        migrations.CreateModel(
            name='PublicResponse',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('content', models.TextField(default='')),
                ('is_anonymous', models.BooleanField(default=True)),
                ('creator_name', models.CharField(default='', max_length=80)),
                ('creator', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='public_responses', to='backend.CustomUser')),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='UniFiles',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=200)),
                ('description', models.TextField(default='')),
                ('uploaded_file', models.FileField(blank=True, null=True, upload_to='uni_files/')),
            ],
        ),
        migrations.CreateModel(
            name='UniKeyTerms',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('term', models.CharField(default='', max_length=200)),
                ('definition', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='University',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=200)),
                ('description', models.TextField(default='')),
                ('state', models.CharField(default='', max_length=80)),
                ('city', models.CharField(default='', max_length=80)),
                ('population', models.IntegerField(default=0)),
                ('logo', models.FileField(blank=True, null=True, upload_to='uni_logos/')),
                ('is_staging', models.BooleanField(default=False)),
            ],
        ),
        migrations.AddField(
            model_name='unikeyterms',
            name='university',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='key_terms', to='backend.University'),
        ),
        migrations.AddField(
            model_name='unifiles',
            name='university',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='files', to='backend.University'),
        ),
        migrations.AddField(
            model_name='publicpost',
            name='tags',
            field=models.ManyToManyField(related_name='public_posts', to='backend.Tag'),
        ),
        migrations.AddField(
            model_name='publiclike',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='backend.PublicPost'),
        ),
        migrations.AddField(
            model_name='publiclike',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='public_post_likes', to='backend.CustomUser'),
        ),
        migrations.AddField(
            model_name='privatepost',
            name='tags',
            field=models.ManyToManyField(related_name='private_posts', to='backend.Tag'),
        ),
        migrations.AddField(
            model_name='privatelike',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='backend.PrivatePost'),
        ),
        migrations.AddField(
            model_name='privatelike',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='private_post_likes', to='backend.CustomUser'),
        ),
        migrations.AddField(
            model_name='filledcategory',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='filled_forms', to='backend.ProfileCategory'),
        ),
        migrations.AddField(
            model_name='filledcategory',
            name='university',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='form_categories', to='backend.University'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='university',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='members', to='backend.University'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='user',
            field=models.OneToOneField(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='customuser', to=settings.AUTH_USER_MODEL),
        ),
    ]
