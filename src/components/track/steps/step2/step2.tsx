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

function InputFileUpload() {
  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
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
}
const Step2 = (props: IProps) => {
  const { uploadTrack } = props;
  console.log(uploadTrack,'check uploadTrack')
  const [info, setInfo] = React.useState({
    title: "",
    description: "",
    trackURL: "",
    imgURL: "",
    category: "",
  });
  // React.useEffect(()=>{
  //   if(uploadTrack &&uploadTrack.uploadedTrackName){
  //     setInfo({
  //       ...info,
  //       trackURL:uploadTrack.uploadedTrackName
  //     })
  //   }
    
  //   console.log(uploadTrack,'check info') 
  // },[uploadTrack])
  

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
      <LinearWithValueLabel uploadTrack={uploadTrack}></LinearWithValueLabel>
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
            <div></div>
          </div>
          <div>
            <InputFileUpload />
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
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Step2;
