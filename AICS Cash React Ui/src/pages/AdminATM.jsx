import { ArrowLeftOutlined, ChevronLeftOutlined, Close, DeleteOutline, EditOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { blue, green, red, teal } from '@mui/material/colors';
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DUMMYATM, MENUROLES } from '../constants/constants';
import MainHeader from "../components/MainHeader";
import axiosInstance from '../axiosInstance/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminATM() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState("create");
  const handleOpenModal = (transaction) => {
        setActiveTransaction(transaction);
     setOpen(!open);
  }
  const [location, setLocation]   = useState("");
  const [balance, setBalance] = useState(500000)
  const [ATM, setATM] = useState([])
  useEffect(() => {
    const url = "/api/atm";
    axiosInstance.get(url)
    .then(response => setATM(response.data))
    .catch(error => console.log(error.response.data.message))
  })
  const handleAddAtm = () => {
    const url = "/api/atm/";
    axiosInstance.post(url, {location, balance})
    .then(response => toast.success("Atm added successfully !"))
    .catch(error => toast.error(error))
  }
  return (
    <>
    <div className='p-8'>
        <div className='w-[80%]'>
        <MainHeader  />
        </div>
        <div className='mt-7 text-center w-3/12 m-auto text-[30px] font-bold flex flex-row justify-evenly items-center text-blue-800'>
          <IconButton onClick={() => navigate("/dashboard")}>
          <ChevronLeftOutlined sx={{fontSize: "40px", color:blue[800]}} />
          </IconButton>
          <div>Welcome {JSON.parse(localStorage.getItem("user")).username}</div>
        </div>
        <button onClick={() => {setOpen(!open); setMode("create")}} className='p-3 hover:bg-blue-900 bg-blue-700 text-center text-white rounded-[10px] font-bold'>Add an ATM</button>
        <table className='w-[100%] mt-[2%] m-auto'>
          <thead className='bg-blue-700 p-4 text-[19px] text-white'>
            <tr>
              <th className='p-4'>ATM id</th>
              <th>ATM Location</th>
              <th>ATM Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-blue-700 text-center font-semibold bg-opacity-20'>
              {
                [...ATM].map((role) => (
                  <tr key={role.atm_id}>
                      <td className='p-4'>{role.atm_id}</td>
                      <td>{role.location}</td>
                      <td>{role.atm_balance}</td>
                      <td>
                          <div className='flex flex-row justify-center items-center'>
                                <Tooltip title="Edit">
                                      <IconButton onClick={() => {setSelectedRole(role); setMode("edit"); setOpen(!open)}}>
                                          <EditOutlined sx={{color: green[700]}} />
                                      </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                      <IconButton onClick={() => setOpenDelete(!openDelete)}>
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
            handleAddAtm()
          },
        }}
        sx={{
          width: "70%",
          left: "15%",
          top: "-25%",
          height: "150vh",
          padding: 10
        }}
      >
        <div className='text-right'>
                <IconButton onClick={() => setOpen(!open)}>
                      <Close sx={{fontSize: "30px"}} />
                </IconButton>
              </div>
        <DialogTitle className='text-teal-800 text-center text-[36px] font-bold' sx={{fontSize: "28px", fontWeight: 700}}>{mode==="create" ? "New ATM": "Edit ATM"}</DialogTitle>
              <DialogContent>
              {mode==="edit" &&<DialogContentText sx={{fontSize: "18px", marginBottom:"5vh"}}>ATM ID <span>
                  <input type='text' disabled className='bg-gray-100 p-2 w-[73%] outline-none' placeholder={selectedRole?.atm_id} />
                  </span></DialogContentText>}
                <DialogContentText sx={{fontSize: "18px"}}>ATM Location <span>
                  <input value={location} onChange={e => setLocation(e.target.value)} type='text' className='bg-gray-100 p-2 w-[73%] outline-none' placeholder={mode==="create" ? "E.g Yaounde": `${selectedRole?.location}`} />
                  </span></DialogContentText>
                  <DialogContentText sx={{fontSize: "18px"}}>ATM balance <span>
                  <input type='number' value={balance} onChange={e => setBalance(e.target.value)} min={25000} className='bg-gray-100 mt-7 p-2 w-[73%] outline-none' placeholder={mode==="create" ? "E.g 250000 XAF": `${selectedRole?.atm_balance}`} />
                  </span></DialogContentText>
              </DialogContent>
              <DialogActions className='mb-5 mt-10 mr-5'>
                  <button className='bg-green-700 text-white p-3 rounded-[10px]'>{mode==="create" ? "Add": "Edit"}</button>
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
        <DialogTitle className='text-teal-800 text-center text-[20px] font-bold' sx={{fontSize: "20px", fontWeight: 700}}>Are you sure to proceed ?</DialogTitle>
              <DialogActions className='mr-5'>
                  <button className='bg-green-700 text-white p-3 rounded-[10px]'>Delete</button>
                  <button onClick={() => setOpenDelete(!openDelete)} className='bg-red-700 text-white p-3 rounded-[10px]'>Cancel</button>
              </DialogActions>
        </Dialog>
    </div>
    </>
  )
}
