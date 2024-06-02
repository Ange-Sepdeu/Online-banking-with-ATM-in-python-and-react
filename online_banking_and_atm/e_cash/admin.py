from django.contrib import admin
from .models import Client, Employee, BankCard, ATM, Transaction, Documents


# Register your models here.
@admin.register(BankCard)
class BankCardAdmin(admin.ModelAdmin):
    list_display = ("account_number", "balance", "client")


admin.site.register(Client)
admin.site.register(Employee)
admin.site.register(ATM)
admin.site.register(Transaction)
admin.site.register(Documents)
