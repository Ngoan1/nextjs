"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Step1 from "@/components/track/steps/step1/step1";
import Step2 from "@/components/track/steps/step2/step2";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UploadTrack = () => {
  const [value, setValue] = React.useState(0);
  const [uploadTrack, setUpLoadTrack] = React.useState({
    fileName: "",
    percent: 0,
    uploadedTrackName: "",
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", mt: 5, border: "1px solid black" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Tracks" {...a11yProps(0)} disabled={value!==0} />
          <Tab
            label="Basic Information"
            disabled={value!==1}
            {...a11yProps(1)}/>
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Step1
          setValue={setValue}
          uploadTrack={uploadTrack}
          setUpLoadTrack={setUpLoadTrack}
        ></Step1>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Step2 setValue={setValue} uploadTrack={uploadTrack}></Step2>
      </CustomTabPanel>
    </Box>
  );
};
export default UploadTrack;
