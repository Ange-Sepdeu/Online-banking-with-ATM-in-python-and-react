import React from 'react'
import loginImage from "../assets/login2.jpg";
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function Register() {
  const {handleSubmit, register, formState: { errors }} = useForm();
  const onSubmit = (values) => {}
  return (
    <div className='bg-gray-100 py-10 w-full h-[100vh]'>
    <div className=' w-[75%] rounded-[12px] bg-white shadow-xl flex flex-row justify-between items-center m-auto'>
       <div className='w-[55%] rounded-l-[10px] p-8'>
       <img src={loginImage} alt="Login Image 1"/>
       </div>
      <div className='h-full w-[45%] p-6'>
        <div className='text-[14px] font-semibold text-gray-500'>Welcome to E-cash</div>
        <h2 className='text-[30px] text-red-400 font-semibold'>Create An Account</h2>
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
          <div className='text-center text-gray-500 mt-3'>Got an account ? <Link to={"/login"} className='font-bold text-gray-900 hover:text-red-500'>login</Link></div>
        </div>
        </form>
      </div>
    </div>
    </div>
  )
}
