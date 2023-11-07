"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const ModalPlayList = () => {
  const {data:session}=useSession()
  const [checked, setChecked] = React.useState(true);
  const toast=useToast()
  const router=useRouter()
  const [openAddPlayList, setOpenAddPlayList] = React.useState(false);
  const handleClickOpenAddPlayList = () => {
    setOpenAddPlayList(true);
  };

  const handleCloseAddPlayList = () => {
    setOpenAddPlayList(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const [namePlayList, setNamePlayList] = React.useState<string>("");
  const handleSubmit = async () => {
    const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
      url: `http://localhost:8000/api/v1/playlists/empty`,
      method: "POST",
      body: {
        title: namePlayList,
        isPublic: checked,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if(res?.data){
      toast.success(res?.message)
      setNamePlayList('')
      handleCloseAddPlayList()
      await sendRequest({
        url:`/api/revalidate`,
        method:'POST',
        queryParams:{
          secret:'justArandomString',
          tag:'play-list-by-user'
        }
      })
      router.refresh();
    

    }
  };
  return (
  <>
    <Button variant="outlined" onClick={handleClickOpenAddPlayList}>
            Play List
          </Button>
    <Dialog open={openAddPlayList} fullWidth>
      <DialogTitle>Thêm Playlist</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Tiêu đề"
            type="email"
            fullWidth
            variant="standard"
            value={namePlayList}
            onChange={(event) => {
              setNamePlayList(event.target.value);
            }}
          />
        </DialogContentText>
      </DialogContent>
      <Box sx={{ display: "flex" }}>
        <Switch
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
        {checked ? "public" : "none"}
      </Box>
      <DialogActions>
        <Button onClick={() => {
          setNamePlayList('')
          handleCloseAddPlayList()}}>Cancel</Button>
        <Button
          onClick={() => {
            handleSubmit();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  </>
  );
};
export default ModalPlayList;
