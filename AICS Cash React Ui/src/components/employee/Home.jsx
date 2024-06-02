import { ChevronRight, Security } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MENUROLES } from '../../constants/constants'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from "../../axiosInstance/axiosInstance";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className='mt-7'>
      <div className='text-[28px] mb-7 font-semibold'>Welcome <span className='font-bold text-teal-700'> {JSON.parse(localStorage.getItem("user"))?.username}</span></div>
      <div className='flex flex-row h-[30vh] justify-between items-center w-full'>
        <div className='border-2 w-[30%] rounded-[7px] h-full p-4'>
          <div className='flex flex-row justify-center items-center text-[40px] font-bold'> <span className='text-[10px] mb-4 mr-1'>XAF</span> *** ***</div>
          <div className=' text-[12px] font-bold text-blue-600'>Deposits +6.5%</div> 
        </div>
        <div className='border-2 w-[68%] rounded-[7px] h-full p-4'>
          <div className='flex flex-row justify-between items-center'>
            <div className='text-[12px] text-gray-400 font-bold w-[65%]'>Account Creation history</div>
            <div className='flex flex-row justify-between items-center w-[35%]'>
              <div className='bg-blue-700 p-2 rounded-[7px] text-white font-bold text-center w-[32%]'>Day</div>
              <div className='bg-white cursor-pointer p-2 rounded-[7px] font-bold text-gray-400 text-center w-[32%]'>Week</div>
              <div className='bg-white cursor-pointer p-2 rounded-[7px] font-bold text-gray-400 text-center w-[32%]'>Month</div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-7'>
        {
          [...MENUROLES].map((menuRole) => {
            if (menuRole.role_name === "employee") {
              return(
                <div className='flex flex-row justify-between items-center'>
                  {
                    menuRole.menu.map((singleMenu) => (
                      <div key={singleMenu.name} className='p-4 cursor-pointer hover:bg-blue-700 hover:text-white w-[19%] rounded-[7px] border-2'>
                        <Link to={`/${singleMenu.route}`} className=' font-bold'>
                              <singleMenu.icon sx={{fontSize: "36px"}} />
                              <div className='mt-5'>{singleMenu.name}</div>
                        </Link>
                      </div>
                    )
                  )
                  }
                </div> 
              )
            }
          })
        }
      </div>
    </div>
  )
}
