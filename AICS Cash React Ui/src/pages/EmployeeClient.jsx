import { AddOutlined, ArrowLeftOutlined, ChevronLeftOutlined, Close, DeleteOutline, EditOutlined, PlusOneOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { blue, teal, green, red, orange, yellow } from '@mui/material/colors';
import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
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

export default function EmployeeClient() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [action, setAction] = useState(false);
  const [activeClient, setActiveClient] = useState(null);
  const handleOpenModal = (transaction) => {
        setActiveClient(transaction);
        setOpen(!open);
  }
  const [clients, setClients] = useState([]);
  const [balance, setBalance] = useState(10000)
  useEffect(() => {
      axiosInstance.get("/api/client/")
      .then(response => setClients(response.data.data))
      .catch(error => console.log(error))
  })
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
          <div>AICS-cash Clients</div>
        </div>
        <Link to={"/register-client"} className='bg-blue-700 p-2 text-white rounded-[10px] '>Add a client</Link>
        <table className='w-[100%] mt-[2%] m-auto'>
          <thead className='bg-blue-700 p-4 text-[19px] text-white'>
            <tr>
              <th className='p-4'>Client id</th>
              <th>Client Name</th>
              <th>Email</th>
              <th>Tel</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-blue-700 text-center font-semibold bg-opacity-20'>
              {
                [...clients].map((client) => (
                  <tr>
                      <td className='p-4'>{client.client_id}</td>
                      <td>{client.username}</td>
                      <td>{client.email}</td>
                      <td>{client.tel}</td>
                      <td>{client.status}</td>
                      <td>{client.time_created}</td>
                      <td>
                      <div className='flex flex-row justify-center items-center'>
                                <Tooltip title="Add a bank account">
                                      <IconButton onClick={() => handleOpenModal(client)}>
                                          <AddOutlined sx={{color: green[700]}} />
                                      </IconButton>
                                </Tooltip>
                          </div>
                      </td>
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
        PaperProps={{
          component: 'form',
          onSubmit: (e) => {
            e.preventDefault();
            const url = "/api/bankaccount/";
            axiosInstance.post(url, {client:activeClient?.client_id, ...activeClient, balance})
            .then(response => toast.success("Bank account created successfully !"))
            .catch(error => toast.error(error))
          },
        }}
        sx={{
          width: "70%",
          left: "15%",
          height: "150vh",
          top: "-25%",
          padding: 10
        }}
      >
        <div className='text-right'>
                <IconButton onClick={() => setOpen(!open)}>
                      <Close sx={{fontSize: "30px"}} />
                </IconButton>
              </div>
        <DialogTitle className='text-teal-800 text-center text-[36px] font-bold' sx={{fontSize: "28px", fontWeight: 700}}>New bank account</DialogTitle>
              <DialogContent>
              <div className='text-[22px] font-bold'>Client Information</div>
                <DialogContent>
                    <div className='text-[22px]'>Client Name: {activeClient?.username}</div>
                    <div className='text-[22px]'>Client Email: {activeClient?.email}</div>
                    <div className='text-[22px]'>Client Tel: {activeClient?.tel}</div>
                </DialogContent>
                <div className='text-[22px] font-bold'>Account Information</div>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}> Initial Deposit 
                <span className='ml-7'> <input type='number' className='bg-gray-100 p-2 w-[75%] outline-none' value={balance} onChange={(e) => setBalance(e.target.value)} required placeholder='E.g 25 000 XAF' /> </span>
                </DialogContentText>
              </DialogContent>
              <DialogActions className='mb-5 mt-10 mr-5'>
                  <button type="submit" className='bg-green-700 text-white p-3 rounded-[10px]'>Create</button>
                  <button onClick={() => setOpen(!open)} className='bg-red-700 text-white p-3 rounded-[10px]'>Cancel</button>
              </DialogActions>
        </Dialog>
        <Dialog
        open={openDelete}
        fullWidth
        maxWidth={"sm"}
        onClose={() => setOpenDelete(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (e) => {
            e.preventDefault();
          },
        }}
        sx={{
          width: "50%",
          left: "25%",
          padding: 10
        }}
      >
        <div className='text-right'>
                <IconButton onClick={() => setOpenDelete(!openDelete)}>
                      <Close sx={{fontSize: "30px"}} />
                </IconButton>
              </div>
        <DialogTitle className='text-teal-800 text-center text-[20px] font-bold' sx={{fontSize: "20px", fontWeight: 700}}>Are you sure to {action} the user ?</DialogTitle>
              <DialogActions className='mr-5'>
                  <button className='bg-green-700 text-white p-3 rounded-[10px]'>{action}</button>
                  <button onClick={() => setOpenDelete(!openDelete)} className='bg-red-700 text-white p-3 rounded-[10px]'>Cancel</button>
              </DialogActions>
        </Dialog>
    </div>
    </>
  )
}
