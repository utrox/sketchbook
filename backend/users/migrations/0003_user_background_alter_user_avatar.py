# Generated by Django 5.1.1 on 2024-11-28 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_user_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='background',
            field=models.ImageField(default='images/backgrounds/default.jpg', upload_to='images/backgrounds'),
        ),
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='images/avatars/default.png', upload_to='images/avatars'),
        ),
    ]