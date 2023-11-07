"use client";
import { useWavesurfer } from "@/utils/customHook";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useCallback, useState, useEffect } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Tooltip from "@mui/material/Tooltip";
import { useTrackContext } from "@/lib/context/track.contect";
import { AvatarUser, sendRequest } from "@/utils/api";
import CommentTrack from "./comment.track";
import LikeTrack from "./like.track";
import Image from "next/image";
interface IProps {
  data: ITrackTop | null;
  comments:ITrackComment[] | null
}
const WaveTrack = (props: IProps) => {
  const { data,comments } = props;
  const { currentTrack, setCurrentTrack } = useTrackContext() as ContextTrack;
  const containerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  const fileName = searchParams.get("audio");
 
  const calcLeft = (moment: number) => {
    const hardCode = wavesurfer?.getDuration()??0;
    const percent = (moment / hardCode) * 100;
    return `${percent}%`;
  };

  // const options={
  //   waveColor: "rgb(200, 0, 200)",
  //         progressColor: "rgb(100, 0, 100)",
  //         url: `/api?audio=${fileName}`,
  // }
  const optionMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
    // Define the waveform gradient
    let gradient, progressGradient;
    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      // Define the waveform gradient
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      gradient.addColorStop(0, "#656666"); // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
      gradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#B1B1B1"
      ); // Bottom color
      gradient.addColorStop(1, "#B1B1B1"); // Bottom color

      // Define the progress gradient
      progressGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height * 1.35
      );
      progressGradient.addColorStop(0, "#EE772F"); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7) / canvas.height,
        "#EB4926"
      ); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#F6B094"
      ); // Bottom color
      progressGradient.addColorStop(1, "#F6B094"); // Bottom color
    }

    return {
      // waveColor: "rgb(200, 0, 200)",
      // progressColor: "rgb(100, 0, 100)",
      waveColor: gradient,
      progressColor: progressGradient,
      url: `/api?audio=${fileName}`,
      barWidth: 3,
      height: 100,
    };
  }, []);
  // Initialize wavesurfer when the container mounts
  // or any of the props change

  const wavesurfer = useWavesurfer(containerRef, optionMemo);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter()
  const viewRef=useRef(true)
  const HandleView=async()=>{
    if(viewRef.current===true){
      await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url:'http://localhost:8000/api/v1/tracks/increase-view',
        method:'POST',
        body:{
          trackId:data?._id
        }
      })
      await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url:'http://localhost:3000/api/revalidate',
        method:'POST',
        queryParams:{
          secret:'justArandomString',
          tag:'track-by-id'
        }
      })
      router.refresh()
      viewRef.current=false

      
    }

  }
  useEffect(() => {
    if (!wavesurfer) return;

    setIsPlaying(false);
    const timeEl = timeRef.current!;
    const durationEl = durationRef.current!;
    {
      const hover = hoverRef.current!;
      const waveform = containerRef.current!;
      //@ts-ignore
      waveform.addEventListener(
        "pointermove",
        (e) => (hover.style.width = `${e.offsetX}px`)
      );
    }

    const subscriptions = [
      wavesurfer.on("play", () => setIsPlaying(true)),
      wavesurfer.on("pause", () => setIsPlaying(false)),
      wavesurfer.on(
        "decode",
        (duration) => (durationEl.textContent = formatTime(duration))
      ),
      wavesurfer.on(
        "timeupdate",
        (currentTime) => (timeEl.textContent = formatTime(currentTime))
      ),
      wavesurfer.once("interaction", () => {
        wavesurfer.play();
      }),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  const onPlayClick = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
    }
  }, [wavesurfer]);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  // console.log('check abc',fileName)
  // useEffect(() => {
  //   if (containerRef.current) {
  //     WaveSurfer.create({
  //       container: containerRef.current,
  //       waveColor: "rgb(200, 0, 200)",
  //       progressColor: "rgb(100, 0, 100)",
  //       url: `/api?audio=${fileName}`,
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (wavesurfer && currentTrack.isPlaying) {
      wavesurfer.pause();
    }
  }, [currentTrack]);
  useEffect(() => {
    if (data?._id && !currentTrack._id) {
      setCurrentTrack({ ...data, isPlaying: false });
    }
  }, [data]);
  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          gap: 15,
          padding: 20,
          height: 400,
          background:
            "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)",
        }}
      >
        <div
          className="left"
          style={{
            width: "75%",
            height: "calc(100% - 10px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div className="info" style={{ display: "flex" }}>
            <div>
              <div
                onClick={() => {
                  HandleView()
                  onPlayClick();
                  if (data && wavesurfer)
                    setCurrentTrack({ ...currentTrack, isPlaying: false });
                }}
                style={{
                  borderRadius: "50%",
                  background: "#f50",
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {isPlaying === true ? (
                  <PauseIcon sx={{ fontSize: 30, color: "white" }} />
                ) : (
                  <PlayArrowIcon sx={{ fontSize: 30, color: "white" }} />
                )}
              </div>
            </div>
            <div style={{ marginLeft: 20 }}>
              <div
                style={{
                  padding: "0 5px",
                  background: "#333",
                  fontSize: 30,
                  width: "fit-content",
                  color: "white",
                }}
              >
                {data?.description}
              </div>
              <div
                style={{
                  padding: "0 5px",
                  marginTop: 10,
                  background: "#333",
                  fontSize: 20,
                  width: "fit-content",
                  color: "white",
                }}
              >
                {data?.title}
              </div>
            </div>
          </div>
          <div ref={containerRef} className="wave-form-container">
            <div ref={timeRef} className="time"></div>
            <div ref={durationRef} className="duration"></div>
            <div ref={hoverRef} className="hover-wave"></div>
            <div
              className="overlay"
              style={{
                position: "absolute",
                height: "30px",
                width: "100%",
                bottom: "0",
                // background: "#ccc"
                backdropFilter: "brightness(0.5)",
              }}
            ></div>
            <div
              className="comment"
              style={{
                position: "relative",
              }}
            >
              {comments?.map((item) => {
                return (
                  <Tooltip title={item.content} arrow key={item._id}>
                    <Image
                      onPointerMove={(e) => {
                        const hover = hoverRef.current!;
                        hover.style.width = calcLeft(item.moment);
                      }}
                      src={AvatarUser(item?.user?.type)}
                      alt=""
                      width={20}
                      height={20}
                      style={{
                        
                        position: "absolute",
                        top: 71,
                        zIndex: 100,

                        left: calcLeft(item.moment),
                      }}
                    />
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className="right"
          style={{
            width: "25%",
            padding: 15,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#ccc",
              width: 250,
              height: 250,
            }}
          >
            <Image
              width={250}
              height={250}
              style={{
                width: '100%',
              }}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${data?.imgUrl}`}
              alt=""
            />
          </div>
        </div>
      </div>
      <LikeTrack data={data}/>
        <CommentTrack 
        comments={comments}
        data={data}
        wavesurfer={wavesurfer}
        ></CommentTrack>
    </div>
  );
};
export default WaveTrack;
