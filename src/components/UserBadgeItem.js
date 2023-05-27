import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box sx = {{
        margin: "2px",
        padding: "2px",
        backgroundColor: "purple",
        color: "white",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center"
    }}
    onClick={handleFunction}
    >
    {user.name}
    <CloseIcon sx={{ fontSize: '16px' }}/>
    </Box>
  )
}

export default UserBadgeItem