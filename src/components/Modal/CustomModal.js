import {Modal} from "@mui/material";
import LoadingAnimation from "../LoadingAnimation";
import {CloseRounded} from "@mui/icons-material";
import React from "react";

const CustomModal = ({open, setIsOpen, handleClose, isLoading, title, content, actions}) => {
    return (
        <Modal
            open={open}
            onClose={() => handleClose ? handleClose() : setIsOpen && setIsOpen(false)}
            className="flex justify-center items-center"
        >
            <div
                className={`flex flex-col ${isLoading ? "items-center" : "items-start"} md:ml-[15%] bg-white md:w-[500px] h-fit p-8 pt-6 gap-8 rounded-md`}>
                {isLoading ? <LoadingAnimation/> : (<>
                    <div className="flex w-full">
                        <span className="flex-1 text-lg font-semibold">{title}</span>
                        <button onClick={() => handleClose ? handleClose() : setIsOpen && setIsOpen(false)}
                                className="text-[#090909]">
                            <CloseRounded className={'text-coolBlue'}/>
                        </button>
                    </div>
                    {content}
                    {actions}
                </>)}
            </div>
        </Modal>
    )
}

export default CustomModal;