from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import *
from django.db.utils import IntegrityError
# Create your tests here.

class TransactionModelTests(TestCase):
    def test_transaction_amount_less_than_0_raises_error(self):
      transaction = Transaction(transaction_type="WITHDRAWAL", transaction_amount=-95000)
      self.assertRaises(ValidationError, transaction.save)  

class ATMModelTests(TestCase):
    def test_balance_less_than_0_raises_error(self):
        atm = ATM(location="Bafang", atm_balance=-150000)
        self.assertRaises(ValidationError, atm.save)

class EmployeeModelTests(TestCase):
    def test_email_uniqueness(self):
        emp1 = Employee.objects.create(matricle="emp12345", username="Test Emp", email="Email emp", password="12345", status="active", tel=675514896)
        emp2 = Employee(matricle="emp12346", username="Test Emp2", email="Email emp", password="123456", status="active", tel=675514812)
        self.assertRaises(IntegrityError, emp2.save)

class ClientModelTests(TestCase):
    def test_email_uniqueness(self):
        client1 = Client.objects.create(username="Test Emp", email="client@gmail.com", password="12345", status="active", tel=675514896)
        emp2 = Employee(matricle="emp12346", username="Test Emp2", email="client@gmail.com", password="123456", status="active", tel=675514812)
        self.assertRaises(IntegrityError, emp2.save)

class AdminModelTests(TestCase):
    def test_admin_name_uniqueness(self):
        admin1 = Admin.objects.create(username="Admin test",password="pass")
        admin2 = Admin(username="Admin test",password="pass")
        self.assertRaises(IntegrityError, admin2.save)