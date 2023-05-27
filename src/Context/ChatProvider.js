import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!userInfo) {
            nav("/");
        }
    },[nav]);

    return (
    <ChatContext.Provider value={{user,setUser, selectedChat, setSelectedChat, chats, setChats}}>
    {children}
    </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;