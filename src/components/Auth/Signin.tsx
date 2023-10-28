"use client";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SigninForm = (props: any) => {
  const [username, setUserName] = useState<string>("");
  const [password, setPassWord] = useState<string>("");
  const [showPassword, setShowPassWord] = useState<boolean>(false);
  const [isErrorUserName, setIsErrorUserName] = useState<boolean>(false);
  const [isErrorPassWord, setIsErrorPassword] = useState<boolean>(false);

  const [errorUserName, setErrorUserName] = useState<string>("");
  const [errorPassWord, setErrorPassWord] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async () => {
    setIsErrorUserName(false);
    setIsErrorPassword(false);
    setErrorPassWord("");
    setErrorUserName("");
    if (!username) {
      setIsErrorUserName(true);
      setErrorUserName("Nhập Name");
    }
    if (!password) {
      setIsErrorPassword(true);
      setErrorPassWord("Nhập PassWord");
    }
    const res = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });
    if (!res?.error) {
      router.push("/");
    }
    else{
      alert(res?.error)
    }

  };
  return (
    <Box sx={{}}>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          lg={4}
          sx={{
            boxShadow: "rgba(100,111,111,0.2) 0px 7px 29px 0px",
          }}
        >
          <div style={{ margin: "20px" }}>
            <Link href={"/"}>
              <ArrowBackIcon></ArrowBackIcon>
            </Link>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Avatar>
                <LockIcon />
              </Avatar>
              <Typography>Sign In</Typography>
            </Box>
            <TextField
              onChange={(event) => {
                setUserName(event?.target.value);
              }}
              margin="normal"
              fullWidth
              label="UserName"
              helperText={errorUserName}
              error={isErrorUserName}
            />
            <TextField
              onChange={(event) => {
                setPassWord(event?.target.value);
              }}
              margin="normal"
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              helperText={errorPassWord}
              error={isErrorPassWord}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassWord(!showPassword)}>
                      {showPassword === false ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility></Visibility>
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              sx={{
                my: 3,
              }}
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              type="submit"
            >
              Sign In
            </Button>
            <Divider>Or using</Divider>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                mt: 3,
              }}
            >
              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "orange",
                }}
              >
                <GoogleIcon />
              </Avatar>
              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "orange",
                }}
                onClick={() => {
                  signIn("github");
                }}
              >
                <GitHubIcon titleAccess="login with Github" />
              </Avatar>
            </Box>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};
export default SigninForm;
