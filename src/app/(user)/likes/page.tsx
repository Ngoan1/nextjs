import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { SlugURL, sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Like",
  description: "Đây là Like",
};

const LikesPage = async () => {
  const session = await getServerSession(authOptions);
  const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
    url: `http://localhost:8000/api/v1/likes`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 100,
    },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: { next: { tags: ["track-by-id"] } },
  });
  const data = res?.data?.result;
  return (
    <Container>
      <Box>
        <Typography variant="h6">List Tracks Like:</Typography>
        <Divider />
      </Box>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {data?.map((item) => {
          return (
            <Box sx={{ flexGrow: 1 }}>
              <Grid xs={2} sx={{my:2}}>
                <Image
                  width={200}
                  height={200}
                  alt="abcd"
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                />
              </Grid>
                <Link
                  href={`track/${SlugURL(item.title)}-${item._id}.html?audio=${
                    item.trackUrl
                  }`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {item.title}
                </Link>
            </Box>
          );
        })}
      </Grid>
    </Container>
  );
};
export default LikesPage;
