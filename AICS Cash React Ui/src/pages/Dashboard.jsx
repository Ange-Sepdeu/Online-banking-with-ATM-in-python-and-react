import React, { useEffect } from 'react'
import MainHeader from '../components/MainHeader'
import ClientHome from "../components/client/ClientHome";
import TransactionRightBar from '../components/client/TransactionRightBar';
import EmployeeRightBar from '../components/employee/EmployeeRightBar';
import Home from '../components/admin/Home';
import RightBar from '../components/admin/RightBar';
import EmployeeHome from "../components/employee/Home";
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate()
  useEffect(() => {
    if(localStorage.getItem("token")==null)
        navigate("/login")
    
  })
  return (
    <div className='flex bg-[#ffffff] flex-row w-full justify-between items-center h-[100vh]'>
        <div className='h-full px-12 py-8 w-[75%]'>
          <MainHeader />
            {JSON.parse(localStorage.getItem("role")) === "client" && <ClientHome />}          
            {JSON.parse(localStorage.getItem("role")) === "admin" && <Home />}          
            {JSON.parse(localStorage.getItem("role")) === "employee" && <EmployeeHome />}          
        </div>
        <div className='h-full w-[25%]'>
        {JSON.parse(localStorage.getItem("role")) === "client" && <TransactionRightBar />}          
            {JSON.parse(localStorage.getItem("role")) === "admin" && <RightBar />}          
            {JSON.parse(localStorage.getItem("role")) === "employee" && <EmployeeRightBar />}          
        </div>
    </div>
  )
}
