"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Container } from "@mui/material";
import { Grid } from "@mui/material";
import { useTrackContext } from "@/lib/context/track.contect";
import Link from "next/link";

const ProfileApp = (props: any) => {
  const { dataUser } = props;
  const theme = useTheme();
  const { currentTrack, setCurrentTrack } = useTrackContext() as ContextTrack;

  return (
    <Container
      sx={{
        my: 5,
      }}
    >
      <Grid container spacing={5}>
        {dataUser.map((item: any, index: number) => {
          return (
            <Grid item xs={6} md={6} key={index}>
              <Card sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                   <Link href={`/track/${item._id}?audio=${item.trackUrl}&id=${item._id}`}>
                   <Typography component="div" variant="h5">
                      {item.title}
                    </Typography>
                   </Link>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pl: 1,
                      pb: 1,
                    }}
                  >
                    <IconButton aria-label="previous">
                      {theme.direction === "rtl" ? (
                        <SkipNextIcon />
                      ) : (
                        <SkipPreviousIcon />
                      )}
                    </IconButton>
                    {(item._id !== currentTrack._id ||
                      (item._id === currentTrack._id &&
                        currentTrack.isPlaying === false)) && (
                      <IconButton
                        onClick={() => {
                          setCurrentTrack({ ...item, isPlaying: true });
                        }}
                        aria-label="play/pause"
                      >
                        <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                      </IconButton>
                    )}
                    {item._id === currentTrack._id &&
                      currentTrack.isPlaying === true && (
                        <IconButton  onClick={() => {
                          setCurrentTrack({ ...item, isPlaying: false });
                        }}>
                          <PauseIcon sx={{ height: 38, width: 38 }} />
                        </IconButton>
                      )}

                    <IconButton aria-label="next">
                      {theme.direction === "rtl" ? (
                        <SkipPreviousIcon />
                      ) : (
                        <SkipNextIcon />
                      )}
                    </IconButton>
                  </Box>
                </Box>
                <CardMedia
                  component="img"
                  sx={{ width: 151 }}
                  image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                  alt="Live from space album cover"
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};
export default ProfileApp;
