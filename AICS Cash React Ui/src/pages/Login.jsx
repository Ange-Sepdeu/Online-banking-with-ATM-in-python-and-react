import React, { useState } from 'react'
import loginImage from "../assets/login2.jpg";
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance/axiosInstance";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        if (login==="" || password==="") {
          toast.error("Fill in the empty fields ! "+password)
        }
        else {
            var url = ""
            switch(true) {
              case login.includes("@"):
                url = "/api/auth/client-login/";
                axiosInstance.post(url, {email:login, password:password})
                .then(response => {
                  localStorage.setItem("user", JSON.stringify(response.data.data))
                  localStorage.setItem("token", JSON.stringify(response.data.token))
                  localStorage.setItem("role", JSON.stringify(response.data.role))
                  toast.success("Welcome "+response.data.data.username)
                  navigate("/dashboard");
                })
                .catch(error => toast.error(error.response.data.message))
                break;
              case login.includes("emp"):
                  url = "/api/auth/employee-login/";
                  axiosInstance.post(url, {matricle:login, password:password})
                  .then(response => {
                    console.log(response.data)
                    localStorage.setItem("user", JSON.stringify(response.data.data))
                    localStorage.setItem("token", JSON.stringify(response.data.token))
                    localStorage.setItem("role", JSON.stringify(response.data.role))
                    toast.success("Welcome "+response.data.data.username)
                    navigate("/dashboard");
                  })
                  .catch(error => toast.error(error.response.data.message))
                  break;
              default:
                url = "/api/auth/admin-login/";
                axiosInstance.post(url, {username:login, password:password})
                .then(response => {
                  localStorage.setItem("user", JSON.stringify(response.data.data))
                  localStorage.setItem("token", JSON.stringify(response.data.token))
                  localStorage.setItem("role", JSON.stringify(response.data.role))
                  toast.success("Welcome "+response.data.data.username)
                  navigate("/dashboard");
                })
                .catch(error => toast.error(error.response.data.message))
            }
        }
    }
  return (
    <div className='bg-gray-100 py-10 w-full h-[100vh]'>
    <div className=' w-[75%] rounded-[12px] bg-white shadow-xl flex flex-row justify-between items-center m-auto'>
       <div className='w-[55%] rounded-l-[10px] p-8'>
       <img src={loginImage} alt="Login Image 1"/>
       </div>
      <div className='h-full w-[45%] p-12'>
        <div className='text-[14px] font-semibold text-gray-500'>Welcome to AICS-Cash</div>
        <h2 className='text-[30px] text-red-400 font-semibold'>Sign In</h2>
        <form onSubmit={handleLogin} method="post">
          <div className='mt-5'>
        <label className='text-[18px] font-semibold'>login</label>
        <br /><input type='text' value={login} onChange={e => setLogin(e.target.value)} required placeholder='Ex: abcd.com | po112 | JD' className='outline-none bg-gray-100 p-4 rounded-[7px] w-full' />
        </div>
        <div className='mt-5'>
        <label className='text-[18px] font-semibold'>Password</label>
        <br /><input type='password' onChange={(e) => setPassword(e.target.value)} required value={password} placeholder='****************' className='outline-none bg-gray-100 p-4 rounded-[7px] w-full' />
        <div className='text-right font-semibold mt-2 text-red-500'>
          <Link>Forgot password ?</Link>
        </div>
        </div>
        <div className='w-full'>
          <button className='p-2 font-semibold hover:bg-red-500 m-auto w-full mt-5 bg-gray-900 text-white rounded-[10px]' type="submit">Login</button>
          <div className='text-center text-gray-500 mt-3'>Don't have an account ? <Link className='font-bold text-gray-900 hover:text-red-500' to={"/register"}>register</Link></div>
        </div>
        </form>
      </div>
    </div>
    </div>
  )
}
