from django.db import models
from django.core.exceptions import ValidationError

class AuthManager(models.Model):
    session_id = models.CharField(max_length=20)
    login_state = models.BooleanField(default=False)

class Role(models.Model):
    role_name = models.CharField(max_length=20, unique=True)

class User( AuthManager):
    username = models.CharField(max_length=20)
    email = models.CharField(max_length=20, unique=True)
    time_created = models.DateTimeField(auto_now_add=True)
    password = models.CharField(max_length=20)
   # role = models.ForeignKey(Role, on_delete=models.CASCADE)

class BankAccount(models.Model):
    account_number = models.CharField(max_length=20, unique=True)
    account_type = models.CharField(max_length=10)
    balance = models.FloatField(default=25000)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return f"{self.account_number}: {self.balance} XAF"

    def clean(self) ->None:
        if self.balance < 0:
            raise ValidationError("The balance in the bank account cannot be less than 0")
        return super().clean()
    
    def save(self, *args, **kwargs) -> None:
        self.clean()
        return super().save(*args, **kwargs)

class Transaction(models.Model):
    transaction_id = models.CharField(unique=True)
    transaction_type = models.CharField(max_length=20)
    transaction_date = models.DateTimeField(auto_now_add=True)
    transaction_amount = models.FloatField()

    def __str__(self) -> str:
        return f"{self.transaction_id}: {self.transaction_amount} XAF"

    def clean(self) ->None:
        if self.transaction_amount < 0:
            raise ValidationError("The amount of the transaction cannot be less than 0")
        return super().clean()
    
    def save(self, *args, **kwargs) -> None:
        self.clean()
        return super().save(*args, **kwargs)

class TransactionAccount(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    bankaccount = models.ForeignKey(BankAccount, on_delete=models.CASCADE)

class ATM(models.Model):
    location = models.CharField(max_length=20)
    atm_balance = models.FloatField(default=500000)
    bankaccount = models.ForeignKey(BankAccount, on_delete=models.CASCADE)
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.location}: {self.atm_balance} XAF"

    def clean(self) ->None:
        if self.atm_balance < 0:
            raise ValidationError("The balance in the ATM cannot be less than 0")
        return super().clean()
    
    def save(self, *args, **kwargs) -> None:
        self.clean()
        return super().save(*args, **kwargs)
