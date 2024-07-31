import React from "react";
import Header from "../Header";
import SidebarComponent from "../Sidebar";

const DashboardLayout = ({children}) => {
    return (
        <div className="flex-col flex md:flex-row h-screen">
            <SidebarComponent/>
            <div className='flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] h-screen overflow-scroll'>
                <Header/>
                <div className={'ml-16'}>
                    {children}

                </div>
            </div>
        </div>
    )
}

export default DashboardLayout;