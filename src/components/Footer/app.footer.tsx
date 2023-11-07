"use client";
import { useTrackContext } from "@/lib/context/track.contect";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import { useEffect, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AppFooter = () => {
  const hasMounted = useHasMounted();
  const playRef = useRef(null);
  const { currentTrack, setCurrentTrack } = useTrackContext() as ContextTrack;

  useEffect(() => {
    if (currentTrack?.isPlaying) {
      //@ts-ignore
      playRef?.current?.audio?.current?.play();
    } else {
      //@ts-ignore
      playRef?.current?.audio?.current?.pause();
    }
  }, [currentTrack]);
  if (!hasMounted) return <></>;

  return (
    <div style={{ marginTop: 50 }}>
      {currentTrack?.trackUrl?<AppBar
        position="fixed"
        sx={{
          top: "auto",
          bottom: 0,
          background: "#f2f2f2",
        }}
      >
        <Container
          sx={{
            display: "flex",
            gap: 10,
            ".rhap_main": {
              gap: "30px",
            },
          }}
        >
          <AudioPlayer
            onPause={() => {
              setCurrentTrack({ ...currentTrack, isPlaying: false });
            }}
            onPlay={() => {
              setCurrentTrack({ ...currentTrack, isPlaying: true });
            }}
            ref={playRef}
            autoPlay
            layout="horizontal-reverse"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
            volume={0}
            style={{ background: "#f2f2f2", boxShadow: "unset" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              minWidth: 100,
              justifyContent: "center",
            }}
          >
            <div style={{ color: "#ccc" }}>{currentTrack.title}</div>
            <div style={{ color: "black" }}>{currentTrack.description}</div>
          </div>
        </Container>
      </AppBar>:<></>}
    </div>
  );
};
export default AppFooter;
