import { ArrowLeftOutlined, ChevronLeftOutlined, Close, DeleteOutline, EditOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { blue, teal, green, red, orange, yellow } from '@mui/material/colors';
import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DUMMYATM } from '../constants/constants';
import MainHeader from "../components/MainHeader";
import { Tooltip } from '@mui/material';
import axiosInstance from '../axiosInstance/axiosInstance';

export default function Client() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [action, setAction] = useState(false);
  const [clients, setClients] = useState([]);
  useEffect(() => {
      axiosInstance.get("/api/client/")
      .then(response => setClients(response.data.data))
      .catch(error => console.log(error))
  })
  const [activeTransaction, setActiveTransaction] = useState(null);
  const handleOpenModal = (transaction) => {
        setActiveTransaction(transaction);
        setOpen(!open);
  }
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
          <div>E-cash Clients</div>
        </div>
        <table className='w-[100%] mt-[2%] m-auto'>
          <thead className='bg-blue-700 p-4 text-[19px] text-white'>
            <tr>
              <th className='p-4'>Client id</th>
              <th>Client Name</th>
              <th>Email</th>
              <th>Tel</th>
              <th>Status</th>
              <th>Creation Date</th>
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
                                <Tooltip title="Suspend">
                                      <IconButton onClick={() => {setAction("Suspend"); setOpenDelete(!openDelete)}}>
                                          <EditOutlined sx={{color: orange[900]}} />
                                      </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                      <IconButton onClick={() => {setAction("delete"); setOpenDelete(!openDelete)}}>
                                          <DeleteOutline sx={{color: red[700]}} />
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
          },
        }}
        sx={{
          width: "70%",
          left: "15%",
          padding: 10
        }}
      >
        <div className='text-right'>
                <IconButton onClick={() => setOpen(!open)}>
                      <Close sx={{fontSize: "30px"}} />
                </IconButton>
              </div>
        <DialogTitle className='text-teal-800 text-center text-[36px] font-bold' sx={{fontSize: "28px", fontWeight: 700}}>ATM Withdrawal Information</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{fontSize: "18px"}}>Account Number <span>
                <input type='text' className='bg-gray-100 p-2 w-[73%] outline-none' placeholder='E.g 6149752as555' />
                  </span></DialogContentText>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}>Amount 
                <span className='ml-7'> <input type='number' className='bg-gray-100 p-2 w-[80%] outline-none' placeholder='E.g 25 000 XAF' /> </span>
                </DialogContentText>
              </DialogContent>
              <DialogActions className='mb-5 mt-10 mr-5'>
                  <button className='bg-green-700 text-white p-3 rounded-[10px]'>Withdraw</button>
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
