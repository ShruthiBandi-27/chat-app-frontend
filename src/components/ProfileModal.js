import { Avatar, Box, Button, MenuItem, Modal } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };

const ProfileModal = ({user}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    console.log(`user: ${JSON.stringify(user)}`);

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <MenuItem onClick={handleOpen}>
      {user && user.name ? (
          <Avatar src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jp" alt={user.name} />
        ) : (
          <Avatar />
        )}
      </MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400, borderRadius: "5px" }}>
        <Button
            onClick={handleClose}
            style={{ alignSelf: "flex-end" }}
          >
           <CloseIcon />
          </Button>
          <h2 id="parent-modal-title">{user && user.name ? user.name: ""}</h2> 
          <p id="parent-modal-description">
          {user && user.profile ?  (
          <Avatar src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jp" alt={user.name} />
        ) : (
          <Avatar />
        )}
          </p>
          <p>{user && user.email ? user.email: ""}</p>
          {/* <Button onClick={handleClose}>Close</Button> */}
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileModal;
