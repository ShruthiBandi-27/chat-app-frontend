import React, { useState } from 'react'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, FormControl, FormGroup, IconButton, Input, InputAdornment, InputLabel, TextField } from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
  
    
    const changeVisiblity = () => {
      setShowPassword(!showPassword);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      // Perform form submission logic
    };
    return (
        <div className="form">
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
             >
              Login
            </Button>
            <Button
            type="submit" 
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