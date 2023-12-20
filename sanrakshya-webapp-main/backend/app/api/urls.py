from django.urls import path
from . import views
from .views import MyTokenObtainPairView

# Refer to: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html#installation
# for installation of JWT with DRF

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.get_routes, name="getRoutes"),

    # User registration
    path('register/', views.register, name='register'),

    # For user authentication
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('submit-sbom/', views.submit_sbom, name='submit_sbom'),
    path('get-vulnerabilities/<int:id>/', views.get_vulnerability_data, name='get_vulnerability_data'),

    path('get-projects/', views.get_projects, name='get_projects'),

    path('get-key/', views.get_key, name='get_key'),
    path('get-updates/', views.updates, name='get_updates'),
    # path('special-login/', SpecialLoginMyTokenObtainPairView.as_view(), name='get_key'),

    path('send-email/', views.send_email, name='send_email'),
]
