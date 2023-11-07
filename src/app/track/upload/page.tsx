import UploadTrack from "@/components/track/upload.track";
import { Container } from "@mui/material";
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Up Load',
  description: 'Đây là Upload',
}
 

const UploadPage = () => {
  return (
    <Container>
      <UploadTrack></UploadTrack>
    </Container>
  );
};
export default UploadPage;
