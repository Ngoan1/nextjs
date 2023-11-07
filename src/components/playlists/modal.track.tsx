"use client";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface IProps {
  playlist: IPlaylist[] | null;
  tracks: ITrackTop[] | null;
}
const ModalTrack = (props: IProps) => {
  const { playlist, tracks } = props;
  const { data: session } = useSession();
  const [listTrack, setListTrack] = React.useState<string[]>([]);
  const [track, setTrack] = React.useState<IPlaylist | null>(null);
  const toast = useToast();
  const [openAddTrack, setOpenAddTrack] = React.useState(false);

  const handleClickOpenAddTrack = () => {
    setOpenAddTrack(true);
  };

  const handleCloseAddTrack = () => {
    setOpenAddTrack(false);
    setListTrack([])
    setTrack(null)
  };
  const handleChangeTrack = (event: any) => {
    setTrack(event.target.value);
  };
  const theme = useTheme();
  const router =useRouter()

  const handleChangeValueTrack = (
    event: SelectChangeEvent<typeof listTrack>
  ) => {
    const {
      target: { value },
    } = event;
    setListTrack(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
 
  const handleSubmit = async () => {
    // console.log("check track", listTrack);
    const finalListCheck=listTrack.map(item=>item.split('###')?.[0])
    // console.log('check ket qua cuoi cung',finalListCheck)

    const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
      method: "PATCH",
      body: {
        title: track?.title,
        tracks: finalListCheck,
        isPublic: track?.isPublic,
        id: track?._id,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res?.data) {
      await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
        url:`/api/revalidate`,
        method:'POST',
        body:{
          secret:'justArandomString',
          tag:'play-list-by-user'
        }
      })
      router.refresh();

      toast.success(res?.message);
      handleCloseAddTrack()
    } else {
      toast.error(res?.message);
    }
  };
  return (
    <>
      <Button variant="outlined" onClick={handleClickOpenAddTrack}>
        Tracks
      </Button>
      <Dialog open={openAddTrack} fullWidth>
        <DialogTitle>Thêm Track cho Playlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
              <InputLabel>Chọn Playlist</InputLabel>
              <Select value={track} onChange={handleChangeTrack}>
                {playlist?.map((item) => {
                  return (
                    //@ts-ignore
                    <MenuItem key={item._id} value={item}>
                      {item.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1 }} fullWidth>
              <InputLabel id="demo-multiple-chip-label">Track</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={listTrack}
                onChange={handleChangeValueTrack}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value.split('###')?.[1]} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {tracks?.map((item) => (
                  <MenuItem
                    key={item._id}
                    value={`${item._id}###${item.title}`}
                    style={getStyles(item.title, listTrack, theme)}
                  >
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTrack}>Cancel</Button>
          <Button onClick={() => handleSubmit()}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ModalTrack;
