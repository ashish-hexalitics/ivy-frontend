import React, {useEffect, useState} from 'react'
import {logo} from "../../assets"
import Input from '../../components/Input/Input'
import Checkbox from '../../components/Checkbox/Checkbox'
import {Link} from 'react-router-dom'
import {useAuthState} from '../../contexts/authContext'
import {validateEmail, validatePassword} from '../../utils/helper'
import {useToastState} from '../../contexts/toastContext'
import StartCarousel from "../../components/StartCarousel";

const LoginView = () => {
    const {loginUser} = useAuthState()
    const {triggerToast} = useToastState()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        setLoggedIn(localStorage.getItem('loggedIn') ? localStorage.getItem('loggedIn') : false)
    }, [])

    const _loginUser = () => {
        if (email === '' || password === '') {
            triggerToast('Incomplete fields!', 'warning')
            return
        }
        if (!validateEmail(email)) {
            triggerToast('Invalid email', 'error')
            return
        }
        if (!validatePassword(password)) {
            triggerToast('Invalid password', 'error')
            return
        }
        localStorage.setItem('loggedIn', loggedIn)
        loginUser(email, password)
        setEmail('')
        setPassword('')
    }

    return (
        <div className='flex flex-row items-center gap-6 h-screen w-screen'>
            <div className='flex-1 flex'>
                <div className='flex-1 h-screen flex flex-col items-center justify-center'>
                    <img src={logo} alt="" className='w-[200px]'/>

                    <div className='flex flex-col gap-10 w-11/12 md:w-[500px] p-[25px]'>
                        <div className='flex flex-col gap-1'>
                            <span className='font-semibold text-xl md:text-2xl text-[#151515]'>Login</span>
                            {/*
                    <span className='text-sm text-[#BABABA]'>Enter your credentials to Sign in</span>
*/}
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
                            <Input
                                header={"Password"}
                                type={"password"}
                                placeholder={"Password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={true}
                                bg={"#fff"}
                            />
                            <div className='flex md:justify-between md:items-center flex-col md:flex-row'>
                                <div className={'md:my-0 my-4'}>
                                    <Checkbox
                                        Lstyle={{
                                            fontFamily: "Inter",
                                            fontWeight: "500",
                                            fontSize: "14px",
                                            backgroundColor: "#fff"
                                        }}
                                        label={"Keep me logged in"}
                                        name="loggedIn"
                                        value={loggedIn}
                                        handleChange={(e) => setLoggedIn(e.target.checked)}
                                        required={true}
                                    />
                                </div>

                                <div>
                                    <Link
                                        className="text-coolBlue text-sm font-bold"
                                        to="/forgotPassword"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>

                            </div>
                        </div>

                        <button className='primary-button'
                                onClick={_loginUser}>Sign in
                        </button>
                    </div>
                </div>
                <StartCarousel/>
            </div>
        </div>
    )
}

export default LoginView;