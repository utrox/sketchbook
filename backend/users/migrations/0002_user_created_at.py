# Generated by Django 5.1.1 on 2024-11-19 23:35

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2024, 11, 20, 1, 35, 35, 31762)),
            preserve_default=False,
        ),
    ]