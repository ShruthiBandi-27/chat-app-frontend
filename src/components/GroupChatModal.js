import {
  Avatar,
  Box,
  Button,
  FormControl,
  Modal,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { API } from "../global.js";
import UserListItem from "./UserListItem";
import { CircularProgress } from "@mui/material";
import UserBadgeItem from "./UserBadgeItem";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  //   pt: 2,
  //   px: 4,
  //   pb: 3,
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const GroupChatModal = ({ children }) => {
  const { user, chats, setChats } = ChatState();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupChatName, setgroupChatName] = useState();
  const [chatUsers, setChatUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log(
      `chat users submitted groupChatName: ${groupChatName}, chatUsers: ${chatUsers}`
    );
    if (!groupChatName || !chatUsers) {
      toast.warning("Please fill all the details", {
        autoClose: 2000,
        position: "top-left",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
        .post(
          `${API}/api/chat/createGroupChat`,
          {
            name: groupChatName,
            users: JSON.stringify(chatUsers.map((user) => user._id)),
          },
          config
        )
        .then((res) => {
          console.log(`newly added chat: ${res.data}`);
          setChats([res.data, ...chats]);
          toast.success("New Group chat created", {
            autoClose: 2000,
            position: "top-left",
          });
          handleClose();
        });
    } catch (err) {
      toast.error("Failed to create group chat", {
        autoClose: 2000,
        position: "top-left",
      });
    }
  };

  const handleSearch = async (query) => {
    console.log("handle chat users search");
    setSearch(query);
    if (!query) {
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
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
      console.log(err);
      toast.error("Failed to load search results", {
        autoClose: 2000,
        position: "top-left",
      });
      setLoading(false);
    }
  };

  const handleGroup = (userToAdd) => {
    console.log(`handle group userToAdd: ${userToAdd}`);
    if (chatUsers.includes(userToAdd)) {
      toast.warning("User already added!", {
        autoClose: 2000,
        position: "top-left",
      });
      return;
    }
    setChatUsers([...chatUsers, userToAdd]);
    //console.log(`chatUsers: ${chatUsers}`);
  };

  const handleDelete = (delUser) => {
    console.log("handle delete");
    setChatUsers(chatUsers.filter((selUser) => selUser._id !== delUser._id));
  };

  return (
    <>
      <ToastContainer />
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400, borderRadius: "5px" }}>
          <Button onClick={handleClose} style={{ alignSelf: "flex-end" }}>
            <CloseIcon />
          </Button>
          <h2 id="parent-modal-title">Create Group Chat</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <FormControl sx={{ mb: 2, mt: 3 }}>
              <TextField
                id="groupChatName"
                label="groupChatName"
                placeholder="Group Chat Name"
                onChange={(e) => setgroupChatName(e.target.value)}
                fullWidth
                required
              />
            </FormControl>
            <FormControl sx={{ mb: 2 }}>
              <TextField
                id="chatUsers"
                label="Add Group Users"
                placeholder="search Users"
                onChange={(e) => handleSearch(e.target.value)}
                fullWidth
              />
            </FormControl>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                marginBottom: "10px",
              }}
            >
              {chatUsers?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </div>
            {loading ? (
              <div>
                <CircularProgress size={24} />{" "}
              </div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </div>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ alignSelf: "flex-end" }}
          >
            Create chat
          </Button>
          {/* <p>{user && user.email ? user.email: ""}</p> */}
        </Box>
      </Modal>
    </>
  );
};

export default GroupChatModal;
