import { ChevronRight, Security } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React from 'react'
import { MENUROLES } from '../../constants/constants'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className='mt-7'>
      <div className='flex flex-row h-[30vh] justify-between items-center w-full'>
        <div className='border-2 w-[30%] rounded-[7px] h-full p-4'>
          <div className='flex flex-row justify-center items-center text-[40px] font-bold'> <span className='text-[10px] mb-4 mr-1'>XAF</span> *** ***</div>
          <div className=' text-[12px] font-bold text-blue-600'>Deposits +6.5%</div>
          <button className='mt-7 px-4 bg-blue-600 w-full text-white rounded-t-[10px] rounded-br-[10px] flex flex-row justify-between uppercase items-center'>Add Funds 
          <IconButton onClick={() => navigate("/deposits")}>
          <ChevronRight sx={{fontSize: "28px", color: "white"}} /> 
          </IconButton>
          </button>
        </div>
        <div className='border-2 w-[68%] rounded-[7px] h-full p-4'>
          <div className='flex flex-row justify-between items-center'>
            <div className='text-[12px] text-gray-400 font-bold w-[65%]'>Cash balance history</div>
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
            if (menuRole.role_name === "admin") {
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
      <div className='mt-5 flex flex-row h-[30vh] justify-between items-center'>
          <div className='rounded-[7px] h-full w-[40%] p-4 border-2'>
            <div className='text-gray-400'>Breakdown</div>
              <div className='mt-[13%] flex flex-row justify-between items-center'>
                <div>
              <Security className='p-2 rounded-full text-blue-700 bg-blue-700 bg-opacity-20' sx={{fontSize:"48px"}}/>
              <div className='mt-2 font-bold text-blue-800'>Income</div>
              </div>
              <div>
              <Security className='p-2 rounded-full text-red-600 bg-red-600 bg-opacity-20' sx={{fontSize:"48px"}}/>
              <div className='mt-2 font-bold text-red-600'>Expenditures</div>
              </div>
              </div>
          </div>
          <div className='rounded-[7px] h-full w-[58.5%] p-4 border-2'>
            <div className='text-gray-400'>Breakdown</div>
          </div>
      </div>
    </div>
  )
}
