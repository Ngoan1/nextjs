"use client";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DeleteIcon from "@mui/icons-material/Delete";
import { SlugURL, sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";
import { useSession } from "next-auth/react";
import { useTrackContext } from "@/lib/context/track.contect";
import Link from "next/link";
import Box from '@mui/material/Box'

interface IProps {
  playlist: IPlaylist[] | null;
  tracks: ITrackTop[] | null;
}
export default function ListPlayList(props: IProps) {
  const { playlist, tracks } = props;
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();
  const { currentTrack, setCurrentTrack } = useTrackContext() as ContextTrack;
  const handleDelete = async (id: string) => {
    const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res?.data) {
      await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          secret: "justArandomString",
          tag: "play-list-by-user",
        },
      });
      router.refresh();
      toast.success(res?.message);
    }
  };
  React.useEffect(() => {
    console.log(currentTrack, "check current");
  }, [currentTrack]);
  return (
    <>
      {playlist?.map((item) => {
        return (
          <Box sx={{display:'flex'}}>
            <Box sx={{width:'95%'}}>
            <Accordion sx={{ my: 2 }} key={item._id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
              >
                <Typography variant="h6" color={"#ccc"}>
                  {item.title}
                </Typography>
              </AccordionSummary>

              <Divider />

              {item?.tracks.length > 0 ? (
                <>
                  {item?.tracks?.map((item) => {
                    return (
                      <>
                        <AccordionDetails
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {tracks?.map((track) => {
                            return (
                              <>
                                {track._id === item ? (
                                  <Link
                                    href={`/track/${SlugURL(track.title)}-${
                                      track._id
                                    }.html?audio=${track.trackUrl}`}
                                  >
                                    {track.title}
                                  </Link>
                                ) : (
                                  ""
                                )}
                              </>
                            );
                          })}

                          {(item !== currentTrack._id ||
                            (item === currentTrack._id &&
                              currentTrack.isPlaying === false)) && (
                            <IconButton
                              onClick={() => {
                                const result = tracks?.find((track) => {
                                  //@ts-ignore
                                  return track._id === item;
                                });
                                //@ts-ignore
                                setCurrentTrack({ ...result, isPlaying: true });
                              }}
                            >
                              <PlayArrowIcon sx={{ height: 20, width: 20 }} />
                            </IconButton>
                          )}
                          {item === currentTrack._id &&
                            currentTrack.isPlaying === true && (
                              <IconButton
                                onClick={() => {
                                  setCurrentTrack({
                                    ...currentTrack,
                                    isPlaying: false,
                                  });
                                }}
                              >
                                <PauseIcon sx={{ height: 20, width: 20 }} />
                              </IconButton>
                            )}
                        </AccordionDetails>
                        <Divider />
                      </>
                    );
                  })}
                </>
              ) : (
                <Typography variant="h6">No data</Typography>
              )}

              <Divider />
            </Accordion>
            </Box>
            <Box sx={{width:'5%'}}>
            <IconButton onClick={() => handleDelete(item._id)}>
              <DeleteIcon sx={{width:35,height:35,mt:2}}  />
            </IconButton>
            </Box>
          </Box>
        );
      })}
    </>
  );
}
