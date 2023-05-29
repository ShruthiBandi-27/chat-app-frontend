import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../global.js";
import { Box, Card, Grid } from "@mui/material";
import { ChatState } from "../Context/ChatProvider.js";
import MyChats from "./MyChats.js";
import ChatBox from "./ChatBox.js";
import SideDrawer from "./SideDrawer.js";
import "../App.css";

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%"}}>
      {user && <SideDrawer/>}
     
      <Box sx={{display:"flex", justifyContent: "space-between", width:"100%" , height:"89vh",padding:"10px", backgroundColor:"whitesmoke"}}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  );
};

export default Chat;


