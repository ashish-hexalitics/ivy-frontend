import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import ModalComponent from "../../../components/Modal";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CheckOutlined, ChevronLeftRounded } from "@mui/icons-material";

const GalleryCarousel = ({
  label,
  photos,
  setIsModalOpen,
  setModalInitPic,
  index,
  setPhotoSetIndex,
}) => {
  const [currIndex, setCurrIndex] = useState(0);
  const getPhotoName = (name) => {
    const extension = name.split(".").pop();
    const res = name.replace(`.${extension}`, "");
    return res.length <= 15
      ? res + "." + extension
      : res.slice(0, 15) + "...." + extension;
  };

  return (
    <div className="flex flex-col items-center md:items-start md:gap-6 gap-2 bg-white py-2 md:p-6 md:pb-8 w-screen max-w-full">
      <span className="font-semibold text-base">{label}</span>
      <div className="hidden md:grid w-full gap-6 flex-wrap grid-cols-4">
        {photos.length &&
          photos?.map((photo, ind) => (
            <div className="flex flex-col justify-center items-center gap-4">
              <div
                className="bg-gray-100 rounded-md bg-no-repeat bg-center bg-contain w-[200px] p-3 flex justify-center"
                onClick={() => {
                  setIsModalOpen(true);
                  setModalInitPic(ind);
                  setPhotoSetIndex(index);
                }}
              >
                <img
                  className="w-auto h-[170px] cursor-pointer object-contain"
                  src={photo}
                  alt={`${label}-image`}
                />
              </div>
              {/* <span className="font-medium text-sm truncate text-center">
               {getPhotoName(photo.split("/").pop())} 
              </span> */}
            </div>
          ))}
      </div>
      <div className="md:hidden flex items-center">
        {/* <img
          src={backArrow}
          onClick={() => {
            if (currIndex === 0) {
              setCurrIndex(photos?.length - 1);
              return;
            }
            setCurrIndex(currIndex - 1);
          }}
          className="cursor-pointer"
        /> */}
        <Carousel
          className="flex flex-col items-center justify-center w-screen"
          autoPlay={false}
          animation="slide"
          indicators={true}
          navButtonsAlwaysInvisible={true}
          index={currIndex}
        >
          {photos?.length &&
            photos.map((photo, ind) => (
              <div
                className="bg-[#f0f0f0] bg-no-repeat bg-center bg-contain w-[240px] px-3 flex justify-center m-auto"
                onClick={() => {
                  setIsModalOpen(true);
                  setModalInitPic(ind);
                  setPhotoSetIndex(index);
                }}
              >
                <img
                  className="w-auto h-[170px] cursor-pointer object-contain"
                  src={photo}
                  alt={`${label}-image`}
                />
              </div>
            ))}
        </Carousel>
        {/* <img
          src={frontArrow}
          onClick={() => {
            setCurrIndex((currIndex + 1) % photos?.length);
          }}
          className="cursor-pointer"
        /> */}
      </div>
    </div>
  );
};

const Gallery = () => {
  const [property, setProperty] = useState();
  const [photoSetIndex, setPhotoSetIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitPic, setModalInitPic] = useState(0);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${API_URL}/account/report/${id}/gallery`
      );
      const data = await response.data;
      setProperty(data);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="flex gap-4 items-center mt-8">
        <button onClick={() => navigate(-1)}>
          <ChevronLeftRounded className="text-coolBlue" fontSize="large" />
        </button>
        <span className="text-xl md:text-2xl font-semibold md:font-bold text-[#2D3436]">
          {property?.property?.report_type} gallery for{" "}
          {property?.property?.address}
        </span>
      </div>
      <div className="flex flex-col md:flex-row justify-start py-2 px-0 md:p-6 ">
        {/*
        <img src={logo} alt="logo" className="w-[120px] h-[50px]" />
*/}
      </div>
      <div className="flex flex-col justify-start items-center py-4 md:p-8 gap-4 md:gap-8 min-w-[0px] min-h-screen h-fit">
        <p className="font-semibold text-sm md:hidden text-center">
          {property?.property?.report_type} gallery for{" "}
          {property?.property?.address}
        </p>
        {property?.data &&
          property?.data.map((item, ind) => (
            <GalleryCarousel
              photos={item?.photos}
              key={item?.heading}
              label={item?.heading}
              setIsModalOpen={setIsModalOpen}
              setModalInitPic={setModalInitPic}
              index={ind}
              setPhotoSetIndex={setPhotoSetIndex}
            />
          ))}
      </div>
      <ModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalInitPic={modalInitPic}
        photos={property?.data[photoSetIndex]?.photos}
        report={property?.property?.report_type}
      />
    </div>
  );
};

export default Gallery;
