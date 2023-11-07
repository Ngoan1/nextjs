"use client";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { AvatarUser, sendRequest } from "@/utils/api";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import WaveSurfer from "wavesurfer.js";
import Image from "next/image";
interface IProps {
  data: ITrackTop | null;
  comments: ITrackComment[] | null;
  wavesurfer: WaveSurfer | null;
}
const CommentTrack = (props: IProps) => {
  const { data, comments, wavesurfer } = props;
  const { data: session } = useSession();
  const router = useRouter();
  const [yourComment, setYourComment] = useState("");
  dayjs.extend(relativeTime);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };
  const handleSubmit = async () => {
    const res = await sendRequest<IBackendRes<ITrackComment>>({
      url: "http://localhost:8000/api/v1/comments",
      method: "POST",
      body: {
        content: yourComment,
        moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        track: data?._id,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res?.data) {
      setYourComment("");
      router.refresh();
    }
  };
  const handleJumpTrack = (moment: number) => {
    if (wavesurfer) {
      const duration = wavesurfer?.getDuration();
      wavesurfer.seekTo(moment / duration);
      wavesurfer.play();
    }
  };

  return (
    <div
      style={{
        marginTop: 30,
      }}
    >
      {session?.user && (
        <TextField
          value={yourComment}
          onChange={(e) => {
            setYourComment(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          variant="standard"
          fullWidth
          label="Comment"
          margin="dense"
        />
      )}
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          className="left"
          sx={{
            width: "20%",
          }}
        >
          <Image width={150}
          height={150}
          src={AvatarUser(data?.uploader?.type!)} alt="" />
          <Typography>{data?.uploader?.email}</Typography>
        </Box>
        <Box
          className="right"
          sx={{
            width: "80%",
          }}
        >
          {comments?.map((item) => {
            return (
              <Box
                key={item._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Box>
                    <img
                      src={AvatarUser(item?.user?.type)}
                      style={{
                        width: 35,
                        height: 35,
                        cursor: "pointer",
                      }}
                      alt=""
                    />
                  </Box>
                  <Box
                    sx={{
                      ml: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleJumpTrack(item?.moment);
                      }}
                    >
                      {item?.user?.email ?? "No Name"} at{" "}
                      {formatTime(item?.moment)}
                    </Typography>
                    <Typography>{item?.content}</Typography>
                  </Box>
                </Box>
                <Box>{dayjs(item.createdAt).fromNow()}</Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </div>
  );
};
export default CommentTrack;
