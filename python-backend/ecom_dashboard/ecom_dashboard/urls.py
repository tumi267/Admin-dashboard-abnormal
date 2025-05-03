from django.contrib import admin
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from abnormal.views import LoginView, LogoutView, RegisterView, UserProfileView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/profile/', UserProfileView.as_view(), name='profile'),
]