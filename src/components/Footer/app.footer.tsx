"use client";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AppFooter = () => {
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <AppBar
      position="fixed"
      sx={{
        top: "auto",
        bottom: 0,
        background: "#f2f2f2",
      }}
    >
      <Container sx={{ display: "flex", gap: 10 }}>
        <AudioPlayer
          autoPlay
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
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
          <div style={{ color: "#ccc" }}>Em Pond</div>
          <div style={{ color: "black" }}>Chưa 51 sao</div>
        </div>
      </Container>
    </AppBar>
  );
};
export default AppFooter;
