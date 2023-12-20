from django.contrib import admin
from django.contrib.auth.models import User
from app.models import SBOMdata, VulnerabilityData, UserAuthenticationKey, SBOMcpe, Projects

# Register your models here.
admin.site.unregister(User)
admin.site.register(User)

admin.site.register(SBOMdata)
admin.site.register(VulnerabilityData)
admin.site.register(UserAuthenticationKey)
admin.site.register(SBOMcpe)
admin.site.register(Projects)