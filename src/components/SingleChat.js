import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@mui/material';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModel from './UpdateGroupChatModel';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const {user, selectedChat, setSelectedChat} = ChatState();
  return (
    <>
    {
        selectedChat ? (
            <>
                {
                    !selectedChat.isGroupChat ? (
                       <Box
                         sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            // padding: "10px",
                            margin: "5px"
                         }}
                         >
                        {getSender(user, selectedChat.users).toUpperCase()}
                        <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                        </Box>

                    ) : (
                        <Box
                         sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            // padding: "10px",
                            margin: "5px"
                         }}
                        >
                        {selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />
                        </Box>   
                    )
                }
                <Box
                 sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "95%",
                    backgroundColor: "#E8E8E8",
                    color: "black",
                    borderRadius: "10px",
                    overflowY: "hidden",
                 }}
                >

                </Box>
            </>
        ) : (
            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "95%",
                backgroundColor: "#E8E8E8",
                color: "black",
                margin: "5px 0",
                borderRadius: "10px",
            }}
            >
            <p>Click on a user to start chatting</p>
            </Box>
        )
    }

    </>
  )
}

export default SingleChat