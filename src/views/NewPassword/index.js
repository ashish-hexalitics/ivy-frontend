import React, { useCallback, useState } from 'react'
import { logo } from '../../assets'
import Input from '../../components/Input/Input'
import { useToastState } from '../../contexts/toastContext'
import { validatePassword } from '../../utils/helper'
import axios from 'axios'
import { API_URL } from '../../utils/constants'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PasswordChecker from '../../components/PasswordChecker'

const SPECIAL_CHAR_REGEX = /\W|_/g
const UPPERCASE_REGEX = '(.*[A-Z].*)'

const NewPasswordView = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()

    const { triggerToast } = useToastState()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [charLength, setCharLength] = useState(false)
    const [uppercase, setUppercase] = useState(false)
    const [specialChar, setSpecialChar] = useState(false)

    const checkPassword = (value) => {
        setPassword(value)
        if (value.length > 7) {
            setCharLength(true)
        } else {
            setCharLength(false)
        }
        if (value.match(UPPERCASE_REGEX)) {
            setUppercase(true)
        } else {
            setUppercase(false)
        }
        if (value.match(SPECIAL_CHAR_REGEX)) {
            setSpecialChar(true)
        } else {
            setSpecialChar(false)
        }
    }

    const resetPassword = useCallback(async () => {
        if (password === '' || confirmPassword === '') {
            triggerToast('Incomplete fields!', 'warning')
            return
        }
        if (password !== confirmPassword) {
            triggerToast('Passwords does not match', 'error')
            return
        }
        if (!validatePassword(password)) {
            triggerToast('Password do not satisfy the conditions', 'error')
            return
        }
        if (!searchParams.get('token')) {
            triggerToast('Invalid reset token! Check your mail for password reset link!', 'error')
            return
        }
        try {
            const response = await axios.post(`${API_URL}/auth/reset_password?token=${searchParams.get('token')}`, {
                password
            }, {
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await response.data
            triggerToast('Password changed successfully!', 'success')
            navigate('/success')
        } catch (error) {
            triggerToast(error.response.data.message, 'error')
        }
    }, [password, confirmPassword, triggerToast, navigate, searchParams])

    return (
        <div className='flex flex-col pt-8 md:pt-24 items-center gap-6 h-screen w-screen'>
            <img src={logo} alt="" className='w-[200px]' />

            <div className='flex flex-col gap-10 border border-[#EEEEEE] rounded-md shadow-md w-11/12 md:w-[500px] p-[25px]'>
                <div className='flex flex-col gap-1'>
                    <span className='font-semibold text-xl md:text-2xl text-[#151515]'>Create New Password</span>
                    <span className='text-sm text-[#BABABA]'>Your new password must be different  from previously used passwords.</span>
                </div>

                <div className='flex flex-col gap-6'>
                    <Input
                        header={"New Password"}
                        type={"password"}
                        placeholder={"New Password"}
                        name="password"
                        value={password}
                        onChange={(e) => checkPassword(e.target.value)}
                        required={true}
                        bg={"#f9f9f9"}
                    />
                    <PasswordChecker password={password} />
                    <Input
                        header={"Confirm New Password"}
                        type={"password"}
                        placeholder={"Confirm New Password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={true}
                        bg={"#f9f9f9"}
                    />
                </div>

                <button className='bg-coolBlue text-white py-3 rounded-lg text-sm' onClick={resetPassword}>Confirm</button>
            </div>
        </div>
    )
}

export default NewPasswordView