
from django.urls import path, include
from abnormal.views import RegistrationAPI, LoginAPI
from django.contrib import admin
from knox.views import LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/register/', RegistrationAPI.as_view()),
    path('auth/login/', LoginAPI.as_view()),
    path('auth/logout/', LogoutView.as_view()),
    
]