import React from "react";
import {PermIdentityRounded} from "@mui/icons-material";

const PropertyInfoItem = ({title, item, icon}) => {
    return <div className='flex flex-col gap-1 md:gap-2 min-w-[200px]'>
        <div className='flex gap-2 items-center text-sm md:text-base'>
            {icon}
            <span className='text-coolBlue font-bold text-sm'>{title}</span>
        </div>
        <span
            className='text-sm font-normal capitalize'>{item}</span>
    </div>
}

export default PropertyInfoItem;