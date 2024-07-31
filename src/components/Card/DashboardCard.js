import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ url, title, stat, icon }) => {
    const navigate = useNavigate();

    return (
        <div
            className={`flex flex-col gap-2 md:gap-4 bg-[#EFEAFE] rounded-lg w-full md:w-[calc(25%_-16px)] py-4 px-4 ${url && 'cursor-pointer'}`} onClick={() => url && navigate(`${url}`)}>
            <div className='flex justify-between items-center'>
                <div className={`flex items-center gap-4`} >
                    <div
                        className='flex justify-center items-center bg-[#fff] w-[30px] h-[30px] md:w-[48px] md:h-[48px] rounded-sm p-1 md:p-2'>
                        {icon}
                    </div>
                    <div className={'flex flex-col'}>
                        <span className='font-bold text-sm'>{title}</span>
                        <span className='text-sm font-semibold text-coolBlue'>{stat}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCard;