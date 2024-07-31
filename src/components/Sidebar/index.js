import React, {useEffect, useState} from 'react'
import {logo} from "../../assets"
import {Drawer} from '@mui/material'
import {ChevronRight, LogoutRounded, Menu} from '@mui/icons-material'
import {useAuthState} from '../../contexts/authContext'
import {ROUTES} from './routes'
import {Link} from 'react-router-dom'
import './Sidebar.css'

const SidebarComponent = () => {
    const {user, logoutUser} = useAuthState()
    const [open, setOpen] = useState(false)
    const toggleDrawer = () => setOpen(!open)

    const [activeRoute, setActiveRoute] = useState('')

    useEffect(() => {
        setActiveRoute(window.location.pathname.toLowerCase().split('/')[1])
    }, [window.location.pathname])

    return (
        <>
            <div className='w-screen flex justify-between items-center px-3 py-4 md:hidden'>
                <img src={logo} className='w-[123px]' alt=""/>
                <Menu onClick={toggleDrawer}/>
            </div>

            <Drawer
                anchor="right"
                open={open}
                onClose={toggleDrawer}
            >

                <div
                    className='w-[245px] h-screen flex flex-col justify-between py-8 bg-[#FBFCFF] border-r border-[#0000000D]'>
                    <div className='flex flex-col gap-12'>
                        <div className={'flex justify-center'}>
                            <img src={logo} className='w-[123px] mx-8' alt=""/>
                        </div>
                        <div className='flex flex-col'>
                            {user && user.role && ROUTES.map((route, index) => {
                                if (user.role === 'customer') {
                                    if (route.name === 'Reports') {
                                        return (
                                            <React.Fragment key={route.id}>
                                                <Link to={`/${route.name.toLowerCase()}`}
                                                      className={`flex gap-3 items-center cursor-pointer hover:bg-[#EFEAFE] rounded-lg m-1 py-2 px-8 ${activeRoute.includes(route.name.toLowerCase()) && 'bg-[#EFEAFE]'}`}>
                                                    {activeRoute.includes(route.name.toLowerCase()) ? route.active_icon : route.icon}
                                                    <span
                                                        className={`text-sm font-bold ${activeRoute.includes(route.name.toLowerCase()) && 'text-coolBlue'}`}>{route.name}</span>
                                                    <div className="ml-auto">
                                                        <ChevronRight
                                                            style={{color: activeRoute.includes(route.name.toLowerCase()) ? '#5131D7' : ''}}/>
                                                    </div>
                                                </Link>
                                            </React.Fragment>
                                        );
                                    }
                                    return null;
                                } else if (user.role === 'admin') {
                                    if (route.name === 'Settings' || route.name === 'Users') {
                                        return (
                                            <React.Fragment key={route.id}>
                                                {route.id === 6 &&
                                                    <div className={'ml-8 font-bold  text-sm mt-8 mb-4'}>Admin</div>}
                                                <Link to={`/${route.name.toLowerCase()}`}
                                                      className={`flex gap-3 items-center cursor-pointer hover:bg-[#EFEAFE] rounded-lg m-1 py-2 px-8 ${activeRoute.includes(route.name.toLowerCase()) && 'bg-[#EFEAFE]'}`}>
                                                    {activeRoute.includes(route.name.toLowerCase()) ? route.active_icon : route.icon}
                                                    <span
                                                        className={` text-sm font-bold ${activeRoute.includes(route.name.toLowerCase()) && 'text-coolBlue'}`}>{route.name}</span>
                                                    <div className="ml-auto">
                                                        <ChevronRight
                                                            style={{color: activeRoute.includes(route.name.toLowerCase()) ? '#5131D7' : ''}}/>
                                                    </div>
                                                </Link>
                                            </React.Fragment>
                                        );
                                    } else {
                                        return (
                                            <React.Fragment key={route.id}>
                                                <Link to={`/${route.name.toLowerCase()}`}
                                                      className={`flex gap-3 items-center cursor-pointer hover:bg-[#EFEAFE] rounded-lg m-1 py-2 px-8 ${activeRoute.includes(route.name.toLowerCase()) && 'bg-[#EFEAFE]'}`}>
                                                    {activeRoute.includes(route.name.toLowerCase()) ? route.active_icon : route.icon}
                                                    <span
                                                        className={` text-sm font-bold ${activeRoute.includes(route.name.toLowerCase()) && 'text-coolBlue'}`}>{route.name}</span>
                                                    <div className="ml-auto">
                                                        <ChevronRight
                                                            style={{color: activeRoute.includes(route.name.toLowerCase()) ? '#5131D7' : ''}}/>
                                                    </div>
                                                </Link>
                                            </React.Fragment>
                                        );
                                    }
                                } else {
                                    if (route.name === 'Users') {
                                        return null;
                                    }
                                    return (
                                        <React.Fragment key={route.id}>
                                            <Link to={`/${route.name.toLowerCase()}`}
                                                  className={`flex gap-3 items-center cursor-pointer hover:bg-[#EFEAFE] rounded-lg m-1 py-2 px-8 ${activeRoute.includes(route.name.toLowerCase()) && 'bg-[#EFEAFE]'}`}>
                                                {activeRoute.includes(route.name.toLowerCase()) ? route.active_icon : route.icon}
                                                <span
                                                    className={`text-sm font-bold ${activeRoute.includes(route.name.toLowerCase()) && 'text-coolBlue'}`}>{route.name}</span>
                                            </Link>
                                        </React.Fragment>
                                    );
                                }
                            })}
                            <div className={'mt-20 flex justify-center'}>
                                <button onClick={logoutUser}
                                        className='secondary-button w-[80%]'>
                                    Logout
                                    <LogoutRounded fontSize='small'/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>

            <div
                className='h-screen overflow-scroll no-scrollbar hidden md:w-[245px] md:flex flex-col justify-between py-8 bg-[#FBFCFF] border-r border-[#0000000D] sidebar_placement'>
                <div className='flex flex-col gap-6'>
                    <div className={'flex justify-center'}>
                        <img src={logo} className='w-[calc(245px_-_120px)] mx-8' alt=""/>
                    </div>

                    <div className='flex flex-col'>
                        {user && user.role && ROUTES.map((route, index) => {
                            if (user.role === 'customer') {
                                if (route.name === 'Reports') {
                                    return (
                                        <React.Fragment key={route.id}>
                                            <Link to={`/${route.name.toLowerCase()}`}
                                                  className={`flex gap-3 items-center cursor-pointer hover:bg-[#EFEAFE] rounded-lg m-1 py-2 px-8 ${activeRoute.includes(route.name.toLowerCase()) && 'bg-[#EFEAFE]'}`}>
                                                {activeRoute.includes(route.name.toLowerCase()) ? route.active_icon : route.icon}
                                                <span
                                                    className={`text-sm font-bold ${activeRoute.includes(route.name.toLowerCase()) && 'text-coolBlue'}`}>{route.name}</span>
                                                <div className="ml-auto">
                                                    <ChevronRight
                                                        style={{color: activeRoute.includes(route.name.toLowerCase()) ? '#5131D7' : ''}}/>
                                                </div>
                                            </Link>
                                        </React.Fragment>
                                    );
                                }
                                return null;
                            } else if (user.role === 'admin') {
                                if (route.name === 'Settings' || route.name === 'Users') {
                                    return (
                                        <React.Fragment key={route.id}>
                                            {route.id === 6 &&
                                                <div className={'ml-8 font-bold  text-sm mt-8 mb-4'}>Admin</div>}
                                            <Link to={`/${route.name.toLowerCase()}`}
                                                  className={`flex gap-3 items-center cursor-pointer hover:bg-[#EFEAFE] rounded-lg m-1 py-2 px-8 ${activeRoute.includes(route.name.toLowerCase()) && 'bg-[#EFEAFE]'}`}>
                                                {activeRoute.includes(route.name.toLowerCase()) ? route.active_icon : route.icon}
                                                <span
                                                    className={` text-sm font-bold ${activeRoute.includes(route.name.toLowerCase()) && 'text-coolBlue'}`}>{route.name}</span>
                                                <div className="ml-auto">
                                                    <ChevronRight
                                                        style={{color: activeRoute.includes(route.name.toLowerCase()) ? '#5131D7' : ''}}/>
                                                </div>
                                            </Link>
                                        </React.Fragment>
                                    );
                                } else {
                                    return (
                                        <React.Fragment key={route.id}>
                                            <Link to={`/${route.name.toLowerCase()}`}
                                                  className={`flex gap-3 items-center cursor-pointer hover:bg-[#EFEAFE] rounded-lg m-1 py-2 px-8 ${activeRoute.includes(route.name.toLowerCase()) && 'bg-[#EFEAFE]'}`}>
                                                {activeRoute.includes(route.name.toLowerCase()) ? route.active_icon : route.icon}
                                                <span
                                                    className={` text-sm font-bold ${activeRoute.includes(route.name.toLowerCase()) && 'text-coolBlue'}`}>{route.name}</span>
                                                <div className="ml-auto">
                                                    <ChevronRight
                                                        style={{color: activeRoute.includes(route.name.toLowerCase()) ? '#5131D7' : ''}}/>
                                                </div>
                                            </Link>
                                        </React.Fragment>
                                    );
                                }
                            } else {
                                if (route.name === 'Users') {
                                    return null;
                                }
                                return (
                                    <React.Fragment key={route.id}>
                                        <Link to={`/${route.name.toLowerCase()}`}
                                              className={`flex gap-3 items-center cursor-pointer hover:bg-[#EFEAFE] rounded-lg m-1 py-2 px-8 ${activeRoute.includes(route.name.toLowerCase()) && 'bg-[#EFEAFE]'}`}>
                                            {activeRoute.includes(route.name.toLowerCase()) ? route.active_icon : route.icon}
                                            <span
                                                className={`text-sm font-bold ${activeRoute.includes(route.name.toLowerCase()) && 'text-coolBlue'}`}>{route.name}</span>
                                        </Link>
                                    </React.Fragment>
                                );
                            }
                        })}
                        <div className={'mt-20 flex justify-center'}>
                            <button onClick={logoutUser}
                                    className='secondary-button w-[80%]'>
                                Logout
                                <LogoutRounded fontSize='small'/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SidebarComponent