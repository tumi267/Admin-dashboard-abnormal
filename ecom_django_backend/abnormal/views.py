# abnormal/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import RegistrationSerializer, LoginSerializer
from django.contrib.auth import login
from knox.views import LoginView as KnoxLoginView
from django.core.mail import send_mail
from django.conf import settings    

from django_rest_passwordreset.views import ResetPasswordValidateToken, ResetPasswordConfirm
from .serializers import PasswordResetConfirmSerializer

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            _, token = AuthToken.objects.create(user)
            return Response({
                "user": serializer.data,
                "token": token
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super().post(request, format=None)
    


class PasswordResetRequest(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data['email'])
        
        # Generate and send password reset email
        token = django_rest_passwordreset.models.ResetPasswordToken.objects.create(
            user=user,
        )
        
        # Send email
        send_mail(
            'Password Reset',
            f'Use this token to reset your password: {token.key}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return Response({'status': 'reset email sent'})

class PasswordResetConfirmView(ResetPasswordConfirm):
    serializer_class = PasswordResetConfirmSerializer