import {
  LocalDiningRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormGroup,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { API } from "../global.js";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [profile, setProfile] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const nav = useNavigate();

  const changeVisiblity = () => {
    setShowPassword(!showPassword);
  };

  const displayProfiles = (pics) => {
    // console.log("profiles");
    // setLoading(true);
    // if(pics === undefined){
    //   toast.error("Please select an Image");
    //   setLoading(false);
    // return;
    // }
    // if(pics.type ==="image/jpeg" || pics.type === "image/png"){
    //   const data = new FormData();
    //   data.append("file", pics);
    //   data.append("upload_preset", "chat-app");
    //   data.append("cloud_name", "roadsidecoder");
    //   fetch("https://api.cloudinary.com/v1_1/du486m83l", {
    //     method: 'post',
    //     body: data,
    //   })
    //   .then(res => res.json())
    //   .then(data => {
    //     setProfile(data.url.toString());
    //     console.log(data.url.toString());
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setLoading(false);
    //   })
    // }
    // else {
    //   toast.error("Please select an Image of type jpg/png");
    //   setLoading(false);
    //   return;
    // }
  };

  const handleSubmit = async (event) => {
    //event.preventDefault();
    // Perform form submission logic
    console.log("Submitted:", name, email);
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords doesn't match");
      setLoading(false);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
    };
    await axios
      .post(
        `${API}/api/user/signup`,
        { name, email, password, profile },
        { headers }
      )
      .then((res) => {
        toast.success("Singup successful, Please login!", {
          autoClose: 2000,
        });
        console.log(res.data);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        nav("/");
        setLoading(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setProfile("");
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Error: ${err}`);
        setLoading(false);
      });
  };
  return (
    <div className="form">
      <ToastContainer />
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
          <div>
            {profileVisible && (
              <>
                <FormControl>
                  <InputLabel htmlFor="profile">Profile</InputLabel>
                </FormControl>
                <FormControl sx={{ mt: 6, mb: 2 }}>
                  {/* <InputLabel htmlFor="profile">Profile</InputLabel> */}
                  <TextField
                    id="profile"
                    type="file"
                    value={profile}
                    onChange={(e) => displayProfiles(e.target.files[0])}
                    inputProps={{ accept: "image/*" }}
                    fullWidth
                    sx={{ display: "none" }}
                  />
                </FormControl>
              </>
            )}
          </div>
        </FormGroup>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ width: "100%" }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign up"}
        </Button>
      </form>
    </div>
  );
};

export default Signup;
