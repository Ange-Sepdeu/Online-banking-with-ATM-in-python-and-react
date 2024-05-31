from django.urls import path
from .views import BankAccountListCreateView,UserListCreateView,BankAccountDetailView,MyTokenObtainPairView

urlpatterns = [
    path('bankaccount/', BankAccountListCreateView.as_view(),name='banckaccount-list-create'),
    path('bankaccountDetails/', BankAccountDetailView.as_view(),name='banckaccount-details'),
    path('user/', UserListCreateView.as_view(),name='user-list-create'),
     path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
