# abnormal/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import RegistrationSerializer, LoginSerializer
from django.contrib.auth import login, get_user_model
from knox.views import LoginView as KnoxLoginView
from django.core.mail import send_mail
from django.conf import settings    
from django_rest_passwordreset.views import ResetPasswordValidateToken, ResetPasswordConfirm
from django_rest_passwordreset.models import ResetPasswordToken
from .serializers import PasswordResetConfirmSerializer, PasswordResetSerializer
from django.utils.crypto import get_random_string
from .serializers import EmailChangeRequestSerializer, EmailChangeConfirmSerializer, ProductSerializer, ProductUpdateSerializer
from .models import Product

User = get_user_model()
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
        
        try:
            user = User.objects.get(email=serializer.validated_data['email'])
        except User.DoesNotExist:
            return Response({'detail': 'User with this email does not exist'}, status=400)

        # Delete old tokens if they exist
        ResetPasswordToken.objects.filter(user=user).delete()
        
        # Create new token
        token = ResetPasswordToken.objects.create(
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


class EmailChangeRequestView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        serializer = EmailChangeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        request.user.new_email = serializer.validated_data['new_email']
        verification_token = get_random_string(50)
        request.user.save()
        
        # Send verification email
        send_mail(
            'Confirm Email Change',
            f'Click to confirm email change: http://localhost:8000/auth/email/confirm/{verification_token}/',
            settings.DEFAULT_FROM_EMAIL,
            [request.user.new_email],
        )
        return Response({'status': 'verification email sent'})

class EmailChangeConfirmView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request, token):
        # In real implementation, store and validate token properly
        if request.user.verification_token == token:  # You'll need to implement token storage
            request.user.email = request.user.new_email
            request.user.new_email = None
            request.user.email_verified = True
            request.user.save()
            return Response({'status': 'email updated'})
        return Response({'error': 'invalid token'}, status=400)
    


class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Product.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Product.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProductUpdateSerializer
        return ProductSerializer
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Product deleted successfully."},
            status=status.HTTP_200_OK
        )