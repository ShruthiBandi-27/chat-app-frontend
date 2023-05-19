import React, { useState } from "react";
import { Box, Card, Container, Tab, Tabs } from "@mui/material";
import "../App.css";
import { blue } from "@mui/material/colors";
import Signup from "./Signup";
import Login from "./Login";

const Home = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="sm" className="container">
      <Card className="card">{<p>Let's Chat</p>}</Card>
      <Card className="card">
      <div>
      <Tabs value={value} onChange={handleChange}>
        <Tab sx={{width:"50%"}} label="Login" value={0} />
        <Tab label="Sign Up" value={1}/>
      </Tabs>
      <div className="login">
        {value === 0 && <Login/>}
        {value === 1 && <Signup/>}
      </div>
    </div>
      </Card>
    </Container>
  );
};

export default Home;
