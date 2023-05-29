import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { API } from "../global.js";
import { toast } from "react-toastify";
import { Box, Button, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({fetchAgain, setFetchAgain}) => {
  const divStyles = {
    backgroundColor: "yellow",
    color: "white",
    padding: "10px",
  };

  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats} = ChatState();

  const fetchChats = () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      axios.get(`${API}/api/chat/fetchChats`, config).then((res) => {
        console.log(`fetched chats: ${JSON.stringify(res.data)}`);
        setChats(res.data);
      });
    } catch (err) {
      toast.error("Failed to load chats", {
        autoClose: 2000,
        position: "top-left",
      });
    }
  };
  //fetchChats();
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      sx={{
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "3px",
        width: "31%",
        marginLeft: "40px",
        height: "95%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "3px",
          backgroundColor:"black"
        }}
      >
        MyChats
        <GroupChatModal>
        <Button
          variant="contained"
          size="small"
          endIcon={<Add />}
          style={{ backgroundColor: "#BDBDBD", color: "white", margin: "5px" }}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          padding: "3px",
          backgroundColor: "black",
          //backgroundColor: "yellow",
          overflowY: "hidden",
        }}
      >
      {console.log(`chats filled: ${JSON.stringify(chats)}`)}
        {chats ? (
          chats.map((chat) => {
            return (
              <Box
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat)
                  // console.log(`shruthi : selectedChat: ${JSON.stringify(selectedChat)}`)
                  // console.log(`shruthi : Chat: ${JSON.stringify(chat)}`)
                  // console.log(`shruthi :check selectedchat and Chat are equal: ${selectedChat._id === chat._id}`)
                  
                }}
                sx={{
                  cursor: "pointer",
                  padding: "3px",
                  backgroundColor:  selectedChat && selectedChat === chat ? "#42C152" : "#E8E8E8",
                  color: selectedChat && selectedChat === chat? "white" : "black" ,
                  borderRadius: "5px",
                  margin: "5px",
                }}
                
              >
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </Box>
            );
          })
        ) : (
          <CircularProgress size={24} />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
