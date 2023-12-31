import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SigninForm from "@/components/Auth/Signin"
import { Box } from "@mui/material"
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Đăng Nhập',
  description: 'Đây là Đăng Nhập',
}
 


const SigninPage=async()=>{
  const session = await getServerSession(authOptions)
  if(session){
    redirect('/')
  }
  return(
    <Box>
      <SigninForm></SigninForm>

    </Box>
  )
}
export default SigninPage