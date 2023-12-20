# Generated by Django 4.2.8 on 2023-12-16 05:27

import datetime
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
            name='SBOMdata',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('TargetName', models.CharField(max_length=100)),
                ('PkgName', models.CharField(max_length=100)),
                ('PkgVersion', models.CharField(max_length=100)),
                ('CPE', models.CharField(max_length=256)),
                ('Type', models.CharField(max_length=100)),
                ('Date', models.DateField(default=datetime.date.today)),
                ('Time', models.TimeField(default=django.utils.timezone.now)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userSBOMdata', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='VulnerabilityData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PkgName', models.CharField(max_length=100)),
                ('PkgVersion', models.CharField(max_length=100)),
                ('PkgFixedVersion', models.CharField(max_length=100)),
                ('Severity', models.CharField(max_length=100)),
                ('Type', models.CharField(max_length=100)),
                ('CVEid', models.CharField(max_length=100)),
                ('Link', models.CharField(max_length=512)),
                ('sbom', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sbom', to='app.sbomdata')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userVulnerabilityData', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]