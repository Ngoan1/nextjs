"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import { SlugURL } from "@/utils/api";
import Image from "next/image";
interface IProps {
  data: ITrackTop[];
  title: string;
}
const MainSlider = (props: IProps) => {
  const { data, title } = props;
  const SampleNextArrow = (props: any) => {
    return (
      <Button
        variant="contained"
        color="inherit"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          right: 25,
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronRightIcon />
      </Button>
    );
  };
  const SamplePrevArrow = (props: any) => {
    return (
      <Button
        variant="contained"
        color="inherit"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronLeftIcon />
      </Button>
    );
  };
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <Box
      sx={{
        margin: "0 50px",
        ".tracks": {
          padding: "0 10px",
          img: {
            height: "150px",
            width: "150px",
          },
        },
        h3: {
          border: "1px solid #ccc",
          padding: "20px",
          height: "200px",
        },
      }}
    >
      <h2>{title}</h2>

      <Slider {...settings}>
        {data.map((item) => {
          return (
            <div className="tracks" key={item._id}>
              {/* <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
              /> */}
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                alt="Picture of the author"
                width={500}
                height={500}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover', // cover, contain, none
                }}
              />
              <Link
                href={`/track/${SlugURL(item.title)}-${item?._id}.html?audio=${
                  item.trackUrl
                }`}
              >
                <h4>{item.title}</h4>
              </Link>
              <h5>{item.description}</h5>
            </div>
          );
        })}
      </Slider>
      <Divider></Divider>
    </Box>
  );
};
export default MainSlider;
