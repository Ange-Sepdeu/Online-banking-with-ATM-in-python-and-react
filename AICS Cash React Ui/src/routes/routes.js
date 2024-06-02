import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import CreateBankAccount from "../pages/CreateBankAccount";
import Register from "../pages/Register";
import CreateEmployee from "../pages/CreateEmployee";
import BankAccount from "../pages/BankAccount";
import ATM from "../pages/ATM";
import Deposits from "../pages/Deposits";
import Withdraw from "../pages/Withdraw";
import AdminATM from "../pages/AdminATM";
import Employees from "../pages/Employee";
import Client from "../pages/User";
import EmployeeDeposits from "../pages/EmployeeDeposits";
import EmployeeClient from "../pages/EmployeeClient";
import Accounts from "../pages/Accounts";
import Settings from "../pages/Settings";
import ClientWithdrawal from "../pages/ClientWithdrawal";
import RegisterClient from "../pages/RegisterClient";
import ClientDeposit from "../pages/ClientDeposit";

export const ROUTES = [
    {
        route: "login",
        element: Login
    },
    {
        route: "dashboard",
        element: Dashboard
    },
    {
        route: "register",
        element: Register
    },
    {
        route: "create-employee",
        element: CreateEmployee
    },
    {
        route: "create-bank-account",
        element: CreateBankAccount
    },
    {
        route: "bank-accounts",
        element: BankAccount
    },
    {
        route: "atm",
        element: ATM
    },
    {
        route: "deposits",
        element: Deposits
    },
    {
        route: "withdrawal",
        element: Withdraw
    },
    {
        route: "admin-atms",
        element: AdminATM
    },
    {
        route: "employees",
        element: Employees
    },
    {
        route: "clients",
        element: Client
    },
    {
        route: "employee-clients",
        element: EmployeeClient
    },
    {
        route: "employee-deposits",
        element: EmployeeDeposits
    },
    {
        route: "accounts",
        element: Accounts
    },
    {
        route: "settings",
        element: Settings
    },
    {
        route: "active-client-deposits",
        element: ClientDeposit
    },
    {
        route: "active-client-withdrawals",
        element: ClientWithdrawal
    },
    {
        route: "register-client",
        element: RegisterClient
    }
]