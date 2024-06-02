import { ArrowLeftOutlined, ChevronLeftOutlined, Close } from '@mui/icons-material';
import { Alert, AlertTitle, IconButton, Snackbar } from '@mui/material';
import { blue, teal } from '@mui/material/colors';
import React, {useCallback, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DUMMYATM } from '../constants/constants';
import MainHeader from "../components/MainHeader";
import axiosInstance from '../axiosInstance/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ATM() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(1000)
  const [ATM, setATM] = useState([])
  const [location, setLocation] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [transactions, setTransactions] = useState([])
  const [withdraws, setWithdraws] = useState([])
  const handleOpenModal = () => {
        getAccounts();
        getAtm();
        setTimeout(() => {
          setOpen(!open);
        }, 1000);
  }
  const [accounts, setAccounts] = useState([]);
  const [logInUserAccounts, setLogInUserAccounts] = useState([]);
 
  const getAccounts = () => {
    const url = "/api/bankaccount/";
    axiosInstance.get(url)
    .then(response => {
      setAccounts(response.data.data)
    const clientId = JSON.parse(localStorage.getItem("user")).client_id;
    const bankAccounts = [...response.data.data].filter(acct => acct.client_id===clientId);
    setLogInUserAccounts(bankAccounts)
    setAccountNumber(bankAccounts[0].account_number)
    })
    .catch(error => console.log(error))
  }
  
  const getAtm = () => {
    const url = "/api/atm/";
    axiosInstance.get(url)
    .then(response => {
      setATM(response.data)
      setLocation(response.data[0].atm_id)
    })
    .catch(error => console.log(error.message))
  }

  const getClientDeposits = () => {
    const url = "/api/client/atm";
    axiosInstance.get(url)
    .then(response => setTransactions(response.data.data))
    .catch(error => console.log(error))
    const loginClientId = JSON.parse(localStorage.getItem("user")).client_id
    const clientTransactions = [...transactions].filter(trans => trans.client.client_id===loginClientId);
    setWithdraws(clientTransactions);
  }

  useEffect(() => {
    getClientDeposits();
  })
  const [actionResponse, setActionResponse] = useState({severity: "success", message: ""});
  const [state, setState] = useState({
    openAlert: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, openAlert } = state;
  const handleClose = () => {
    setState({ ...state, openAlert: false });
  };
  const handleWithdrawal = (e) => {
    e.preventDefault();
    const url = "/api/atm/withdrawal/";
    axiosInstance.post(url, {atm_id:location, account_number:accountNumber, amount})
    .then(response => {
      toast.success("Cashout successful !")
    })
    .catch(error => {
      toast.error(error.response.data.error)
    })
  }
  return (
    <>
    <div className='p-8'>
        <div className='w-[80%]'>
        <MainHeader  />
        </div>
        <div className='mt-7 text-center w-6/12 m-auto text-[30px] font-bold flex flex-row justify-evenly items-center text-blue-800'>
          <IconButton onClick={() => navigate("/dashboard")}>
          <ChevronLeftOutlined sx={{fontSize: "40px", color:blue[800]}} />
          </IconButton>
          <div>{JSON.parse(localStorage.getItem("user")).username}, your ATM Withdrawal history</div>
        </div>
        <button onClick={() => handleOpenModal()} className='p-3 hover:bg-blue-900 bg-blue-700 text-center text-white rounded-[10px] font-bold'>New Withdrawal</button>
        <table className='w-[100%] mt-[2%] m-auto'>
          <thead className='bg-blue-700 p-4 text-[19px] text-white'>
            <tr>
              <th className='p-4'>Transaction id</th>
              <th>Account Number</th>
              <th>ATM id</th>
              <th>Amount</th>
              <th>Location</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className='bg-blue-700 text-center font-semibold bg-opacity-20'>
              {
                [...withdraws].map((atm) => (
                  <tr>
                      <td className='p-4'>{atm.transaction.transaction_id}</td>
                      <td>{atm.client.account_number}</td>
                      <td>{atm.atm.atm_id}</td>
                      <td>{atm.transaction.transaction_amount} XAF</td>
                      <td>{atm.atm.location}</td>
                      <td>{new Date(atm.transaction.transaction_date).toLocaleDateString()}</td>
                  </tr>
                ))
              }
          </tbody>
        </table>
        <Dialog
        open={open}
        fullWidth
        maxWidth={"lg"}
        onClose={() => setOpen(false)}
        sx={{
          width: "70%",
          left: "15%",
          top: "-15%",
          height: "120vh",
          padding: 10
        }}
      >
        <form method="POST" onSubmit={handleWithdrawal}>
        <div className='text-right'>
                <IconButton onClick={() => setOpen(!open)}>
                      <Close sx={{fontSize: "30px"}} />
                </IconButton>
              </div>
        <DialogTitle className='text-teal-800 text-center text-[36px] font-bold' sx={{fontSize: "28px", fontWeight: 700}}>ATM Withdrawal Information</DialogTitle>
              <DialogContent>
              <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}>Account Number 
                <span className='ml-7'> 
                <select onChange={(e) => {setAccountNumber(e.target.value)}} className='bg-gray-100 w-[75%] p-2 outline-none'>
                {
                  [...logInUserAccounts].map(acct => (
                      <option key={acct.account_number} value={acct.account_number}>{acct.account_number}</option>
                  ))
                }
                </select>
                 </span>
                </DialogContentText>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}>Amount 
                <span className='ml-7'> <input required value={amount} onChange={(e) => setAmount(e.target.value)} type='number' className='bg-gray-100 p-2 w-[80%] outline-none' placeholder='E.g 25 000 XAF' /> </span>
                </DialogContentText>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}>Location 
                <span className='ml-7'> 
                <select onChange={(e) => {setLocation(e.target.value)}} className='bg-gray-100 w-[75%] p-2 outline-none'>
                {
                  [...ATM].map(atm => (
                      <option key={atm.atm_id} value={atm.atm_id}>{atm.location}</option>
                  ))
                }
                </select>
                 </span>
                </DialogContentText>
              </DialogContent>
              <DialogActions className='mb-5 mt-10 mr-5'>
                  <button type='submit' className='bg-green-700 text-white p-3 rounded-[10px]'>Withdraw</button>
                  <button onClick={() => setOpen(!open)} className='bg-red-700 text-white p-3 rounded-[10px]'>Cancel</button>
              </DialogActions>
              </form>
        </Dialog>
    </div>
    </>
  )
}
