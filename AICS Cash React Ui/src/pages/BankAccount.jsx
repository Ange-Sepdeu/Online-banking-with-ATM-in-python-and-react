import React, {useEffect, useState} from 'react'
import MainHeader from '../components/MainHeader'
import { ChevronLeftOutlined, ChevronRightOutlined } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { blue } from '@mui/material/colors'
import axiosInstance from '../axiosInstance/axiosInstance'

export default function BankAccount() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [logInUserAccounts, setLogInUserAccounts] = useState([]);
  const getAccounts = () => {
    const url = "/api/bankaccount/";
    axiosInstance.get(url)
    .then(response => setAccounts(response.data.data))
    .catch(error => console.log(error))
    const clientId = JSON.parse(localStorage.getItem("user")).client_id;
    const bankAccounts = [...accounts].filter(acct => acct.client_id===clientId);
    setLogInUserAccounts(bankAccounts)
  }
  useEffect(() => {
    getAccounts() 
  })
  return (
    <>
      <div className='p-8'>
          <div className='w-[80%]'>
            <MainHeader />
          </div>
          <div className='flex w-[25%] flex-row text-blue-800 mt-7 justify-between items-center'>
              <IconButton onClick={() => navigate("/dashboard")}>
                <ChevronLeftOutlined sx={{fontSize: "40px", color: blue[900]}} />
              </IconButton>
              <div className='font-bold text-[24px]'>All bank accounts</div>
          </div>
          <div className='flex flex-row justify-center items-center'>
          {
            [...logInUserAccounts].map((bankAcct) => (
              <div key={bankAcct.account_number} className='ml-7 mt-7 hover:bg-teal-900 hover:text-white cursor-pointer border border-gray-200 rounded-[10px] p-8'>
                <span className='text-[12px] font-bold  text-gray-400'>Account No:</span> <span className='font-bold ml-5 text-[15px]'>{bankAcct.account_number} </span>
                <br /><span className='text-[12px] font-bold  text-gray-400'>Account Balance:</span> <span className='ml-2 font-bold text-[15px]'>{bankAcct.balance} </span>
                <br /><span className='text-[12px] font-bold  text-gray-400'>Creation Date:</span> <span className='ml-2 font-bold text-[15px]'>{bankAcct.time_created} </span>
              </div>
            ))
          }
          </div>
      </div>
    </>
  )
}
