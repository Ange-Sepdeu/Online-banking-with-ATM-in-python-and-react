from django.db import models
from django.core.exceptions import ValidationError
from simple_history.models import HistoricalRecords


class AuthManager(models.Model):
    session_id = models.CharField(max_length=20)
    login_state = models.BooleanField(default=False)
    history = HistoricalRecords()


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


class ATM(models.Model):
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
