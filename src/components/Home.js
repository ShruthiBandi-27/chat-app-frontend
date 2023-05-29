import React, { useEffect, useState } from "react";
import { Box, Card, Container, Tab, Tabs } from "@mui/material";
import "../App.css";
import { blue } from "@mui/material/colors";
import Signup from "./Signup";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import SideDrawer from "./SideDrawer";

const Home = () => {
  const [value, setValue] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      nav("/chats");
    }
  }, [nav]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="sm" className="container">
      <Card className="card">{<h1>Let's Chat</h1>}</Card>
      <Card className="card">
        <div>
          <Tabs value={value} onChange={handleChange}>
            <Tab sx={{ width: "50%" }} label="Login" value={0} />
            <Tab label="Sign Up" value={1} />
          </Tabs>
          <div className="login">
            {value === 0 && <Login />}
            {value === 1 && <Signup />}
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default Home;
