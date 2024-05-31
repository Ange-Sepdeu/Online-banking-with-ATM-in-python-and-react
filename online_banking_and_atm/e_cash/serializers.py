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
