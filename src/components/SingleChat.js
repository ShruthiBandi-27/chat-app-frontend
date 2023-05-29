import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  CircularProgress,
  FilledInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import axios from "axios";
import { API } from "../global.js";
import { ToastContainer, toast } from "react-toastify";
import './styles.css'
import ScrollableChat from "./ScrollableChat";
import { io } from 'socket.io-client';

const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const fetchMessages = async () => {
    if(!selectedChat) return;

    try {
        setLoading(true);
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          await axios.get(`${API}/api/message/fetchMessages/${selectedChat._id}`, config)
                .then((res) => {
                   // console.log(`fetched messages: ${JSON.stringify(res.data)}`)
                    setMessages(res.data);
                    setLoading(false);
                    socket.emit("join chat",selectedChat._id);
                })
    }
    catch (err) {
        toast.error(`Error Occured Failed to load messages! : ${err}`, {
            autoClose: 2000,
            position: "top-left",
          });
        setLoading(false);
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false))
  }, [])

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat])

  console.log(notification, "--------------");

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
        //show notification
        if(!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
      else {
        setMessages([...messages, newMessageReceived]);
      }
    })
  })

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
        setNewMessage("");
        await axios.post(`${API}/api/message/sendMessage`,{
            content: newMessage,
            chatId: selectedChat._id
        }, config)
        .then((res) => {
            //console.log(`entered mesg: ${JSON.stringify(res.data)}`)
            socket.emit("new message", res.data)
            setMessages([...messages, res.data])
        })
      }
      catch(err) {
        toast.error(`Error Occured Failed to send message! : ${err}`, {
            autoClose: 2000,
            position: "top-left",
          });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //Typing indicator logic
    if(!socketConnected) return;

    if(!typing) {
      setTyping(true);
      socket.emit("typing",selectedChat._id)
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(()=> {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if(timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength)
  }

  return (
    <>
    <ToastContainer/>
      {selectedChat ? (
        <>
          {!selectedChat.isGroupChat ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // padding: "10px",
                margin: "5px",
              }}
            >
              {getSender(user, selectedChat.users).toUpperCase()}
              <ProfileModal user={getSenderFull(user, selectedChat.users)} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // padding: "10px",
                margin: "5px",
              }}
            >
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModel
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "95%",
              backgroundColor: "#E8E8E8",
              color: "black",
              borderRadius: "10px",
              overflowY: "hidden",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress size={50} />
              </Box>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages}/>
              </div>
            )}
            <Box sx={{ marginTop: "auto" }} onKeyDown={sendMessage}>
            <FormControl
              fullWidth
              variant="filled"
            >
              <InputLabel htmlFor="userMessage" sx={{color:"#42C152"}}>Enter Message</InputLabel>
              {/* {isTyping ? <div style={{color:"#42C152", padding: "3px"}} >Typing...</div> : <></>} */}
              <FilledInput 
              id="userMessage" 
              color="success"
               sx={{margin:"0px 6px 10px 6px"}} 
              onChange={typingHandler}
              value={newMessage}
               />
            </FormControl>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            backgroundColor: "#E8E8E8",
            color: "black",
            borderRadius: "10px",
          }}
        >
          <p>Click on a user to start chatting</p>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
