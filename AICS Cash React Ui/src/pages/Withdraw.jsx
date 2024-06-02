import { AddOutlined, ArrowLeftOutlined, ChevronLeftOutlined, Close, DeleteOutline, EditOutlined, PlusOneOutlined } from '@mui/icons-material';
import { IconButton, Snackbar, Alert, AlertTitle } from '@mui/material';
import { blue, teal, green, red, orange, yellow } from '@mui/material/colors';
import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DUMMYATM } from '../constants/constants';
import MainHeader from "../components/MainHeader";
import { Tooltip } from '@mui/material';
import axiosInstance from '../axiosInstance/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Withdraw() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [action, setAction] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState(1);
  const [docs, setDocs] = useState(null)
  const [accountNumber, setAccountNumber] = useState("")
  const [activeTransaction, setActiveTransaction] = useState(null);
  const handleOpenModal = (transaction) => {
        setActiveTransaction(transaction);
        setOpen(!open);
  }
  const [transactions, setTransactions] = useState([]);
  const [allCashOuts, setAllCashOuts] = useState([])
  useEffect(() => {
    const url = "/api/transaction/";
    // const headers = {
    //   "Authorization": "Token "+localStorage.getItem("token")
    // }
    axiosInstance.get(url)
    .then(response => {
        setTransactions(response.data.data);
    })
    .catch(error => console.log(error))
    let withdraws = []
    withdraws = transactions.filter(tr => tr.transaction.transaction_type==="withdrawal".toUpperCase())
    const employeeWithdraws = [...withdraws].filter(dep => dep.employee.matricle === JSON.parse(localStorage.getItem("user")).matricle)
    setAllCashOuts(employeeWithdraws)
  }, [transactions])
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = "/api/transaction/";
    const formData = new FormData();
    for (let i=0;i<docs.length;i++)
      formData.append(`doc${i}`, docs[i]);
    
    formData.append("emp_matricle", JSON.parse(localStorage.getItem("user")).matricle);
    formData.append("number_files", docs?.length)
    formData.append("account_number", accountNumber);
    formData.append("transaction_amount", transactionAmount)
    formData.append("transaction_type", "withdrawal".toUpperCase())

    axiosInstance.post(url, formData)
    .then(response => {
      var url = window.URL.createObjectURL(new Blob([response.data]))
      var a = document.createElement('a')
      a.href=`${url}`;
      a.download = "Cashout receipt.pdf";
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success("Cashout successful !")
    })
    .catch(error => {
      toast.error(error.response.data.message)
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
          <div>AICS-cash Withdrawal</div>
        </div>
        <button onClick={() => {setOpen(!open);}} className='p-3 hover:bg-blue-900 bg-blue-700 text-center text-white rounded-[10px] font-bold'>New withdrawal</button>
        <table className='w-[100%] mt-[2%] m-auto'>
          <thead className='bg-blue-700 p-4 text-[19px] text-white'>
            <tr>
              <th className='p-4'>Transaction id</th>
              <th>Client Name</th>
              <th>Email</th>
              <th>Tel</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className='bg-blue-700 text-center font-semibold bg-opacity-20'>
              {
                [...allCashOuts].map((atm) => (
                  <tr>
                      <td className='p-4'>{atm.transaction.transaction_id}</td>
                      <td>{atm.client.username}</td>
                      <td>{atm.client.email}</td>
                      <td>{atm.client.tel}</td>
                      <td>{atm.transaction.transaction_amount} XAF</td>
                      <td>{atm.transaction.transaction_date}</td>
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
          height: "150vh",
          top: "-25%",
          padding: 10
        }}
      >
        <form onSubmit={handleSubmit} encType='multipart/form-data' method="post">
        <div className='text-right'>
                <IconButton onClick={() => setOpen(!open)}>
                      <Close sx={{fontSize: "30px"}} />
                </IconButton>
              </div>
        <DialogTitle className='text-teal-800 text-center text-[36px] font-bold' sx={{fontSize: "28px", fontWeight: 700}}>New Cash out</DialogTitle>
              <DialogContent>
              <div className='text-[22px] font-bold'>Client Information</div>
                <DialogContent>
                    <div className='text-[22px]'>Client Account Number: <input type='text' className='p-2 bg-gray-100 outline-none' value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder='E.g abb-225-cd' /></div>
                </DialogContent>
                <div className='text-[22px] font-bold'>Account Information</div>
                <DialogContentText sx={{fontSize: "18px"}}>Docs <span>
                  <input type='file' className='p-4' onChange={(e) => setDocs(e.target.files)} multiple />
                  </span></DialogContentText>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}> Withdrawal Amount 
                <span className='ml-7'> <input type='number' value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} min={1} className='bg-gray-100 p-2 w-[75%] outline-none' placeholder='E.g 25 000 XAF' /> </span>
                </DialogContentText>
              </DialogContent>
              <DialogActions className='mb-5 mt-10 mr-5'>
                  <button className='bg-green-700 text-white p-3 rounded-[10px]'>Execute</button>
                  <button onClick={() => setOpen(!open)} className='bg-red-700 text-white p-3 rounded-[10px]'>Cancel</button>
              </DialogActions>
              </form>
        </Dialog>
    </div>
    </>
  )
}
