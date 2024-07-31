import Dialog from "@mui/material/Dialog";
import Carousel from "react-material-ui-carousel";
import {CloseRounded} from "@mui/icons-material";
import frontArrow from "../../assets/arrow_back_ios.svg";
import backArrow from "../../assets/arrow_front.svg";
import {useEffect, useState} from "react";
import {useTheme} from "@mui/material";

const ModalComponent = ({
                            isModalOpen,
                            setIsModalOpen,
                            modalInitPic,
                            photos,
                        }) => {
    const [currIndex, setCurrIndex] = useState(0);

    const theme = useTheme()

    useEffect(() => {
        setCurrIndex(modalInitPic);
    }, [modalInitPic]);

    return (
        <div>
            <Dialog
                sx={{
                    [theme.breakpoints.up('md')]: {
                        marginLeft: '15%'
                    },
                }}
                fullWidth={true}
                maxWidth={'md'}
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}
            >
                <div
                    className="md:w-full md:h-screen h-fit w-[300px] p-3 bg-white flex flex-col items-center justify-center m-auto overflow-hidden">
                    <div className="flex w-full  justify-end cursor-pointer" onClick={() => setIsModalOpen(false)}>
                        <CloseRounded className={'text-coolBlue'} /></div>
                    <Carousel
                        index={currIndex}
                        className="flex flex-col items-center md:w-full md:flex-1 w-[300px] h-[260px]"
                        autoPlay={false}
                        animation="slide"
                        indicators={false}
                        navButtonsAlwaysInvisible={true}
                    >
                        {photos?.length &&
                            photos?.map((photo, ind) => (
                                <img
                                    className="m-auto w-[280px] h-[260px] cursor-pointer object-fill md:object-contain md:w-full md:h-[90vh] "
                                    src={photo}
                                    alt={`image`}
                                />
                            ))}
                    </Carousel>
                    <div className="flex w-full justify-between mt-3">
                        <img
                            src={backArrow}
                            onClick={() => {
                                if (currIndex === 0) {
                                    setCurrIndex(photos?.length - 1);
                                    return;
                                }
                                setCurrIndex(currIndex - 1);
                            }}
                            className="hidden md:flex cursor-pointer"
                        />
                        {/* <p className="font-medium text-xl truncate">
              {photos && photos[currIndex]?.split("/").pop()}
            </p> */}

                        <img
                            src={frontArrow}
                            onClick={() => {
                                setCurrIndex((currIndex + 1) % photos?.length);
                            }}
                            className="hidden md:flex cursor-pointer"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ModalComponent;
