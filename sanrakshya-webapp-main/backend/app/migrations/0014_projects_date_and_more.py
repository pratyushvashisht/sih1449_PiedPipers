# Generated by Django 4.2.8 on 2023-12-19 11:34

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_projects_project_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='date',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='userauthenticationkey',
            name='expiry_DateTime',
            field=models.DateTimeField(default=datetime.datetime(2024, 1, 18, 11, 34, 30, 670632, tzinfo=datetime.timezone.utc)),
        ),
    ]
