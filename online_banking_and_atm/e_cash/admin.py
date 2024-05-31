from django.contrib import admin
from .models import User,BankAccount
# Register your models here.

admin.site.register(BankAccount)
admin.site.register(User)