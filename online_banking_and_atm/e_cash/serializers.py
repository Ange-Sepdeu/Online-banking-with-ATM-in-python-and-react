from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = "__all__"

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        admin = Admin.objects.create(**validated_data)
        admin.save()
        return admin


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        client = Client.objects.create(**validated_data)
        client.save()
        return client


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        employee = Employee.objects.create(**validated_data)
        employee.save()
        return employee


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"

    def create(self, validated_data):
        transaction = Transaction.objects.create(**validated_data)
        transaction.save()
        return transaction


class TransactionAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionAccount
        fields = "__all__"

    def create(self, validated_data):
        transaction_account = TransactionAccount.objects.create(**validated_data)
        transaction_account.save()
        return transaction_account


class BankCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankCard
        fields = "__all__"

    def create(self, validated_data):
        bank_card = BankCard.objects.create(**validated_data)
        bank_card.save()
        return bank_card


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = "__all__"

    def create(self, validated_data):
        uploaded_images = validated_data.pop("all_docs")
        for doc in uploaded_images:
            document = Documents.objects.create(doc)
        return document


from rest_framework import serializers
from .models import ATM, Transaction, BankCard


class ATMSerializer(serializers.ModelSerializer):
    class Meta:
        model = ATM
        fields = ["id", "location", "atm_balance"]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "client",
            "amount",
            "atm",
            "card",
            "transaction_type",
            "transaction_date",
            "employee",
        ]


class BankCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankCard
        fields = ["id", "client", "account_number", "balance"]
