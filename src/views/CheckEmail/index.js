import React from 'react'
import { check_email, logo } from '../../assets'

const CheckEmailView = () => {
    return (
        <div className='flex flex-col pt-8 md:pt-24 items-center gap-6 h-screen w-screen'>
            <img src={logo} alt="" className='w-[200px]' />

            <div className='flex flex-col gap-10 w-11/12 md:w-[600px] p-[25px]'>
                <div className='flex justify-center items-center'>
                    <img src={check_email} alt="" className='w-[240px] md:w-[280px]' />
                </div>

                <div className='flex flex-col gap-1'>
                    <span className='font-bold text-center text-coolBlue text-xl mb-4 md:text-2xl'>Check Your Email</span>
                    <span className='text-md text-center'>We have sent a password recovery instructions to your email.</span>
                </div>

                <button className='bg-coolBlue font-bold text-white py-3 rounded-lg text-md'>Go to Your Mail</button>
            </div>
        </div>
    )
}

export default CheckEmailView