import React from "react";
import Header from "../Header";
import SidebarComponent from "../Sidebar";

const MainLayout = ({children}) => {
    return (
        <div className="flex-col flex md:flex-row h-screen">
            <SidebarComponent/>
            <div className='flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] h-screen overflow-y-scroll'>
                <Header/>
                <div className={'ml-1 h-screen'}>
                    <div className='pb-1 md:px-12 pl-3 pr-4'>

                        {children}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MainLayout;