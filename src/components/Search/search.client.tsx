"use client";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useSearchParams } from "next/navigation";
import { SlugURL, sendRequest } from "@/utils/api";
import { useState, useEffect } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "next/link";

const SearchClient = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [listSearch, setListSearch] = useState<ITrackTop[]>([]);
  const fetchData = async (query: string) => {
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
      method: "POST",
      body: {
        title: query,
        current: 1,
        pageSize: 100,
      },
    });
    if (res?.data?.result) {
      setListSearch(res?.data?.result);
    }
  };
  console.log(listSearch);
  useEffect(() => {
    document.title = `Kết quả tìm kiếm cho từ khóa"${query}"`;
    if (query) {
      fetchData(query);
      console.log('haeha')
    }
  }, [query]);
  return (
    <>
      <Typography>{listSearch.length>0?<>Kết quả cho tìm kiếm:{query}</>:<>Không tồn tại kết quả tìm kiếm</>}</Typography>
      <Divider />
      {listSearch.map((item) => {
        return (
          <>
            <Box sx={{ flexGrow: 1 }}>
              <Grid xs={2} sx={{ my: 2 }}>
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
          </>
        );
      })}
    </>
  );
};
export default SearchClient;
