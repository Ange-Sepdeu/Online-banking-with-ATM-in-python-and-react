import { MenuOutlined, Search, Logout } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import {useNavigate} from "react-router-dom"

export default function MainHeader() {
  const navigate = useNavigate();
  return (
    <div className='flex justify-between items-center flex-row w-full'>
      <div className='w-1/12'>
        <Tooltip title="Logout">
        <IconButton onClick={() => {
          localStorage.clear();
          navigate("/login")
        }}>
        <Logout />
        </IconButton>
        </Tooltip>
      </div>
      <div className='w-2/12 text-[22px] font-bold'>AICS-Cash</div>
      <div className='px-2 text-gray-400 rounded-[5px] flex flex-row justify-between w-8/12 bg-gray-100 items-center'>
        <Search />
        <input type="search" className='bg-transparent outline-none p-2 w-11/12' placeholder='Search' />
      </div>
    </div>
  )
}
