import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Drawer,
  MenuItem,
  MenuList,
  Popover,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "../App.css";
import { ChatState } from "../Context/ChatProvider";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { API } from "../global.js";
import UserListItem from "./UserListItem";
import { getSender } from "../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [anchor, setAnchor] = useState("close");
  const nav = useNavigate();
  //const [showNotifications, setShowNotifications] = useState(false); 
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    nav("/");
  };

  const toggleDrawer = (value) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setAnchor(value);
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please Enter something in search", {
        autoClose: 2000,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios
        .get(`${API}/api/user/allUsers?search=${search}`, config)
        .then((res) => {
          console.log(res);
          setLoading(false);
          setSearchResult(res.data);
          console.log(`Search res: ${JSON.stringify(searchResult)}`);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to load search results", {
            autoClose: 2000,
            position: "top-left",
          });
        });
    } catch (err) {
      console.log(err);
      toast.error("Failed to load search results", {
        autoClose: 2000,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios
        .post(`${API}/api/chat/createChat`, { userId }, config)
        .then((res) => {
          if (!chats.find((c) => c._id === res.data._id)) {
            setChats([res.data, ...chats]);
            console.log(`setChats(res.data) is ${JSON.stringify(res.data)}`);
          }
          setSelectedChat(res.data);
          setLoading(false);
          toggleDrawer("close");
        });
    } catch (err) {
      toast.error(`Error fetching chats ${err}`, {
        autoClose: 2000,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#42C152",
          width: "100%",
          padding: "5px 10px 5px 10px",
          borderWidth: "5px",
          color: "white",
        }}
      >
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          style={{ backgroundColor: "white", color: "black" }}
          onClick={(event) => {
            event.stopPropagation();
            toggleDrawer("open")(event);
          }}
        >
          Search User
        </Button>

        <h2>Let's Chat</h2>
        <MenuList sx={{ display: "flex" }}>
          <Tooltip title="notifications">
            <MenuItem onClick={handleNotificationClick}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <NotificationsIcon />
                <Badge
                  badgeContent={notification.length}            
                  color="error"
                />
              </Box>
            </MenuItem>
          </Tooltip>

          {/* <MenuItem><Avatar src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jp" alt={user.name}/></MenuItem> */}
          <ProfileModal user={user} />
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </MenuList>
        {/* Notification Menu */}
        <Popover
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuList>
          {!notification.length ? (
            <MenuItem>No new notifications</MenuItem>
          ) : (
            notification.map((notify) => (
              <MenuItem
                key={notify._id}
                onClick={() => {
                  setSelectedChat(notify.chat);
                  setNotification(notification.filter((n) => n !== notify));
                }}
              >
                {notify.chat.isGroupChat
                  ? `Message from ${notify.chat.chatName}`
                  : `Message from ${getSender(user, notify.chat.users)}`}
              </MenuItem>
            ))
          )}
        </MenuList>
      </Popover>
      </Box>

      <Drawer
        anchor="left"
        open={anchor === "open"}
        onClose={toggleDrawer("close")}
        sx={{ padding: "50px" }}
      >
        <Box
          sx={{
            display: "flex",
            padding: "20px",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Search user"
            variant="outlined"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleSearch}
            style={{
              backgroundColor: "#42C152",
              color: "white",
              margin: "5px",
            }}
          >
            Go
          </Button>
        </Box>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          searchResult.map((user) => {
            return (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            );
          })
        )}
        {loadingChat && <CircularProgress size={24} />}
      </Drawer>
    </>
  );
};

export default SideDrawer;
