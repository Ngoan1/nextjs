import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/lib/toast";
import Image from "next/image";


const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function InputFileUpload(props:any) {
  const {info,setInfo}=props
  const { data: session } = useSession();

  const handleUpload=async(image:any)=>{
    const formData = new FormData()

    formData.append('fileUpload', image);
        try {
            const res = await axios.post("http://localhost:8000/api/v1/files/upload", formData,
                {
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`,
                        "target_type": 'images',
                    },
                })
            setInfo({
                ...info,
                imgURL: res.data.data.fileName
            })
        } catch (error) {
            //@ts-ignore
            alert(error?.response?.data?.message)
        }
  }
  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      onChange={(e) => {
        const event = e.target as HTMLInputElement;
        if (event.files) {
            handleUpload(event.files[0])
        }
    }}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel(props: IProps) {
  const { uploadTrack } = props;

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={uploadTrack.percent} />
    </Box>
  );
}
interface IProps {
  uploadTrack: {
    fileName: string;
    percent: number;
    uploadedTrackName: string;
  };
  setValue:(value:number)=>void
}
const Step2 = (props: IProps) => {
  const { uploadTrack,setValue } = props;
  // console.log(uploadTrack,'check uploadTrack')
  const {data:session}=useSession()
  const toast = useToast()
  const [info, setInfo] = React.useState({
    title: "",
    description: "",
    trackURL: "",
    imgURL: "",
    category: "",
  });
  React.useEffect(()=>{
    if(uploadTrack &&uploadTrack.uploadedTrackName){
      setInfo({
        ...info,
        trackURL:uploadTrack.uploadedTrackName
      })
    }
    
  },[uploadTrack])
  const handleSubmit= async()=>{
    

      const res = await sendRequest<IBackendRes<ITrackTop[]>>({
        url:'http://localhost:8000/api/v1/tracks',
        method:'POST',
        headers:{
          Authorization: `Bearer ${session?.access_token}`
        },
        body:{
          title:info.title,
          description:info.description,
          category:info.category,
          trackUrl:info.trackURL,
          imgUrl:info.imgURL
        }
  
      })
      if(res.data){
      toast.success(res.message)
      setValue(0)

      }else{
        //@ts-ignore
        toast.error(res.error)
      }
      

  }
  

  const category = [
    {
      value: "CHILL",
      label: "CHILL",
    },
    {
      value: "WORKOUT",
      label: "WORKOUT",
    },
    {
      value: "PARTY",
      label: "PARTY",
    },
  ];

  return (
    <Box>
      <div>{uploadTrack.fileName}</div>
      <LinearWithValueLabel setValue={setValue} uploadTrack={uploadTrack}></LinearWithValueLabel>
      <Grid container spacing={2} mt={5}>
        <Grid
          item
          xs={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ height: 250, width: 250, background: "#ccc" }}>
            <div>
              {info.imgURL&&(
                <Image
                height={250}
                width={250}
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgURL}`} alt="" />
              )}
            </div>
          </div>
          <div>
            <InputFileUpload info={info} setInfo={setInfo}/>
          </div>
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField
          value={info.title}
          onChange={(e)=>setInfo({
            ...info,
            title:e.target.value

          })}
            label="Title"
            variant="standard"
            fullWidth
            margin="dense"
          />
          <TextField
           onChange={(e)=>setInfo({
            ...info,
            description:e.target.value

          })}
            label="Description"
            variant="standard"
            fullWidth
            margin="dense"
          />
          <TextField
            sx={{
              mt: 3,
            }}
            id="outlined-select-currency"
            select
            label="Category"
            fullWidth
            variant="standard"
            //   defaultValue="EUR"
            onChange={(e)=>setInfo({
              ...info,
              category:e.target.value
  
            })}
          >
            {category.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            sx={{
              mt: 5,
            }}
            onClick={()=>handleSubmit()}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Step2;
