from django.db.models import fields
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import BankAccount,User



class BankAccountSerializers(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ('account_number','account_type','balance','user')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','email','time_created','password')



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def get_token(cls, user):
        token = super().get_token(user)
        return token
    