from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import *
from .models import *
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework.authtoken.models import Token
from rest_framework.parsers import FormParser, MultiPartParser
from django.core.mail import send_mail
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
            return Response({'data':admin.data, 'message':'Successfully created role'}, status=status.HTTP_201_CREATED)
        return Response(admin.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminLoginView(APIView):
    def post(self, request, *args, **kwargs):
        admin = request.data.get("username")
        password = request.data.get("password")
        print(request.data)
        user=None
        try:
            user= Admin.objects.get(username=admin)
        except ObjectDoesNotExist:
            pass
        if not user:
            return Response({'message': "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        if not check_password(password, user.password):
            return Response({'message': "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        user_serializer = User()
        user_serializer.username=user.username
        user_serializer.password=password
        user_serializer.save()
        token,_ = Token.objects.get_or_create(user=user_serializer)
        return Response({'data': AdminSerializer(user).data, 'token':token.key, "role":"admin"}, status=status.HTTP_200_OK)

class EmployeeCreationView(APIView):
    def post(self, request):
        employee = EmployeeSerializer(data=request.data)
        if employee.is_valid():
            employee.save()
            return Response({'data':employee.data, 'message':'Successfully created role'}, status=status.HTTP_201_CREATED)
        return Response(employee.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeManagementView(APIView):
    def get(self, request):
        employees = Employee.objects.all()
        employee_serializer = EmployeeSerializer(employees, many=True)
        return Response({"data": employee_serializer.data, "message":"Success"}, status=status.HTTP_200_OK)

class ClientManagementView(APIView):
    def get(self, request):
        clients = Client.objects.all()
        client_serializer = ClientSerializer(clients, many=True)
        return Response({"data":client_serializer.data, "message": "Success"}, status=status.HTTP_200_OK)
    
    def put(self, request):
        client_email = request.data.get("email")
        client =  Client.objects.get(email=client_email)
        client.status = request.data.get("status")
        return Response({"message":f"Client {request.data.get('status')} successfully !"}, status=status.HTTP_202_ACCEPTED)
        
class ClientCreationView(APIView):
    def post(self, request):
        client = ClientSerializer(data=request.data)
        if client.is_valid():
            client.save()
            send_mail(
                subject=f"Account Creation Acknowledgement",
                message=f"Welcome {request.data.get('username')} to AICSCash, we are delighted to have you on board",
                from_email="chriskameni25@gmail.com",
                recipient_list=[f"{request.data.get('email')}"],
                fail_silently=False
            )
            return Response({'data':client.data, 'message':'Success'}, status=status.HTTP_201_CREATED)
        return Response(client.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientLoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        user = None
        try:
            user= Client.objects.get(email=email)
        except ObjectDoesNotExist:
            pass
        if not user:
            return Response({'message': "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        if not check_password(password, user.password):
            return Response({'message': "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        user_serializer = User()
        user_serializer.username=user.username
        user_serializer.password=password
        user_serializer.save()
        token,_ = Token.objects.get_or_create(user=user_serializer)
        return Response({'data': ClientSerializer(user).data, 'token':token.key, "role":"client"}, status=status.HTTP_200_OK)

class EmployeeLoginView(APIView):
    def post(self, request, *args, **kwargs):
        matricule = request.data.get("matricle")
        password = request.data.get("password")
        user=None
        try:
            user= Employee.objects.get(matricle=matricule)
        except ObjectDoesNotExist:
            pass

        if not user:
            return Response({'message': "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        if not check_password(password, user.password):
            return Response({'message': "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        user_serializer = User()
        user_serializer.username=user.username
        user_serializer.password=password
        user_serializer.save()
        token,_ = Token.objects.get_or_create(user=user_serializer)
        return Response({'data': EmployeeSerializer(user).data, 'token':token.key, "role":"employee"}, status=status.HTTP_200_OK)

class BankAccountView(APIView):
    def post(self, request, *args, **kwargs):
        bank_card = BankCardSerializer(data=request.data)
        if bank_card.is_valid():
            bank_card.save()
            return Response({'data':bank_card.data, 'message':'Success'}, status=status.HTTP_201_CREATED)
        print(bank_card.error_messages)
        return Response(bank_card.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        bank_cards = BankCard.objects.all()
        bank_serializer = BankCardSerializer(bank_cards, many=True)
        return Response({'data':bank_serializer.data, 'message':'Success'}, status=status.HTTP_200_OK)

def generate_pdf_file(transaction_id, transaction_type, transaction_amount, date, employee):
    from io import BytesIO
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
 
    # Create a PDF document
    p.drawString(100, 750, "AICSCash Receipt")
 
    y = 700
    for i in range(1):
        p.drawString(100, y, f"Transaction Id: {transaction_id}")
        p.drawString(100, y - 20, f"Transaction_type: {transaction_type}")
        p.drawString(100, y - 40, f"Date: {date}")
        p.drawString(100, y - 60, f"Amount: {transaction_amount} XAF")
        p.drawString(100, y - 80, f"Employee Name: {employee}")
        y -= 60
 
    p.showPage()
    p.save()
 
    buffer.seek(0)
    return buffer 
class TransactionManagementView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all()
        T = TransactionAccount.objects.select_related("account_number").select_related("transaction_id")
        transaction_serializer = TransactionSerializer(transactions, many=True)
        return Response({'data': transaction_serializer.data, 'message':'Success'}, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        parser_classes = (MultiPartParser, FormParser)
        transaction_type = request.data.get("transaction_type")
        transaction_amount = request.data.get("transaction_amount")
        account_number = request.data.get("account_number")
        print(request.FILES["doc0"])
        # transaction_details = {
        #     "transaction_type": transaction_type,
        #     "transaction_amount": transaction_amount,
        #     "docs": request.FILES["docs"]
        # }
        # transaction_serializer = TransactionSerializer(data=transaction_details)
        # account = BankCard.objects.get(account_number = account_number)
        # if transaction_type == "deposit":
        #     account.balance = account.balance + float(transaction_amount)
        # elif transaction_type == "withdraw":
        #     if account.balance < float(transaction_amount):
        #         return Response({"message": "Don't have enough money to proceed"}, status=status.HTTP_400_BAD_REQUEST)
        #     account.balance = account.balance - float(transaction_amount)
        # account.save()
        # if transaction_serializer.is_valid():
        #     transaction_serializer.save()
        # trans_account_details = {
        #     "transaction_id": transaction_serializer.data.get("transaction_id"),
        #     "account_number": account.account_number,
        #     "emp_matricle": request.data.get("emp_matricle")
        # }
        # transaction_account = TransactionAccountSerializer(data=trans_account_details)
        # if transaction_account.is_valid():
        #     transaction_account.save()
        #     employee = Employee.objects.get(matricle=request.data.get("emp_matricle")).username
        #     return FileResponse(generate_pdf_file(transaction_serializer.data.get("transaction_id"),transaction_type, transaction_amount, transaction_serializer.data.get("transaction_date"), employee), as_attachment=True, filename=f"Receipt {transaction_serializer.data.get('transaction_id')}.pdf")
        #     #return Response({'data':transaction_account.data, 'message':'Success'}, status=status.HTTP_201_CREATED)
        # return Response(transaction_account.errors, status=status.HTTP_400_BAD_REQUEST)