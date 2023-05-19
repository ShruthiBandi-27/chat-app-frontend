import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, FormControl, FormGroup, IconButton, Input, InputAdornment, InputLabel, TextField } from "@mui/material";
import React, { useState } from "react";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [profile, setProfile] = useState();
  const [showPassword, setShowPassword] = useState(false);

  
  const changeVisiblity = () => {
    setShowPassword(!showPassword);
  };

  const displayProfiles = (pics) => {
    console.log("profiles");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform form submission logic
    console.log("Submitted:", name, email);
  };
  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl sx={{ mb: 2 }}>
            <TextField
              id="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
          </FormControl>
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
          <FormControl sx={{ mb: 2 }}>
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          <FormControl sx={{ mb: 2 }}>
          <InputLabel htmlFor="profile">Profile</InputLabel>
            <Input
              id="profile"
              type="file"
              value={profile}
              onChange={(e) => displayProfiles(e.target.value)}
              inputProps={{accept: 'image/*'}}
              fullWidth
              required
            />
          </FormControl>
        </FormGroup>

        <Button
        type="submit" 
        variant="contained"
         color="primary" 
         onClick={handleSubmit}
         sx={{width: "100%"}}
         >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Signup;
