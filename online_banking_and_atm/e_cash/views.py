from rest_framework.views import APIView
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
import json
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from .models import *
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework.authtoken.models import Token
from rest_framework.parsers import FormParser, MultiPartParser
from django.core.mail import send_mail, EmailMessage
from reportlab.pdfgen import canvas
from django.contrib.auth.models import User
from django.http import FileResponse
from django.core.exceptions import ObjectDoesNotExist


# Create your views here.
class AdminRegisterView(APIView):
    def post(self, request):
        admin = AdminSerializer(data=request.data)
        if admin.is_valid():
            admin.save()
            return Response(
                {"data": admin.data, "message": "Successfully created role"},
                status=status.HTTP_201_CREATED,
            )
        return Response(admin.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminLoginView(APIView):
    def post(self, request, *args, **kwargs):
        admin = request.data.get("username")
        password = request.data.get("password")
        user = None
        try:
            user = Admin.objects.get(username=admin)
        except ObjectDoesNotExist:
            pass
        if not user:
            return Response(
                {"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )
        if not check_password(password, user.password):
            return Response(
                {"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )
        user_serializer = User()
        user_serializer.username = user.username
        user_serializer.password = password
        user_serializer.save()
        token, _ = Token.objects.get_or_create(user=user_serializer)
        return Response(
            {"data": AdminSerializer(user).data, "token": token.key, "role": "admin"},
            status=status.HTTP_200_OK,
        )


class EmployeeCreationView(APIView):
    def post(self, request):
        employee = EmployeeSerializer(data=request.data)
        if employee.is_valid():
            employee.save()
            return Response({'data':employee.data, 'message':'Successfully created employee'}, status=status.HTTP_201_CREATED)
        return Response(employee.errors["email"], status=status.HTTP_400_BAD_REQUEST)


class EmployeeManagementView(APIView):
    def get(self, request):
        employees = Employee.objects.all()
        employee_serializer = EmployeeSerializer(employees, many=True)
        return Response(
            {"data": employee_serializer.data, "message": "Success"},
            status=status.HTTP_200_OK,
        )


class ClientManagementView(APIView):
    def get(self, request):
        clients = Client.objects.all()
        client_serializer = ClientSerializer(clients, many=True)
        return Response(
            {"data": client_serializer.data, "message": "Success"},
            status=status.HTTP_200_OK,
        )

    def put(self, request):
        client_email = request.data.get("email")
        client = Client.objects.get(email=client_email)
        client.status = request.data.get("status")
        return Response(
            {"message": f"Client {request.data.get('status')} successfully !"},
            status=status.HTTP_202_ACCEPTED,
        )


class ClientCreationView(APIView):
    def post(self, request):
        client = ClientSerializer(data=request.data)
        if client.is_valid():
            client.save()
            # send_mail(
            #     subject=f"Account Creation Acknowledgement",
            #     message=f"Welcome {request.data.get('username')} to AICSCash, we are delighted to have you on board",
            #     from_email="chriskameni25@gmail.com",
            #     recipient_list=[f"{request.data.get('email')}"],
            #     fail_silently=False,
            # )
            return Response(
                {"data": client.data, "message": "Success"},
                status=status.HTTP_201_CREATED,
            )
        return Response(client.errors["email"], status=status.HTTP_400_BAD_REQUEST)

class ClientLoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        user = None
        try:
            user = Client.objects.get(email=email)
        except ObjectDoesNotExist:
            pass
        if not user:
            return Response(
                {"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )
        if not check_password(password, user.password):
            return Response(
                {"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )
        user_serializer = User()
        user_serializer.username = user.username
        user_serializer.password = password
        user_serializer.save()
        token, _ = Token.objects.get_or_create(user=user_serializer)
        return Response(
            {"data": ClientSerializer(user).data, "token": token.key, "role": "client"},
            status=status.HTTP_200_OK,
        )


class EmployeeLoginView(APIView):
    def post(self, request, *args, **kwargs):
        matricule = request.data.get("matricle")
        password = request.data.get("password")
        user = None
        try:
            user = Employee.objects.get(matricle=matricule)
        except ObjectDoesNotExist:
            pass

        if not user:
            return Response(
                {"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )
        if not check_password(password, user.password):
            return Response(
                {"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )
        user_serializer = User()
        user_serializer.username = user.username
        user_serializer.password = password
        user_serializer.save()
        token, _ = Token.objects.get_or_create(user=user_serializer)
        return Response(
            {
                "data": EmployeeSerializer(user).data,
                "token": token.key,
                "role": "employee",
            },
            status=status.HTTP_200_OK,
        )


class BankAccountView(APIView):
    def post(self, request, *args, **kwargs):
        bank_card = BankCardSerializer(data=request.data)
        if bank_card.is_valid():
            bank_card.save()
            return Response(
                {"data": bank_card.data, "message": "Success"},
                status=status.HTTP_201_CREATED,
            )
        return Response(bank_card.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        bank_cards = BankCard.objects.all()
        client_accounts = []
        for B in bank_cards:
            client = Client.objects.get(client_id=B.client.client_id)
            bank_serializer = BankCardSerializer(B)
            client_serializer = ClientSerializer(client)
            client_accounts.append(client_serializer.data | bank_serializer.data)
        return Response(
            {"data": client_accounts, "message": "Success"},
            status=status.HTTP_200_OK,
        )

class ClientAtmTransactions(APIView):
    def get(self, request):
        transactions = Transaction.objects.all()
        T = ATMTransactAccount.objects.all()
        all_clients_transactions = []
        for t in T:
            transact = Transaction.objects.get(transaction_id=t.transaction_id.transaction_id)
            single_serialize = TransactionSerializer(transact)
            transact_dict = {
                "transaction": single_serialize.data
            }
            card = BankCard.objects.get(account_number = t.account_number.account_number)
            card_serialize = BankCardSerializer(card)
            client = Client.objects.get(client_id=card.client.client_id)
            client_serialize = ClientSerializer(client)
            client_dict = {
                "client": client_serialize.data | card_serialize.data
            }
            atm = ATM.objects.get(atm_id=t.atm_id.atm_id)
            atm_serialize = ATMSerializer(atm)
            atm_dict = {
                "atm": atm_serialize.data
            }
            combined = transact_dict | client_dict | atm_dict
            all_clients_transactions.append(combined) 

        return Response({"data": all_clients_transactions, "message": "Success"}, status=status.HTTP_200_OK)
    
def generate_pdf_file(
    transaction_id, transaction_type, transaction_amount, date, employee, client, acct
):
    from io import BytesIO

    buffer = BytesIO()
    p = canvas.Canvas(buffer)

    # Create a PDF document
    p.drawString(100, 750, "AICS-Cash Receipt")

    y = 700
    for i in range(1):
        p.drawString(100, y, f"Transaction Id: {transaction_id}")
        p.drawString(100, y - 20, f"Transaction Type: {transaction_type}")
        p.drawString(100, y - 40, f"Client Name: {client}")
        p.drawString(100, y - 60, f"Account Number: {acct}")
        p.drawString(100, y - 80, f"Date: {date}")
        p.drawString(100, y - 100, f"Amount: {transaction_amount} XAF")
        p.drawString(100, y - 120, f"Employee Name: {employee}")
        y -= 60

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer


class TransactionManagementView(APIView):
    def get(self, request):
        T = TransactionAccount.objects.all()
        all_clients_transactions = []
        for t in T:
            transact = Transaction.objects.get(transaction_id=t.transaction_id.transaction_id)
            single_serialize = TransactionSerializer(transact)
            transaction_dict = {
                "transaction": single_serialize.data
            }
            card = BankCard.objects.get(account_number = t.account_number.account_number)
            card_serialize = BankCardSerializer(card)
            client = Client.objects.get(client_id=card.client.client_id)
            client_serialize = ClientSerializer(client)
            client_dict = {
                "client": client_serialize.data | card_serialize.data
            }
            employee = Employee.objects.get(matricle = t.emp_matricle.matricle)
            employee_serializer = EmployeeSerializer(employee)
            employee_dict = {
                "employee": employee_serializer.data
            }
            combined = transaction_dict | client_dict | employee_dict
            all_clients_transactions.append(combined) 
        return Response(
            {"data": all_clients_transactions, "message": "Success"},
            status=status.HTTP_200_OK,
        )

    def post(self, request, *args, **kwargs):
        parser_classes = (MultiPartParser, FormParser)
        transaction_type = request.data.get("transaction_type")
        transaction_amount = request.data.get("transaction_amount")
        account_number = request.data.get("account_number")
        number_files = request.data.get("number_files")
        account = BankCard.objects.get(account_number = account_number)
        client = Client.objects.get(client_id=account.client.client_id)
        if transaction_type == "DEPOSIT":
            account.balance = account.balance + float(transaction_amount)
        elif transaction_type == "WITHDRAWAL":
            if account.balance < float(transaction_amount):
                return Response({"message": "Don't have enough money to proceed"}, status=status.HTTP_400_BAD_REQUEST)
            account.balance = account.balance - float(transaction_amount)
        account.save()
        transaction_details = {
            "transaction_type": transaction_type,
            "transaction_amount": transaction_amount
        }
        transaction_serializer = TransactionSerializer(data=transaction_details)
        if transaction_serializer.is_valid():
            transaction_serializer.save()
        else:
            return Response({"message":transaction_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        employee_data_mat = request.data.get("emp_matricle")
        trans_account_details = {
            "transaction_id": transaction_serializer.data.get("transaction_id"),
            "account_number": account_number,
            "emp_matricle": employee_data_mat
        }
        if int(number_files) > 0:
            for i in range(int(number_files)):
                docs = {
                    "doc": request.FILES[f"doc{i}"],
                    "transaction_id": trans_account_details["transaction_id"]
                }
                document_serializer = DocumentSerializer(data = docs)
                if document_serializer.is_valid():
                    document_serializer.save()
                else:
                    return print(document_serializer.errors)
        transaction_account = TransactionAccountSerializer(data=trans_account_details)
        if transaction_account.is_valid():
            transaction_account.save()
            employee = Employee.objects.get(matricle=request.data.get("emp_matricle")).username
            return FileResponse(generate_pdf_file(transaction_serializer.data.get("transaction_id"),transaction_type, transaction_amount, transaction_serializer.data.get("transaction_date"), employee, client.username,account_number), as_attachment=True, filename=f"Receipt {transaction_serializer.data.get('transaction_id')}.pdf")
            #return Response({'data':transaction_account.data, 'message':'Success'}, status=status.HTTP_201_CREATED)
        return Response(transaction_account.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AtmWithdrawalView(APIView):
    def post(self, request):
        try:
            data = request.data
            account_number = data.get("account_number")
            withdrawal_amount = float(data.get("amount"))
            atm_id = data.get("atm_id")
            card = BankCard.objects.get(account_number=account_number)

            if card.balance < withdrawal_amount:
                return Response({"error": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST)

            atm = ATM.objects.get(atm_id=atm_id)
            if atm.atm_balance < withdrawal_amount:
                return Response({"error": "Insufficient cash in ATM"}, status=status.HTTP_400_BAD_REQUEST)

            transaction = Transaction.objects.create(
                transaction_amount=withdrawal_amount,
                transaction_type="WITHDRAWAL",
            )
            transaction.save()
            atm_transact_account = ATMTransactAccount.objects.create(
                atm_id=atm,
                transaction_id = transaction,
                account_number = card
            )
            atm_transact_account.save()

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


class ATMView(APIView):

    def get(self, request, atm_id=None):
        if atm_id:
            try:
                atm = ATM.objects.get(atm_id=atm_id)
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

class ATMUpdateDelete(APIView):
    def put(self, request):
        try:
            atm_id = request.data.get("atm_id")
            atm = ATM.objects.get(atm_id=atm_id)

        except ATM.DoesNotExist:
            return Response(
                {"error": "ATM not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = ATMSerializer(atm, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            atm_id = request.data.get("atm_id")
            atm = ATM.objects.get(atm_id=atm_id)
            atm.delete()
            return Response(
                {"success": "ATM deleted"}, status=status.HTTP_204_NO_CONTENT
            )
        except ATM.DoesNotExist:
            return Response(
                {"error": "ATM not found"}, status=status.HTTP_404_NOT_FOUND
            )
