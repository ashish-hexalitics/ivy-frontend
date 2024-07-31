import React, { useCallback, useState } from 'react'
import { logo } from '../../assets'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Input from '../../components/Input/Input'
import { useToastState } from '../../contexts/toastContext'
import { validateEmail } from '../../utils/helper'
import axios from 'axios'
import { API_URL } from '../../utils/constants'
import {Link, useNavigate} from 'react-router-dom'
import StartCarousel from "../../components/StartCarousel";

const ForgotPasswordView = () => {
    const { triggerToast } = useToastState()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')

    const getResetPasswordLink = useCallback(async () => {
        if (email === '') {
            triggerToast('Please enter your email!', 'warning')
            return
        } else if (!validateEmail(email)) {
            triggerToast('Invalid email!', 'error')
            return
        }
        try {
            const response = await axios.get(`${API_URL}/auth/forgot_password?email=${email}`)
            const data = await response.data
            triggerToast('Email sent successfully!', 'success')
            navigate('/checkEmail')
        } catch (error) {
            triggerToast(error.response.data.message, 'error')
        }
    }, [triggerToast, email, navigate])

    return (
        <div className='flex flex-row items-center gap-6 h-screen w-screen'>
            <div className='flex-1 flex'>
                <div className='flex-1 h-screen flex flex-col items-center justify-center'>

                    <img src={logo} alt="" className='w-[200px]' />

                    <div className='flex flex-col gap-10 w-11/12 md:w-[500px] p-[25px]'>

                        <div className='flex flex-row gap-1 items-center mt-6'>
                            <Link to={'/'}>
                                <ArrowBackIosIcon className={'text-coolBlue'} />
                            </Link>
                            <span className='font-semibold text-xl md:text-2xl text-[#151515]'>Password Reset</span>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <Input
                                header={"Email address"}
                                type={"email"}
                                placeholder={"Email address"}
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                                bg={"#fff"}
                            />
                        </div>

                        <button className='primary-button' onClick={getResetPasswordLink}>Send</button>
                    </div>
                </div>
                <StartCarousel />
            </div>
        </div>
    )
}

export default ForgotPasswordView;