import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Avatar, Box } from '@mui/material';

const UserListItem = ({handleFunction, user}) => {
  return (
    <Box
    onClick={handleFunction}
    sx={{
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backgroundColor: "#E8E8E8",
        color: "black",
        padding: "3px",
        width: "95%",
        margin: "5px",
        "&:hover": {
            color: "white !important",
            backgroundColor: "#38B2AC !important",
        },
        borderRadius: "5px"
    }}
    >
     {
        user && user.name ? (
          <Avatar src={user.profile} alt={user.name} />
        ) : (
          <Avatar />
        )
        }
        <Box 
        sx={{
            marginLeft: "2px"
        }}
        >
            <p>{user.name}</p>
            <p><span><b>Email: </b></span>{user.email}</p>
        </Box>
    </Box>
  )
}

export default UserListItem