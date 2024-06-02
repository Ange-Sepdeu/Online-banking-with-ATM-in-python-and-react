import { ArrowLeftOutlined, ChevronLeftOutlined, Close, DeleteOutline, EditOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { blue, red, green } from '@mui/material/colors';
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DUMMYATM } from '../constants/constants';
import { Tooltip } from '@mui/material';
import MainHeader from "../components/MainHeader";
import axiosInstance from '../axiosInstance/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Employee() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [mode, setMode] = useState("create");
  const handleOpenModal = (transaction) => {
        setActiveTransaction(transaction);
        setOpen(!open);
  }
  const [employees, setEmployees] = useState([])
  const handleAddEmployee = () => {
    const url = "/api/auth/employee-register/";
    axiosInstance.post(url, {username, email, tel, password, status:"active", matricle:"emp"+new Date().getTime()})
    .then(response => toast.success("Employee added successfully !"))
    .catch(error => {
      console.log(error)
      toast.error(error.response.data[0])
    })
  }
  const handleUpdateEmployee = () => {}
  const handleDeleteEmployee = () => {}
  useEffect(() => {
    axiosInstance.get("/api/employee/")
    .then(response => setEmployees(response.data.data))
    .catch(error => alert(error))
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
          <div>E-cash employees</div>
        </div>
        <button onClick={() => {setOpen(!open); setMode("create")}} className='p-3 hover:bg-blue-900 bg-blue-700 text-center text-white rounded-[10px] font-bold'>New Employee</button>
        <table className='w-[100%] mt-[2%] m-auto'>
          <thead className='bg-blue-700 p-4 text-[19px] text-white'>
            <tr>
              <th className='p-3'>Employee id</th>
              <th>Employee Name</th>
              <th>Employee Email</th>
              <th>Employee Tel</th>
              <th>Creation Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-blue-700 text-center font-semibold bg-opacity-20'>
              {
                [...employees].map((emp) => (
                  <tr>
                      <td className='p-4'>{emp.matricle}</td>
                      <td>{emp.username}</td>
                      <td>{emp.email}</td>
                      <td>{emp.tel}</td>
                      <td>{emp.time_created}</td>
                      <td>
                      <div className='flex flex-row justify-center items-center'>
                                <Tooltip title="Edit">
                                      <IconButton onClick={() => {setSelectedEmployee(emp); setMode("edit"); setOpen(!open)}}>
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
           mode==="create" ? handleAddEmployee():handleUpdateEmployee()
          },
        }}
        sx={{
          width: "70%",
          left: "15%",
          top: "-25%",
          padding: 10,
          height: "150vh"
        }}
      >
        <div className='text-right'>
                <IconButton onClick={() => setOpen(!open)}>
                      <Close sx={{fontSize: "30px"}} />
                </IconButton>
              </div>
        <DialogTitle className='text-teal-800 text-center text-[36px] font-bold' sx={{fontSize: "28px", fontWeight: 700}}>{mode==="create" ?"New Employee":"Edit Employee"}</DialogTitle>
              <DialogContent>
                {
                  mode === "edit" && <DialogContentText sx={{fontSize: "18px"}}>Employee ID <span>
                  <input type='text' className='bg-gray-100 p-2 w-[73%] mb-5 outline-none' disabled placeholder={`${selectedEmployee?.matricle}`} />
                    </span></DialogContentText>
                }
                <DialogContentText sx={{fontSize: "18px"}}>Employee Name <span>
                <input value={username} onChange={e => setUsername(e.target.value)} type='text' className='bg-gray-100 p-2 w-[73%] outline-none' placeholder={mode==="create"?'E.g 6149752as555':`${selectedEmployee?.username}`} />
                  </span></DialogContentText>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}>Employee Email 
                <span className='ml-7'> <input type='email' value={email} onChange={e => setEmail(e.target.value)} className='bg-gray-100 p-2 w-[70%] outline-none' placeholder={mode==="create"?'E.g doe@gmail.com':`${selectedEmployee?.email}`} /> </span>
                </DialogContentText>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}>Employee Tel 
                <span className='ml-7'> <input type='tel' value={tel} onChange={e => setTel(e.target.value)} className='bg-gray-100 p-2 w-[70%] outline-none' placeholder={mode==="create"?'E.g 675124892':`${selectedEmployee?.tel}`} /> </span>
                </DialogContentText>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}>Password 
                <span className='ml-7'> <input value={password} onChange={e => setPassword(e.target.value)} type='password' className='bg-gray-100 p-2 w-[70%] outline-none' placeholder={mode==="create"?'E.g **********':`***********`} /> </span>
                </DialogContentText>
              </DialogContent>
              <DialogActions className='mb-5 mt-5 mr-5'>
                  <button className='bg-green-700 text-white p-3 rounded-[10px]'>{mode==="create"?"Add":"Edit"}</button>
                  <button onClick={() => setOpen(!open)} className='bg-red-700 text-white p-3 rounded-[10px]'>Cancel</button>
              </DialogActions>
        </Dialog>
    </div>
    <Dialog
        open={openDelete}
        fullWidth
        maxWidth={"sm"}
        onClose={() => setOpenDelete(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (e) => {
            e.preventDefault();
            handleDeleteEmployee()
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
                  <button className='bg-green-700 text-white p-3 rounded-[10px]' type='submit'>Delete</button>
                  <button onClick={() => setOpenDelete(!openDelete)} className='bg-red-700 text-white p-3 rounded-[10px]'>Cancel</button>
              </DialogActions>
        </Dialog>
    </>
  )
}
