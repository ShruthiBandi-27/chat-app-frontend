import { Box, Button, CircularProgress, FormControl, IconButton, Modal, TextField } from "@mui/material";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { ChatState } from "../Context/ChatProvider";
import { ToastContainer, toast } from "react-toastify";
import UserBadgeItem from "./UserBadgeItem";
import axios from 'axios';
import {API} from '../global.js';
import UserListItem from "./UserListItem";

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

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupChatName, setgroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const handleRemoveUser = async (user1) => {
    console.log("remove user from group");
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
        toast.warning("Only admins can remove someone!", {
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
          await axios.put(`${API}/api/chat/removeFromGroup`,{
            chatId: selectedChat._id,
            userId: user1._id,
          }, config)
          .then((res) => {
            user1._id === user._id ? setSelectedChat(): setSelectedChat(res.data);
            setFetchAgain(!fetchAgain);
            fetchMessages()
            setLoading(false);
          })
    }
    catch (error) {
        toast.error(`Error Occured! : ${error}`, {
            autoClose: 2000,
            position: "top-left",
          });
        setLoading(false);
    }
  };

  const handleRename = async () => {
    console.log("handle rename group");
    if(!groupChatName) return

    try {
        setRenameLoading(true);

        const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(`${API}/api/chat/renameGroup`,{
        chatId: selectedChat._id,
        newChatName: groupChatName,
      }, config)
      .then((res) => {
        setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
        toast.success("Group name updated", {
            autoClose: 2000,
            position: "top-left",
          });
          handleClose();
      })

    }
    catch(error) {
        toast.error(`Error Occured! : ${error}`, {
                    autoClose: 2000,
                    position: "top-left",
                  });
        setRenameLoading(false);
    }
    setgroupChatName("");

  }

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
  }

  const handleAddUser = async (user1) => {
    console.log("handleAddUser");
    if(selectedChat.users.find((u) => u._id === user1._id) ){
        toast.error("User already in group!", {
            autoClose: 2000,
            position: "top-left",
          });
        return;
    }
    if (selectedChat.groupAdmin._id !== user._id ){
        toast.warning("Only admins can remove someone!", {
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
          await axios.put(`${API}/api/chat/addToGroup`,{
            chatId: selectedChat._id,
            userId: user1._id,
          }, config)
          .then((res) => {
            setSelectedChat(res.data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
          })
    }
    catch (error) {
        toast.error(`Error Occured! : ${error}`, {
            autoClose: 2000,
            position: "top-left",
          });
        setLoading(false);
    }

  }

  return (
    <>
      <ToastContainer />
      <IconButton onClick={handleOpen} sx={{ color: "white" }}>
        {<Visibility />}
      </IconButton>
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
          <h2 id="parent-modal-title">{selectedChat.chatName}</h2>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              margin: "10px",
            }}
          >
            {selectedChat.users.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={() => handleRemoveUser(user)}
              />
            ))}
          </Box>
          <FormControl sx={{ mb: 2, mt: 3}}>
          <div
          style ={{
            display: "flex" ,
            gap: "8px",
          }}>
            <TextField
              id="groupChatName"
              label="groupChatName"
              placeholder="Group Chat Name"
              value={groupChatName}
              onChange={(e) => setgroupChatName(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleRename}
              color="success"
              disabled={loading}
            >
             {renameLoading ? <CircularProgress size={24} /> : 'Update'}
            </Button>
            </div>
          </FormControl>
          
          <FormControl sx={{ mb: 2 }}>
          <div
           style ={{
            display: "flex" ,
            gap: "8px",
          }}
          >
              <TextField
                id="chatUsers"
                label="Add Group Users"
                placeholder="search Users"
                onChange={(e) => handleSearch(e.target.value)}
                fullWidth
              />
              </div>
        </FormControl>
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
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
         
          <Button
            variant="contained"
            onClick={() => handleRemoveUser(user)}
            color="error"
            style={{ alignSelf: "flex-end" }}
          >
            Leave Group
          </Button>
          {/* <p>{user && user.email ? user.email: ""}</p> */}
        </Box>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
