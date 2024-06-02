import { Close, MoneyOutlined, Notifications, NotificationsOutlined, Search } from '@mui/icons-material'
import React, { useState } from 'react'
import { DUMMYTRANSACTIONS } from '../../constants/constants'
import { Avatar, IconButton, Modal } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function RightBar() {
  const [open, setOpen] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const handleOpenModal = (transaction) => {
        setActiveTransaction(transaction);
        setOpen(!open);
  }
  return (
    <>
        <div className='w-full px-4 py-2 h-full bg-gray-50'>
            <div className='flex mt-5 flex-row justify-between items-center'>
                <div className= 'text-gray-400 rounded-[5px] px-2 border-2 border-gray-300'>
                    <Search />
                    <input type="search" className='bg-transparent outline-none p-2' />
                </div>
                <NotificationsOutlined sx={{fontSize: "30px"}} />
            </div>
            <div className='text-center mt-7 font-semibold text-teal-700 text-[30px]'>Recent Notifications</div>
            <div className='flex flex-col justify-between mt-7 h-[60vh] items-center'>
              {
                [...DUMMYTRANSACTIONS].map(transaction => (
                    <div onClick={() => handleOpenModal(transaction)} className={`${transaction.color} hover:bg-opacity-70 text-[17px] text-white cursor-pointer p-4 w-full rounded-[10px] flex flex-row justify-between items-center`}>
                        <div className='font-bold'>
                          <Avatar sx={{backgroundColor: "white", color:"black", textTransform: "uppercase"}}>{transaction.receiver[0]}{transaction.receiver[1]}</Avatar>
                        </div>
                        <div className='font-bold'>{transaction.transaction_type}</div>
                        <div className='font-bold'>{transaction.date}</div>
                    </div>
                ))
              }
            </div>
        </div>
        <Dialog
        open={open}
        fullWidth
        maxWidth={"md"}
        onClose={() => setOpen(false)}
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
                <IconButton onClick={() => setOpen(!open)}>
                      <Close sx={{fontSize: "30px"}} />
                </IconButton>
              </div>
        <DialogTitle className='text-teal-800 text-center text-[36px] font-bold' sx={{fontSize: "28px", fontWeight: 700}}>Notifications Information</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{fontSize: "18px"}}>Transaction type: <span className='font-bold'>{activeTransaction?.transaction_type}</span></DialogContentText>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}>Transaction Date: <span className='font-bold'>{activeTransaction?.date}</span></DialogContentText>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}>Receiver: <span className='font-bold'>{activeTransaction?.receiver}</span></DialogContentText>
                <DialogContentText sx={{fontSize: "18px", marginTop: "3vh"}}>Amount: <span className='font-bold'>{activeTransaction?.amount}</span></DialogContentText>
              </DialogContent>
        </Dialog>
    </>
  )
}
