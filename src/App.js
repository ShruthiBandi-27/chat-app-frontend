import { Button } from "@mui/material";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Chat from "./components/Chat";
import ChatProvider from "./Context/ChatProvider";

function App() {
  return (
      <BrowserRouter>
      <ChatProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chat />} />
          </Routes>
        </div>
        </ChatProvider>
      </BrowserRouter>
    
  );
}

export default App;
