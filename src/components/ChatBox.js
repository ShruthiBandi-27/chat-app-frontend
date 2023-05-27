import { Box } from '@mui/material'
import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = ChatState();
  return (
    <Box
      sx={{
        backgroundColor: "black",
        display: "flex",
        // alignItems: "center",
        flexDirection: "column",
        padding: "3px",
        width: "68%",
        height: "95%",
        marginLeft: "40px",
        color: "white",
        
      }}
    >
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox