from django.db import models
from django.core.exceptions import ValidationError
from simple_history.models import HistoricalRecords
import uuid

class Admin(models.Model):
    admin_id = models.CharField(
        max_length=64, primary_key=True, default="admin" + str(uuid.uuid4())
    )
    username = models.CharField(max_length=20, unique=True)
    time_created = models.DateTimeField(auto_now_add=True)
    password = models.TextField()
    history = HistoricalRecords()

class Employee(models.Model):
    matricle = models.CharField(max_length=80, primary_key=True)
    username = models.CharField(max_length=100)
    email = models.EmailField(max_length=50, unique=True)
    time_created = models.DateTimeField(auto_now_add=True)
    password = models.TextField()
    status = models.CharField(max_length=20)
    tel = models.PositiveBigIntegerField()
    history = HistoricalRecords()

class Client(models.Model):
    client_id = models.CharField(max_length=120, primary_key=True, default=uuid.uuid4)
    username = models.CharField(max_length=100)
    email = models.EmailField(max_length=50, unique=True)
    time_created = models.DateTimeField(auto_now_add=True)
    password = models.TextField()
    status = models.CharField(max_length=20)
    tel = models.PositiveBigIntegerField()
    history = HistoricalRecords()

class BankCard(models.Model):
    account_number = models.CharField(max_length=86, unique=True, primary_key=True, default=uuid.uuid4)
    balance = models.FloatField(default=25000)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    history = HistoricalRecords()

    def __str__(self) -> str:
        return f"{self.account_number}: {self.balance} XAF"

    def clean(self) -> None:
        if self.balance < 0:
            raise ValidationError(
                "The balance in the bank account cannot be less than 0"
            )
        return super().clean()

    def save(self, *args, **kwargs) -> None:
        self.clean()
        return super().save(*args, **kwargs)

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ("DEPOSIT", "Deposit"),
        ("WITHDRAWAL", "Withdrawal"),
    ]
    transaction_id = models.CharField(max_length=86,unique=True, primary_key=True, default=uuid.uuid4)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    transaction_date = models.DateTimeField(auto_now_add=True)
    transaction_amount = models.FloatField()
    history = HistoricalRecords()

    def __str__(self) -> str:
        return f"{self.transaction_id}: {self.transaction_amount} XAF"

    def clean(self) -> None:
        if self.transaction_amount<0:
            raise ValidationError("Transaction amount can't be negative")
        return super().clean()

class Documents(models.Model):
    document_id = models.CharField(max_length=120, primary_key=True, default=uuid.uuid4)
    doc = models.FileField(upload_to="documents/")
    transaction_id = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    history = HistoricalRecords()

class TransactionAccount(models.Model):
    transaction_id = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    account_number = models.ForeignKey(BankCard, on_delete=models.CASCADE)
    emp_matricle = models.ForeignKey(Employee, on_delete=models.CASCADE)
    history = HistoricalRecords()

class ATM(models.Model):
    atm_id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    location = models.CharField(max_length=20)
    atm_balance = models.FloatField(default=500000)
    history = HistoricalRecords()

    def __str__(self) -> str:
        return f"{self.location}: {self.atm_balance} XAF"

    def clean(self) -> None:
        if self.atm_balance < 0:
            raise ValidationError("The balance in the ATM cannot be less than 0")
        return super().clean()

    def save(self, *args, **kwargs) -> None:
        self.clean()
        return super().save(*args, **kwargs)

class ATMTransactAccount(models.Model):
    atm_id = models.ForeignKey(ATM, on_delete=models.CASCADE)
    transaction_id = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    account_number = models.ForeignKey(BankCard, on_delete=models.CASCADE)
    emp_matricle = models.ForeignKey(Employee, on_delete=models.CASCADE, blank=True, null=True)
    history = HistoricalRecords()