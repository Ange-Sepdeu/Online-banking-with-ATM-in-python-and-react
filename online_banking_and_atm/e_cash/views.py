from django.shortcuts import render
from rest_framework import generics
from django.core.mail import send_mail, BadHeaderError
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from django.http import HttpResponse, HttpResponseServerError
from .models import BankAccount,User
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import BankAccountSerializers,UserSerializer,MyTokenObtainPairSerializer

# Create your views here.
class BankAccountListCreateView(generics.ListCreateAPIView):
   queryset = BankAccount.objects.all()
   serializer_class = BankAccountSerializers

   #def perform_create(self, serializer):
    #    serializer.save(user=self.request.user)

   @login_required
   def send_confirmation_email(request):
    user = request.user
    subject = 'Bank Account Created Successfully'
    message = f'Dear {user.username} you sucessfully created your account'
    recipient_email = user.email
    try:
        send_mail(subject, message, None, [recipient_email])
        return HttpResponse('Email sent successfully!')
    except BadHeaderError:
        return HttpResponseServerError('Invalid header found.')
    except Exception as e:
        return HttpResponseServerError(f'An error occurred: {e}')

class BankAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializers
      

class UserListCreateView(generics.ListCreateAPIView):
   queryset = User.objects.all()
   serializer_class = UserSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
        
        