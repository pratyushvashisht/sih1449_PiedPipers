from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import datetime
from django.contrib.postgres.fields import ArrayField

# Create your models here.


class UserAuthenticationKey(models.Model):

    account_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="account_id")
    secret_key = models.CharField(max_length=100)
    created_DateTime = models.DateTimeField(default=timezone.now)
    expiry_DateTime = models.DateTimeField(
        default=timezone.now() + datetime.timedelta(days=30))

    def __str__(self):
        return f"{self.account_id.username} - {self.secret_key}"


class Projects(models.Model):

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="userProjects")
    high_count = models.IntegerField(default=0, blank=True, null=True)
    medium_count = models.IntegerField(default=0, blank=True, null=True)
    low_count = models.IntegerField(default=0, blank=True, null=True)
    project_name = models.CharField(max_length=100)
    date = models.DateField(default=datetime.date.today)

    def __str__(self):
        return f"{self.user.username} - {self.project_name}"


class SBOMdata(models.Model):

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="userSBOMdata")
    project = models.ForeignKey(
        Projects, models.CASCADE, related_name="project_sbom", blank=True, null=True)
    TargetName = models.CharField(max_length=100)
    PkgName = models.CharField(max_length=100)
    PkgVersion = models.CharField(max_length=100)
    CPE = models.CharField(max_length=256, blank=True, null=True)
    Type = models.CharField(max_length=100)
    Date = models.DateField(default=datetime.date.today)
    Time = models.TimeField(default=timezone.now)

    def __str__(self):
        return f"{self.project} - {self.PkgName}"


class SBOMcpe(models.Model):

    sbom_link = models.ForeignKey(
        SBOMdata, on_delete=models.CASCADE, related_name="sbomCPE")
    CPE = models.CharField(max_length=256)

    def __str__(self):
        return f"{self.sbom_link.TargetName} - {self.CPE}"


class VulnerabilityData(models.Model):

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="userVulnerabilityData")
    PkgName = models.CharField(max_length=100)
    PkgVersion = models.CharField(max_length=100)
    PkgFixedVersion = models.CharField(max_length=100)
    Severity = models.CharField(max_length=100)
    Type = models.CharField(max_length=100)
    CVEid = models.CharField(max_length=100)
    cveScore = models.CharField(max_length=100)
    Link = models.CharField(max_length=512)
    sbom = models.ForeignKey(
        SBOMdata, on_delete=models.CASCADE, related_name="sbom")
    project = models.ForeignKey(
        Projects, models.CASCADE, related_name="project_vuln", blank=True, null=True)

    def __str__(self):
        return f"{self.PkgName} - {self.PkgVersion} - {self.CVEid}"

class latest_version(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="latest_version")
    PkgName = models.CharField(max_length=100)
    PkgVersion = models.CharField(max_length=100)
    PkgLatestVersion = models.CharField(max_length=100)
    def __str__(self) -> str:
        return f"{self.PkgName} - {self.PkgVersion} - {self.PkgLatestVersion}"
    