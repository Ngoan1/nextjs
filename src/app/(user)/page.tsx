import MainSlider from "@/components/main/main.slider";
import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container/Container";
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Trang Chủ',
  description: 'Đây là trang chủ',
}
 


export default async function HomePage() {
  // const res = await fetch(`http://localhost:8000/api/v1/tracks/top`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     category: "CHILL",
  //     limit: 3,
  //   }),
  // });
  // console.log("check", await res.json());
  
  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `http://localhost:8000/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "CHILL",
      limit: 5,
    },
  });
  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `http://localhost:8000/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 6,
    },
  });
  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `http://localhost:8000/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10,
    },
  });

  return (
    <Container>
      <MainSlider title="CHILL" data={chills?.data ? chills.data : []}></MainSlider>
      <MainSlider title="WORKOUT" data={workouts?.data ? workouts.data : []}></MainSlider>
      <MainSlider title="PARTY" data={party?.data ? party.data : []}></MainSlider>
    </Container>
  );
}
