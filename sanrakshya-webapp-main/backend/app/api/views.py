from urllib.parse import urlparse
from django.db import IntegrityError
from django.db.models.signals import post_save
from django.dispatch import receiver
from github import Github

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated

from app.models import User, SBOMdata, VulnerabilityData, UserAuthenticationKey, SBOMcpe, Projects, latest_version
import requests
from app.api.serializers import VulnerabilityDataSerializer, ProjectsSerializer

from decouple import config
import time

import random
import string
from django.contrib.auth import authenticate
from django.db.models import Count, Case, When, IntegerField

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


# For customizing the token claims: (whatever value we want)
# Refer here for more details: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['name'] = user.first_name

        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# User registration logic
@api_view(['POST'])
def register(request):
    email = request.data["email"]

    # Ensure password matches confirmation
    password = request.data["password"]
    confirmation = request.data["confirmPassword"]
    if password != confirmation:
        return Response("ERROR: Passwords don't match", status=status.HTTP_406_NOT_ACCEPTABLE)

    name = request.data["full_name"]

    # Input validation. Check if all data is provided
    if not email or not password or not confirmation or not name:
        return Response('All data is required', status=status.HTTP_406_NOT_ACCEPTABLE)

    # Attempt to create new user
    try:
        user = User.objects.create_user(
            username=email, email=email, password=password, first_name=name)
        user.save()

    except IntegrityError:
        return Response({"ERROR: Email already taken"}, status=status.HTTP_406_NOT_ACCEPTABLE)
    return Response('Registered Successfully from backend')


# Submit SBOM data
def func(owner, repo):
    # Replace 'your-access-token', 'your-owner', and 'your-repo' with your GitHub access token, repository owner, and repository name.
    access_token = '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'
    owner = owner
    repo = repo

    # GitHub API URL for security advisories
    api_url = f'https://api.github.com/repos/{owner}/{repo}/security-advisories'

    # Set up headers with authentication
    headers = {'Authorization': f'Bearer {access_token}'}
    return data_collector(api_url=api_url, headers=headers)


def data_collector(api_url, headers):
    try:
        # Make a GET request to the GitHub API
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()  # Raise an HTTPError for bad responses

        data = response.json()
        return data
    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error: {errh}")
    except requests.exceptions.ConnectionError as errc:
        print(f"Error Connecting: {errc}")
    except requests.exceptions.Timeout as errt:
        print(f"Timeout Error: {errt}")
    except requests.exceptions.RequestException as err:
        print(f"Request Error: {err}")


def get_github_url(package_name):
    g = Github()
    repositories = g.search_repositories(package_name)
    if repositories.totalCount > 0:
        return repositories[0].html_url
    else:
        return None


def get_owner_and_repo_from_url(github_url):
    # Parse the GitHub URL
    parsed_url = urlparse(github_url)

    # Extract the path from the parsed URL
    path_components = parsed_url.path.split('/')

    # The owner name is the second component in the path
    owner_name = path_components[1] if len(path_components) > 1 else None

    # The repository name is the third component in the path
    repo_name = path_components[2] if len(path_components) > 2 else None

    return owner_name, repo_name


def get_latest_pypi_version(package_name):
    url = f"https://pypi.org/pypi/{package_name}/json"
    response = requests.get(url)
    data = response.json()
    latest_version = data["info"]["version"]
    return latest_version


def get_latest_npm_version(package_name):
    response = requests.get(f"https://registry.npmjs.org/{package_name}/latest")
    data = response.json()
    return data["version"]

@api_view(['POST'])
def submit_sbom(request):

    # Check if the request is coming from a valid user by checking against the secret key
    try:
        user = User.objects.get(username=request.data["account_id"])
        account = UserAuthenticationKey.objects.get(
            account_id=user, secret_key=request.data["secret_key"])
    except Exception as e:
        print(e)
        print("")
        return Response({'message': 'Invalid Credentials! Failed to authenticate.'}, status=status.HTTP_406_NOT_ACCEPTABLE)

    project = Projects.objects.create(
        user=user, project_name=request.data["document"]["source"]["metadata"]["path"])
    project.save()

    # Save the SBOM data for the corresponding account
    try:
        for artifact in request.data["document"]["artifacts"]:
            # Check if CPE array is empty or not

            if not artifact["cpes"]:
                artifact["cpes"].append("")
            sbom = SBOMdata.objects.create(user=user, TargetName=request.data["document"]["files"][0]["location"][
                                           "path"], PkgName=artifact["name"], PkgVersion=artifact["version"], Type=artifact["type"], project=project)
            sbom.save()

            for cpe in artifact["cpes"]:
                sbom_cpe = SBOMcpe.objects.create(sbom_link=sbom, CPE=cpe)
                sbom_cpe.save()

            # Run vulnerability analysis as soon as SBOM data is submitted
            vulnerability_analysis(user, sbom, project, request)
    except Exception as e:
        print(e)
        return Response({'message': 'SBOM submission failed'}, status=status.HTTP_406_NOT_ACCEPTABLE)

    return Response({'message': 'SBOM submitted successfully'}, status=status.HTTP_201_CREATED)


