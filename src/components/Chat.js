import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {API} from '../global.js';

const Chat = () => {
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        await axios.get(`${API}/api/chat`).then((res) => {
            console.log(res.data);
            setChats(res.data);
        })
       
    }

    useEffect(() => {
        fetchChats();
    },[]);

  return (
    <div>
    {chats.map((ele) => {
        return(
        <div key={ele._id}>{ele.chatName}</div>
        )
    })}
    </div>
  )
}

export default Chat