
from django.urls import path
from abnormal.views import health_check
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check),
]