# Vulnerability analysis as soon as SBOM data is submitted
def vulnerability_analysis(user, sbom, project, request):

    print("Running vulnerability analysis on: ", sbom)
    if (sbom.Type == "python"):
        pylatestVersion = get_latest_pypi_version(sbom.PkgName)
        latest = latest_version.objects.create(
            user=user, PkgName=sbom.PkgName, PkgVersion=sbom.PkgVersion, PkgLatestVersion=pylatestVersion)
        latest.save()
    # Make an API call to the vulnerability database
    # https://services.nvd.nist.gov/rest/json/cves/2.0?apiKey=<api-key>&cpeName=<cpe-name-here
    sbom_cpes = SBOMcpe.objects.filter(sbom_link=sbom)

    for cpe in sbom_cpes:

        # Add delay for rate limits
        time.sleep(1)

        headers = {
            "apiKey": config('NVD_API_KEY'),
        }
        response = requests.get(
            "https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=" + cpe.CPE, headers=headers)
        if response.status_code == 200:
            for cve in response.json()["vulnerabilities"]:
                try:
                    base_score = ""
                    if "cvssMetricV2" in cve["cve"]["metrics"]:
                        try:
                            severity = cve["cve"]["metrics"]["cvssMetricV2"][0]["cvssData"]["baseSeverity"]
                            base_score = cve["cve"]["metrics"]["cvssMetricV2"][0]["cvssData"]["baseScore"]
                        except KeyError:
                            try:
                                severity = cve["cve"]["metrics"]["cvssMetricV2"][0]["baseSeverity"]
                            except KeyError:
                                severity = ""
                        severity = cve["cve"]["metrics"]["cvssMetricV2"][0]["cvssData"]["baseSeverity"]
                    elif "cvssMetricV3" in cve["cve"]["metrics"]:
                        severity = cve["cve"]["metrics"]["cvssMetricV3"][0]["cvssData"]["baseSeverity"]
                        base_score = cve["cve"]["metrics"]["cvssMetricV3"][0]["cvssData"]["baseScore"]
                    elif "cvssMetricV31" in cve["cve"]["metrics"]:
                        severity = cve["cve"]["metrics"]["cvssMetricV31"][0]["cvssData"]["baseSeverity"]
                        base_score = cve["cve"]["metrics"]["cvssMetricV31"][0]["cvssData"]["baseScore"]
                    vulnData = VulnerabilityData.objects.create(user=user, PkgName=sbom.PkgName, PkgVersion=sbom.PkgVersion,
                                                                PkgFixedVersion="", Severity=severity, Type=sbom.Type, CVEid=cve["cve"]["id"], Link="https://nvd.nist.gov/vuln/detail/"+cve["cve"]["id"], sbom=sbom, project=project, cveScore=base_score)
                    vulnData.save()

                    project.vulnerability = vulnData
                    project.save()

                except Exception as e:
                    print("Exception: ", e
                          )
                    return Response({'message': 'Vulnerability analysis failed'}, status=status.HTTP_406_NOT_ACCEPTABLE)
    # else:
    #     api_endpoint = f"https://access.redhat.com/labs/securitydataapi/cve.json?package={instance.PkgName}"
    #     # Make the API call
    #     response = requests.get(api_endpoint)
    #     severity = ""
    #     CVE = ""
    #     resource_url = ""
    #     package_fixed_version = ""
    #     # Check if the request was successful
    #     if response.status_code == 200:
    #         # Store the response in JSON format
    #         cve_data = response.json()
    #         try:
    #             severity = cve_data[0].get('severity')
    #             CVE = cve_data[0].get('CVE')
    #             resource_url = cve_data[0].get('resource_url')
    #             package_fixed_version = requests.get(resource_url).json().get('upstream_fix')
    #             vulnData = VulnerabilityData.objects.create(user=instance.user, PkgName=instance.PkgName, PkgVersion=instance.PkgVersion, PkgFixedVersion=package_fixed_version, Severity=severity, Type=instance.Type, CVEid=CVE, Link=resource_url, sbom=instance)
    #             vulnData.save()
    #         except Exception as e:
    #             print("Exception: ", e)
    #             return Response({'message': 'Vulnerability analysis failed'}, status=status.HTTP_406_NOT_ACCEPTABLE)
    #     else:
    #         print(f"Request failed with status code {response.status_code}")
    #         return Response({'message': 'Vulnerability analysis failed'}, status=status.HTTP_406_NOT_ACCEPTABLE)
    # else:
    #     for artifact in request.data["document"]["artifacts"]:
    #         try:
    #             package=artifact["name"]
    #             github_url = get_github_url(package)
    #             owner, repo = get_owner_and_repo_from_url(github_url)
    #             data=func(owner, repo)
    #             vulnData = VulnerabilityData.objects.create(user=user, PkgName=sbom.PkgName, PkgVersion=sbom.PkgVersion,
    #                                                             PkgFixedVersion=data[0]["vulnerabilities"][0]["patched_versions"], Severity=data[0]["severity"], Type=sbom.Type, CVEid=data[0]["cve_id"], Link="www.todo.com", sbom=sbom)
    #             vulnData.save()
    #         except Exception as e:
    #             print("Exception: ", e)
    #             return Response({'message': 'Vulnerability analysis failed'}, status=status.HTTP_406_NOT_ACCEPTABLE)

    return Response({'message': 'Vulnerability analysis successful'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_projects(request):
    projects = Projects.objects.filter(user=request.user)
    for project in projects:
        try:
            high_count = VulnerabilityData.objects.filter(project=project,
                                                          Severity="HIGH").count()
        except AttributeError:
            high_count = 0
        try:
            medium_count = VulnerabilityData.objects.filter(project=project,
                                                            Severity="MEDIUM").count()
        except AttributeError:
            medium_count = 0
        try:
            low_count = VulnerabilityData.objects.filter(project=project,
                                                         Severity="LOW").count()
        except AttributeError:
            low_count = 0
        get_SBOM = SBOMdata.objects.filter(project=project).first()
        project.project_name = get_SBOM.project.project_name
        project.high_count = high_count
        project.medium_count = medium_count
        project.low_count = low_count
        project.save()
    serializer = ProjectsSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def get_key(request):
    username = request.data["account_id"]
    password = request.data["password"]

    # Authenticate the user
    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    # Check if secret key exists for the given account id, otherwise create a new secret key
    try:
        account = UserAuthenticationKey.objects.get(account_id=user)
    except UserAuthenticationKey.DoesNotExist:
        # Create a new secret key for the account
        account = UserAuthenticationKey.objects.create(
            account_id=user, secret_key=generate_secret_key())
        account.save()

    return Response({'secret_key': account.secret_key, 'account_id': account.account_id.username}, status=status.HTTP_200_OK)


def generate_secret_key():
    secret_key = ''.join(random.choices(
        string.ascii_uppercase + string.digits, k=10))
    try:
        get_key = UserAuthenticationKey.objects.get(secret_key=secret_key)
        generate_secret_key()
    except UserAuthenticationKey.DoesNotExist:
        return secret_key


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_vulnerability_data(request, id):

    project = Projects.objects.get(id=id)
    project_name = project.project_name
    vulnData = VulnerabilityData.objects.filter(
        user=request.user, project=project).order_by('-sbom__Date', '-sbom__Time')
    serializer = VulnerabilityDataSerializer(vulnData, many=True)

    return Response({"project_name": project_name, "data": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
def send_email(request):
    message = Mail(
        from_email='mail.anubhav06@gmail.com',
        to_emails='smarter234@gmail.com',
        subject='New Report from Sanrakshya',
        html_content='<strong>Alert!</strong> You have a new vulnerability report!')

    try:
        sg = SendGridAPIClient(
            os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e)
        return Response({'message': 'Email sending failed'}, status=status.HTTP_406_NOT_ACCEPTABLE)

    return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)


def get_latest_pypi_version(package_name):
    url = f"https://pypi.org/pypi/{package_name}/json"
    response = requests.get(url)
    data = response.json()
    latest_version = data["info"]["version"]
    return latest_version


@api_view(['GET'])
def updates(request, pkg):

    latest = latest_version.objects.filter(user=request.user, PkgName=pkg)
    return Response({"package_name": latest.PkgName, "package_version": latest.PkgVersion, "latest_version": latest.PkgLatestVersion}, status=status.HTTP_200_OK)
# -------For DRF view --------------


@api_view(['GET'])
def get_routes(request):

    routes = [
        '/',
        'register/'
    ]
    return Response(routes)
