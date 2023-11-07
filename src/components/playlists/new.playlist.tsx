"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ModalPlayList from "./modal.playlist";
import ModalTrack from "./modal.track";
interface IProps {
  playlist: IPlaylist[] | null;
  tracks: ITrackTop[] | null;
}
const NewPlayList = (props: IProps) => {
  const { playlist, tracks } = props;

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 5,
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Danh sách phát
          </Typography>
        </Box>
        <Box sx={{ gap: 2, display: "flex" }}>
          <ModalPlayList/>
          <ModalTrack tracks={tracks} playlist={playlist} />
        </Box>
      </Box>
    </Container>
  );
};
export default NewPlayList;
