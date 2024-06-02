import { AtmOutlined, CurrencyExchangeOutlined, AccountCircleOutlined, MonetizationOn, PeopleOutlined, Security, SettingsOutlined } from "@mui/icons-material";

export const MENUROLES = [
    {
        role_name: "admin",
        menu: [
            {
                name: "Clients",
                route: "clients",
                icon: PeopleOutlined
            },
            {
                name: "ATM",
                route: "admin-atms",
                icon: AtmOutlined
            },
            {
                name: "Employees",
                route: "employees",
                icon: PeopleOutlined
            },
            {
                name: "My Account",
                route: "accounts",
                icon: AccountCircleOutlined
            },
            {
                name: "Settings",
                route: "settings",
                icon: SettingsOutlined
            }
        ]
    },
    {
        role_name: "client",
        menu: [
            {
                name: "Transfer",
                route: "tranfers",
                icon: CurrencyExchangeOutlined
            },
            {
                name: "Withdrawal",
                route: "active-client-withdrawals",
                icon: CurrencyExchangeOutlined
            },
            {
                name: "Deposits",
                route: "active-client-deposits",
                icon: MonetizationOn
            },
            {
                name: "ATM",
                route: "atm",
                icon: AtmOutlined
            },
            {
                name: "Bank Accounts",
                route: "bank-accounts",
                icon: AtmOutlined
            }
        ]
    },
    {
        role_name: "employee",
        menu: [
            {
                name: "Clients",
                route: "employee-clients",
                icon: PeopleOutlined
            },
            {
                name: "Withdrawal",
                route: "withdrawal",
                icon: CurrencyExchangeOutlined
            },
            {
                name: "Deposits",
                route: "employee-deposits",
                icon: MonetizationOn
            },
            {
                name: "My Account",
                route: "accounts",
                icon: AccountCircleOutlined
            },
            {
                name: "Settings",
                route: "settings",
                icon: SettingsOutlined
            }
        ]
    }
]

export const DUMMYTRANSACTIONS = [
    {
        transaction_type: "Transfer",
        amount: "25 000 XAF",
        receiver: "John Doe",
        date:  new Date().toLocaleDateString(),
        color: 'bg-orange-400'
    },
    {
        transaction_type: "Deposit",
        amount: "250 000 XAF",
        receiver: "You",
        date: new Date().toLocaleDateString(),
        color: "bg-blue-500"
    },
    {
        transaction_type: "Withdrawal",
        amount: "75 000 XAF",
        receiver: "Nl",
        date: new Date().toLocaleDateString(),
        color: "bg-red-500"
    },
    {
        transaction_type: "Deposit",
        amount: "75 000 XAF",
        receiver: "Peter Parker",
        date: new Date().toLocaleDateString(),
        color: "bg-blue-500"
    }
]

export const DUMMYNOTIFICATIONS = [
    {
        transaction_type: "Transfer",
        amount: "25 000 XAF",
        receiver: "John Doe",
        date:  new Date().toLocaleDateString(),
        color: 'bg-orange-400'
    },
    {
        transaction_type: "Deposit",
        amount: "250 000 XAF",
        receiver: "You",
        date: new Date().toLocaleDateString(),
        color: "bg-blue-500"
    },
    {
        transaction_type: "Withdrawal",
        amount: "75 000 XAF",
        receiver: "Nl",
        date: new Date().toLocaleDateString(),
        color: "bg-red-500"
    },
    {
        transaction_type: "Deposit",
        amount: "75 000 XAF",
        receiver: "Peter Parker",
        date: new Date().toLocaleDateString(),
        color: "bg-blue-500"
    }
]

export const DUMMYATM = [
    {
        transaction_id: "transaction"+new Date().getTime(),
        account_number: "acct"+new Date().getTime(),
        atm_id: "atm"+new Date().getTime(),
        amount: Math.floor(Math.random()*75000)+" XAF",
        location: "Yaounde",
        date: new Date().toLocaleDateString(),
    },
    {
        transaction_id: "transaction"+new Date().getTime(),
        account_number: "acct"+new Date().getTime(),
        atm_id: "atm"+new Date().getTime(),
        amount: Math.floor(Math.random()*75000)+" XAF",
        location: "Yaounde",
        date: new Date().toLocaleDateString(),
    },
    {
        transaction_id: "transaction"+new Date().getTime(),
        account_number: "acct"+new Date().getTime(),
        atm_id: "atm"+new Date().getTime(),
        amount: Math.floor(Math.random()*75000)+" XAF",
        location: "Yaounde",
        date: new Date().toLocaleDateString(),
    },
    {
        transaction_id: "transaction"+new Date().getTime(),
        account_number: "acct"+new Date().getTime(),
        atm_id: "atm"+new Date().getTime(),
        amount: Math.floor(Math.random()*75000)+" XAF",
        location: "Yaounde",
        date: new Date().toLocaleDateString(),
    }
]

export const BANKACCOUNTS = [
    {
        accountType: "Epargne",
        accountNumber: "account"+new Date().getTime(),
        creationDate: new Date().toDateString()
    },
    {
        accountType: "Autres",
        accountNumber: "account"+new Date().getTime(),
        creationDate: new Date().toDateString()
    }
]