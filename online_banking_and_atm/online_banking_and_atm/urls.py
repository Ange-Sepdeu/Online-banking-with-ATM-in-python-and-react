"""
URL configuration for online_banking_and_atm project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from e_cash import views
from django.conf import settings
from django.conf.urls.static import static
from e_cash.views import ATMView, atm_withdrawal

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/client-login/', views.ClientLoginView.as_view(), name="client-login"),
    path('api/auth/admin-login/', views.ClientLoginView.as_view(), name="client-login"),
    path('api/auth/employee-login/', views.EmployeeLoginView.as_view(), name="employee-login"),
    path('api/auth/client-register/', views.ClientCreationView.as_view(), name="client-creation"),
    path('api/auth/admin-register/', views.AdminRegisterView.as_view(), name="admin-register"),
    path('api/auth/employee-register/', views.EmployeeCreationView.as_view(), name="employee-creation"),
    path('api/bankaccount/', views.BankAccountView.as_view(), name="bank-account-add"),
    path('api/transaction/', views.TransactionManagementView.as_view(), name="transaction-add"),
    path('api/employee/', views.EmployeeManagementView.as_view(), name="employee-management"),
    path("api/client/", views.ClientManagementView.as_view(), name="client-management")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    path("admin/", admin.site.urls),
    path("atm/withdrawal/", atm_withdrawal, name="atm_withdrawal"),
    path("atm/", ATMView.as_view(), name="atm_list_create"),
    path("atm/<int:atm_id>/", ATMView.as_view(), name="atm_detail_update_delete"),
]
