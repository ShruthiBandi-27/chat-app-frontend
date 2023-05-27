import React, { useState } from 'react'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Button, FormControl, FormGroup, IconButton, Input, InputAdornment, InputLabel, TextField } from "@mui/material";
import axios from 'axios';
import {API} from '../global.js';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
  
    
    const changeVisiblity = () => {
      setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
      setLoading(true);
      if(!email || !password){
        toast.error("Please fill all the fields");
        setLoading(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
      }
  await axios.post(`${API}/api/user/login`,
  {email, password},
  {headers}
  )
  .then(res => {
    toast.success("Login successful", {
      autoClose: 2000,
    });
    nav("/chats");
    console.log(res.data)
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    setLoading(false);
  })
  .catch(err => {
    console.log(err);
    toast.error(`Error: ${err}`);
    setLoading(false);
  })
    };
    return (
        <div className="form">
        <ToastContainer />
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormControl sx={{ mb: 2 }}>
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
              </FormControl>
              <FormControl sx={{ mb: 2 }}>
                <TextField
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={changeVisiblity}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </FormGroup>
    
            <Button
            type="submit" 
            variant="contained"
             color="primary" 
             onClick={handleSubmit}
             sx={{width: "100%",mb: 2}}
             disabled={loading}
             >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Button
            variant="contained"
             color="error" 
             onClick={ () => {
                setEmail("guest@example.com");
                setPassword("1234");
             }}
             sx={{width: "100%"}}
             >
              Get guest User Credentials
            </Button>
          </form>
        </div>
      );
}

export default Login