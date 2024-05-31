from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ATM, Transaction, BankCard
from .serializers import ATMSerializer
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
import json
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
@csrf_exempt
def atm_withdrawal(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            account_number = data.get("account_number")
            withdrawal_amount = float(data.get("withdrawal_amount"))
            atm_id = data.get("atm_id")

            card = BankCard.objects.get(account_number=account_number)

            if card.balance < withdrawal_amount:
                return JsonResponse({"error": "Insufficient funds"}, status=400)

            atm = ATM.objects.get(id=atm_id)
            if atm.atm_balance < withdrawal_amount:
                return JsonResponse({"error": "Insufficient cash in ATM"}, status=400)

            transaction = Transaction.objects.create(
                client=card.client,
                transaction_amount=withdrawal_amount,
                atm=atm,
                card=card,
                transaction_type="withdrawal",
            )

            card.balance -= withdrawal_amount
            card.save()

            atm.atm_balance -= withdrawal_amount
            atm.save()

            return JsonResponse({"success": "Withdrawal successful"}, status=200)
        except BankCard.DoesNotExist:
            return JsonResponse({"error": "Account number not found"}, status=400)
        except ATM.DoesNotExist:
            return JsonResponse({"error": "ATM not found"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)


class ATMView(APIView):

    def get(self, request, atm_id=None):
        if atm_id:
            try:
                atm = ATM.objects.get(id=atm_id)
                serializer = ATMSerializer(atm)
                return Response(serializer.data)
            except ATM.DoesNotExist:
                return Response(
                    {"error": "ATM not found"}, status=status.HTTP_404_NOT_FOUND
                )

        else:
            atms = ATM.objects.all()
            serializer = ATMSerializer(atms, many=True)

            return Response(serializer.data)

    def post(self, request):
        serializer = ATMSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, atm_id):

        try:
            atm = ATM.objects.get(id=atm_id)

        except ATM.DoesNotExist:
            return Response(
                {"error": "ATM not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = ATMSerializer(atm, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, atm_id):
        try:
            atm = ATM.objects.get(id=atm_id)
            atm.delete()
            return Response(
                {"success": "ATM deleted"}, status=status.HTTP_204_NO_CONTENT
            )
        except ATM.DoesNotExist:
            return Response(
                {"error": "ATM not found"}, status=status.HTTP_404_NOT_FOUND
            )
