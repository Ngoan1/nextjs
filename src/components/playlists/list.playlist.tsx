'use client'
// import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";
import { useSession } from "next-auth/react";

interface IProps {
  playlist: IPlaylist[] | null;}
export default function ListPlayList(props: IProps) {
  const { playlist } = props;
  const {data:session}=useSession()
  const router=useRouter()
  const toast=useToast()
  const handleDelete=async(id:string)=>{
    const res= await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
      url:`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/${id}`,
      method:'DELETE',
      headers:{
      Authorization: `Bearer ${session?.access_token}`,

      }
    })
    if(res?.data){
      await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
        url:`/api/revalidate`,
        method:'POST',
        queryParams:{
          secret:'justArandomString',
          tag:'play-list-by-user'
        }
      })
      router.refresh()
      toast.success(res?.message)
    }
  }
  return (
    <>
      {playlist?.map((item) => {
        return (
         <>
          <Accordion sx={{ my: 2 }} key={item._id}>
             
             <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1a-content"
             >
               <Typography>{item.title}</Typography>
              
             </AccordionSummary>
             
             <Divider />
             
             {item?.tracks?.map(item=>{
              return(
                <AccordionDetails
               sx={{ display: "flex", justifyContent: "space-between" }}
             >
               <Typography>{item}</Typography>
               <IconButton>
                 <PlayArrowIcon sx={{ height: 20, width: 20 }} />
               </IconButton>
             </AccordionDetails>
              )
             })}
             
             <Divider />
           </Accordion>
           <IconButton onClick={()=>handleDelete(item._id)}>
           <DeleteIcon />
         </IconButton>
           
         </>
        );
      })}
    </>
  );
}
