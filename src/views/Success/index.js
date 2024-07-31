import React from 'react'
import { logo, success } from '../../assets'
import { useNavigate } from 'react-router-dom'

const SuccessView = () => {
    const navigate = useNavigate()

    return (
        <div className='flex flex-col pt-8 md:pt-24 items-center gap-6 h-screen w-screen'>
            <img src={logo} alt="" className='w-[200px]' />

            <div className='flex flex-col gap-10 border border-[#EEEEEE] rounded-md shadow-md w-11/12 md:w-[500px] p-[25px]'>
                <div className='flex justify-center items-center'>
                    <img src={success} alt="" className='w-[240px] md:w-[280px]' />
                </div>

                <div className='flex flex-col gap-1 items-center'>
                    <span className='font-semibold text-xl md:text-3xl text-[#151515]'>Success!</span>
                    <span className='text-sm text-[#BABABA]'>Your Password has been successfully changed.</span>
                </div>

                <button className='bg-coolBlue text-white py-3 rounded-lg text-sm' onClick={() => navigate('/')}>Login</button>
            </div>
        </div>
    )
}

export default SuccessView