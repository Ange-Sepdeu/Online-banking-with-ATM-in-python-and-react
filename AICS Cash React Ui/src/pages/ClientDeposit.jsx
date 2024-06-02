import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from "../axiosInstance/axiosInstance";
import MainHeader from '../components/MainHeader';
import { IconButton } from '@mui/material';
import { ChevronLeftOutlined } from '@mui/icons-material';
import { blue, teal, green, red, orange, yellow } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

export default function ClientDeposit() {
    const [transactions, setTransactions] = useState([]);
    const [deposits, setDeposits] = useState([])
    const getDeposits = useCallback(() => {
      const url = "/api/transaction/";
      axiosInstance.get(url)
      .then(response => setTransactions(response.data.data))
      .catch(error => console.log(error))
      const loginClientId = JSON.parse(localStorage.getItem("user")).client_id
      const clientTransactions = [...transactions].filter(trans => trans.client.client_id===loginClientId);
      const clientDeposits = [...clientTransactions].filter(trans => trans.transaction.transaction_type==="DEPOSIT");
      setDeposits(clientDeposits);
    }, [deposits])
    useEffect(() => {
        getDeposits()
    }, [getDeposits])
    const navigate = useNavigate()
  return (
    <>
        <div className='p-8'>
        <div className='w-[80%]'>
        <MainHeader  />
        </div>
        <div className='mt-7 text-center w-6/12 m-auto text-[30px] font-bold flex flex-row justify-evenly items-center'>
          <IconButton onClick={() => navigate("/dashboard")}>
          <ChevronLeftOutlined sx={{fontSize: "40px", color:teal[800]}} />
          </IconButton>
          <div> <span className='font-bold text-teal-800'>{JSON.parse(localStorage.getItem("user")).username},</span> your deposits</div>
        </div>
        <table className='w-[100%] mt-[2%] m-auto'>
          <thead className='bg-blue-700 p-4 text-[19px] text-white'>
            <tr>
              <th className='p-4'>Transaction id</th>
              <th>Transaction Amount</th>
              <th>Transaction Date</th>
              <th>Account Number</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody className='bg-blue-700 text-center font-semibold bg-opacity-20'>
              {
                [...deposits].map((dep) => (
                  <tr>
                      <td className='p-4'>{dep.transaction.transaction_id}</td>
                      <td>{dep.transaction.transaction_amount}</td>
                      <td>{dep.transaction.transaction_date}</td>
                      <td>{dep.client.account_number}</td>
                      <td>{dep.client.balance} XAF</td>
                  </tr>
                ))
              }
          </tbody>
        </table>
    </div>
    </>
  )
}
