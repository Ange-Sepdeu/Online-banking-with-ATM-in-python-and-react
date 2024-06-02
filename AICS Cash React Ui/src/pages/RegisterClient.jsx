import React from 'react'
import loginImage from "../assets/login2.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IconButton } from '@mui/material';
import { ChevronLeftOutlined } from '@mui/icons-material';
import axiosInstance from '../axiosInstance/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterClient() {
  const {handleSubmit, register, formState: { errors }} = useForm();
  const navigate = useNavigate()
  const onSubmit = (values) => {
        axiosInstance.post("/api/auth/client-register/", {...values, status:"active"})
        .then(response => toast.success("Client created successfully !"))
        .catch(error => toast.error(error.response.data.message))
  }
  return (
    <div className='bg-gray-100 py-5 w-full h-[100vh]'>
        <IconButton onClick={() => navigate("/employee-clients")}>
            <ChevronLeftOutlined /> Go back
        </IconButton>
    <div className=' w-[75%] rounded-[12px] bg-white shadow-xl flex flex-row justify-between items-center m-auto'>
       <div className='w-[55%] rounded-l-[10px] p-8'>
       <img src={loginImage} alt="Login Image 1"/>
       </div>
      <div className='h-full w-[45%] p-6'>
        <h2 className='text-[30px] text-red-400 font-semibold'>Add a client</h2>
        <form onSubmit={handleSubmit(onSubmit)} method="post">
          <div className='mt-5'>
        <label className='text-[14px] font-semibold'>Username</label>
        <br /><input 
          type='text' 
          {...register("username", {
            required: "* Required field",
            pattern: {
              value: /^[A-Za-z ]*$/i,
              message: "Enter a valid name"
            }
          })}
          placeholder='Ex: John Doe' 
          className='outline-none bg-gray-100 p-2 rounded-[7px] w-full' />
          {errors.username && <div className="text-red-600 mt-2"> {errors.username.message} </div>}
        </div>
        <div className='mt-5'>
        <label className='text-[14px] font-semibold'>Email</label>
        <br /><input 
          type='email' 
          placeholder='Ex: abcd@gmail.com'
          {...register("email", {
            required: "* Required field",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Enter a valid email address"
            }
          })} 
          className='outline-none bg-gray-100 p-2 rounded-[7px] w-full' />
          {errors.email && <div className="text-red-600 mt-2"> {errors.email.message} </div>}
        </div>
        <div className='mt-5'>
        <label className='text-[14px] font-semibold'>Password</label>
        <br /><input 
            type='password' 
            {...register("password", {
              required: "* Required field",
              minLength: {
                value: 6,
                message: "Password should have more than 6 characters"
              },
              pattern: {
                value: /^[A-Za-z0-9 ._%+/@#{}*$^&]+$/i,
                message: "light password: should contain uppercase, lowercase, numbers, special chars"
              }
            })} 
            placeholder='****************' className='outline-none bg-gray-100 p-2 rounded-[7px] w-full' />
          {errors.password && <div className="text-red-600 mt-2"> {errors.password.message} </div>}
        </div>
        <div className='mt-5'>
        <label className='text-[14px] font-semibold'>Phone Number</label>
        <br /><input type='tel'
         {...register("tel", {
          required: "* Required field",
          maxLength: {
            value: 9,
            message: "Phone should be 9 characters"
          },
          minLength: {
            value: 9,
            message: "Phone should be 9 characters"
          },
          pattern: {
            value: /^6{1}(5\d|(7\d|[89]\d))\d{3}\d{3}$/,
            message: "Enter either MTN or Orange"
          }
        })} 
        placeholder='Ex: 691254525' className='outline-none bg-gray-100 p-2 rounded-[7px] w-full' />
        {errors.tel && <div className="text-red-600 mt-2"> {errors.tel.message} </div>}
        </div>
        <div className='w-full'>
          <button className='p-2 hover:bg-red-500 m-auto w-full mt-5 bg-gray-900 text-white font-semibold rounded-[10px]' type="submit">Register</button>
        </div>
        </form>
      </div>
    </div>
    </div>
  )
}
