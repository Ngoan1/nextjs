"use client";
import React, { useCallback } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import "./step1.css";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSession } from "next-auth/react";
import axios from "axios";
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
interface IProps {
  setValue: (value: number) => void;
  uploadTrack: {
    fileName: string;
    percent: number;
    uploadedTrackName: string;
  };
  setUpLoadTrack: any;

}
const Step1 = (props: IProps) => {
  const { setValue, uploadTrack, setUpLoadTrack } = props;
  const { data: session } = useSession();
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      if (acceptedFiles && acceptedFiles[0]) {
        const audio = acceptedFiles[0];

        let formData = new FormData();
        formData.append("fileUpload", audio);

        // const res = await sendRequestFile<IBackendRes<ITrackTop[]>>({
        //   url: `http://localhost:8000/api/v1/files/upload`,
        //   method: "POST",
        //   headers: {
        //     Authorization: `Bearer ${session?.access_token}`,
        //     target_type:'tracks'
        //   },
        //   body:
        //     formData
        //   ,
        // });
        try {
          setValue(1);

          const res = await axios.post(
            "http://localhost:8000/api/v1/files/upload",
            formData,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
                target_type: "tracks",
                delay: 3000,
              },
              onUploadProgress: progressEvent => {
                let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);
                
                setUpLoadTrack({
                  ...uploadTrack,
                  fileName: acceptedFiles[0].name,
                  percent: percentCompleted,
                });
              },
            }
          );
          // console.log("check name file", res.data.data.fileName);
          // console.log("check uploadedTrackName", acceptedFiles[0].name);
          setUpLoadTrack({
            ...uploadTrack,
            uploadedTrackName: res.data.data.fileName,

          });
          // console.log('check upload1',uploadTrack)

        } catch (error) {
          console.log(error, "erorr ne");
        }
      }
    },
    
    [session]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4", ".MP4", ".mp3"],
    },
  });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <Button
          onClick={(event) => {
            event.preventDefault();
          }}
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};
export default Step1;
