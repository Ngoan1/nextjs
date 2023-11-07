// 'use client'
import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const str = params.slug;

  const temp = str.split(".html");
  // console.log(temp);

  const temp1 = temp[0].split("-");
  // console.log(temp1)
  const id = temp1[temp1.length - 1];
  // console.log(id)

  // fetch data
  const data = await sendRequest<IBackendRes<ITrackTop>>({
    url: `http://localhost:8000/api/v1/tracks/${id}`,
    method: "GET",
  });
  // optionally access and extend (rather than replace) parent metadata

  return {
    title: data?.data?.title,
  };
}

export async function generateStaticParams() {
  return [
    { slug: "Xi-Mang-Pho-652524ae5e6b99cd2f7a5dc3.html" },
    { slug: "Le-Luu-Ly-652524ae5e6b99cd2f7a5dc1.html" },
    { slug: "Sau-Con-Mua-652524ae5e6b99cd2f7a5dc2.html" },
  ];
}

// import { useSearchParams } from 'next/navigation'

const TrackDetailPage = async ({ params }: { params: { slug: string } }) => {
  // const tempId = params.slug;
  // const temp = tempId.split(".html");
  // //@ts-ignore
  // const temp1 = temp.split("-");
  // console.log(temp1, "check ");
  const str = params.slug;

  const temp = str.split(".html");
  // console.log(temp);

  const temp1 = temp[0].split("-");
  // console.log(temp1)
  const id = temp1[temp1.length - 1];
  // console.log(id)

  const data = await sendRequest<IBackendRes<ITrackTop>>({
    url: `http://localhost:8000/api/v1/tracks/${id}`,
    method: "GET",
    nextOption: { next: { tags: ["track-by-id"] } },
  });
  const d = data.data;
  const data1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `http://localhost:8000/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: id,
      sort: "-createdAt",
    },
  });

  // const {params}=props

  // const searchParams = useSearchParams()

  // const audio = searchParams.get('audio')
  if (!data1.data) {
    notFound();
  }
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <Container>
      <WaveTrack
        comments={data1.data?.result || null}
        data={d || null}
      ></WaveTrack>
    </Container>
  );
};
export default TrackDetailPage;
