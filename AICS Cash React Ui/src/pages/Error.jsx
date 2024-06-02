import { ChevronLeftOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Error() {
    const navigate = useNavigate();
  return (
    <div>
        <IconButton onClick={() => navigate("/dashboard")}>
            <ChevronLeftOutlined />
        </IconButton>
        Contact the secretary for this action
    </div>
  )
}
