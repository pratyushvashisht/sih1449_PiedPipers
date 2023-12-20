# Generated by Django 4.2.8 on 2023-12-17 09:42

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_alter_userauthenticationkey_expiry_datetime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sbomdata',
            name='CPE',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='userauthenticationkey',
            name='expiry_DateTime',
            field=models.DateTimeField(default=datetime.datetime(2024, 1, 16, 9, 42, 22, 260719, tzinfo=datetime.timezone.utc)),
        ),
    ]