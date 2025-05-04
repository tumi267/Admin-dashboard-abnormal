
from django.urls import path, include
from abnormal.views import RegistrationAPI, LoginAPI, EmailChangeRequestView, EmailChangeConfirmView, PasswordResetRequest, PasswordResetConfirmView, ProductListCreateView, ProductDetailView
from django.contrib import admin
from knox.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/register/', RegistrationAPI.as_view()),
    path('auth/login/', LoginAPI.as_view()),
    path('auth/logout/', LogoutView.as_view()),
    path('auth/email/change/', EmailChangeRequestView.as_view()),
    path('auth/email/confirm/<str:token>/', EmailChangeConfirmView.as_view()),
    path('auth/password/reset/', PasswordResetRequest.as_view()),
    path('auth/password/reset/confirm/', PasswordResetConfirmView.as_view()),
    path('products/', ProductListCreateView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
]
