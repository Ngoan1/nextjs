"use client";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import Stack from '@mui/material/Stack';
// import action from "@/app/action";

interface IProps {
  data: ITrackTop | null;
}
const LikeTrack = (props: IProps) => {
  const { data } = props;
  const { data: session } = useSession();
  const [listLike, setlistLike] = useState<ITrackLike[] | null>(null);
  const router=useRouter()
  const fetch = async () => {
    if (session?.access_token) {
      const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: "http://localhost:8000/api/v1/likes",
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        queryParams: {
          current: 1,
          pageSize: 100,
        },
      });
      if (res && res?.data?.result) {
        setlistLike(res?.data?.result);
      }
      
    }
  };
  const handleLike=async()=>{
    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
      url:'http://localhost:8000/api/v1/likes',
      method:'POST',
      body:{
        track:data?._id,
        quantity:listLike?.some(item=>item?._id===data?._id)?-1:1
      },
      headers:{
        Authorization:`Bearer ${session?.access_token}`
      }
    })
    // action()
    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
      url:'http://localhost:3000/api/revalidate',
      method:'POST',
      queryParams:{
        secret:'justArandomString',
        tag:'track-by-id'
      }
    })
    
    router.refresh()
    fetch()
    
  }
  useEffect(() => {
    fetch();
  }, [session]);
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}
    >
      <Box
        sx={{
          cursor: "pointer",
        }}
      >
        <Stack
        onClick={()=>{
          handleLike()
        }}
        >
           <Chip
        
        label="Like"
        variant="outlined"
        icon={<FavoriteIcon></FavoriteIcon>}
        color={listLike?.some(item=>item?._id===data?._id)?'error':'default'}
      />
        </Stack>
       
      </Box>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Box>
          <ThumbUpIcon />
          {data?.countLike}
        </Box>
        <Box>
          <PlayArrowIcon />
          {data?.countPlay}
        </Box>
      </Box>
    </Box>
  );
};
export default LikeTrack;
