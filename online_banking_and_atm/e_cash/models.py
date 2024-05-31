from django.db import models
from django.core.exceptions import ValidationError
from simple_history.models import HistoricalRecords

import uuid


class Admin(models.Model):
    admin_id = models.CharField(
        max_length=64, primary_key=True, default="admin" + str(uuid.uuid4())
    )
    username = models.CharField(max_length=20)
    time_created = models.DateTimeField(auto_now_add=True)
    password = models.TextField()
    history = HistoricalRecords()


class Client(models.Model):
    client_id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    username = models.CharField(max_length=20)
    email = models.EmailField(max_length=20, unique=True)
    time_created = models.DateTimeField(auto_now_add=True)
    password = models.TextField()
    status = models.CharField(max_length=20)
    tel = models.PositiveBigIntegerField()


class Employee(models.Model):
    matricle = models.CharField(max_length=64, primary_key=True)
    username = models.CharField(max_length=20)
    email = models.EmailField(max_length=20, unique=True)


class Employee(AuthManager):
    matricle = models.CharField(max_length=60)
    username = models.CharField(max_length=100)
    email = models.EmailField(max_length=50, unique=True)
    time_created = models.DateTimeField(auto_now_add=True)
    password = models.TextField()
    status = models.CharField(max_length=20)
    tel = models.PositiveBigIntegerField()
    history = HistoricalRecords()


class Client(AuthManager):
    username = models.CharField(max_length=100)
    email = models.EmailField(max_length=50, unique=True)
    time_created = models.DateTimeField(auto_now_add=True)
    password = models.TextField()
    status = models.CharField(max_length=20)
    tel = models.PositiveBigIntegerField()
    history = HistoricalRecords()


class BankCard(models.Model):
    account_number = models.CharField(max_length=20, unique=True)
    account_type = models.CharField(max_length=10)
    password = models.TextField()
    status = models.CharField(max_length=20)
    tel = models.PositiveBigIntegerField()


class BankCard(models.Model):
    account_number = models.CharField(
        max_length=64, unique=True, primary_key=True, default=uuid.uuid4
    )
    balance = models.FloatField(default=25000)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

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
    transaction_id = models.CharField(unique=True, primary_key=True, default=uuid.uuid4)
    transaction_type = models.CharField(max_length=20)
    transaction_date = models.DateTimeField(auto_now_add=True)
    transaction_amount = models.FloatField()

    def __str__(self) -> str:
        return f"{self.transaction_id}: {self.transaction_amount} XAF"

    def clean(self) -> None:
        if self.transaction_amount < 0:
            raise ValidationError("The amount of the transaction cannot be less than 0")
        return super().clean()

    def save(self, *args, **kwargs) -> None:
        self.clean()
        return super().save(*args, **kwargs)


class Documents(models.Model):
    document_id = models.CharField(max_length=120, primary_key=True, default=uuid.uuid4)
    doc = models.FileField(upload_to="documents/")
    transaction_id = models.ForeignKey(Transaction, on_delete=models.CASCADE)


class TransactionAccount(models.Model):
    transaction_id = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    account_number = models.ForeignKey(BankCard, on_delete=models.CASCADE)
    emp_matricle = models.ForeignKey(Employee, on_delete=models.CASCADE)


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


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ("DEPOSIT", "Deposit"),
        ("WITHDRAWAL", "Withdrawal"),
    ]
    transaction_id = models.CharField(unique=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    transaction_date = models.DateTimeField(auto_now_add=True)
    transaction_amount = models.FloatField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    card = models.ForeignKey(BankCard, on_delete=models.SET_NULL, null=True, blank=True)
    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, null=True, blank=True
    )
    documents = models.ManyToManyField("Document", blank=True)
    atm = models.ForeignKey(ATM, on_delete=models.SET_NULL, null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self) -> str:
        return f"{self.transaction_id}: {self.transaction_amount} XAF"

    def clean(self) -> None:
        if self.transaction_type == "DEPOSIT" and self.atm is not None:
            raise ValidationError("Deposits can not be made at an ATM.")
        return super().clean()

    def save(self, *args, **kwargs) -> None:
        if self.transaction_type == "DEPOSIT":
            if self.employee_id is None:
                raise ValidationError(
                    "Employee must be provided for deposit transactions."
                )
        else:
            self.employee = None
        self.clean()
        return super().save(*args, **kwargs)


class Document(models.Model):
    name = models.CharField(max_length=20, default="id card")
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    history = HistoricalRecords()
