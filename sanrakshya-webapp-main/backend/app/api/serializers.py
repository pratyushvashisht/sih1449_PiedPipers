from rest_framework.serializers import ModelSerializer
from app.models import SBOMdata, VulnerabilityData, Projects
from django.contrib.auth.models import User


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'


class SBOMdataSerializer(ModelSerializer):

    class Meta:
        model = SBOMdata
        fields = '__all__'


class VulnerabilityDataSerializer(ModelSerializer):

    class Meta:
        model = VulnerabilityData
        fields = '__all__'


class ProjectsSerializer(ModelSerializer):

    class Meta:
        model = Projects
        fields = '__all__'
