import React, { useState } from "react";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import AddHomeWorkOutlinedIcon from "@mui/icons-material/AddHomeWorkOutlined";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

import { Avatar, InputAdornment, TextField } from "@mui/material";
import {
  FilterAltOutlined,
  LogoutRounded,
  PersonRounded,
  SearchOutlined,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  List,
  ListItem,
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "../../contexts/authContext";

const Header = () => {
  const navigate = useNavigate();

  const { user, logoutUser } = useAuthState();

  return (
    <div className={"hidden md:hidden items-center py-3 justify-end"}>
      <div className={"flex flex-row items-center pr-3 md:pr-10"}>
        <Popover placement="bottom-start">
          <PopoverHandler>
            <div className="flex cursor-pointer justify-center items-center bg-coolBlue w-[40px] h-[40px] rounded-full p-1">
              <AddIcon className={"text-white"} />
            </div>
          </PopoverHandler>
          <PopoverContent>
            <div className="flex flex-col gap-2 w-fit">
              <List>
                <ListItem
                  onClick={() => navigate("/customers/add")}
                  className={
                    "hover:bg-[#EFEAFE] hover:text-coolBlue font-medium border-none text-sm"
                  }
                >
                  <GroupAddOutlinedIcon
                    sx={{ color: "#502FD8", marginRight: 1 }}
                    fontSize={"small"}
                  />{" "}
                  Add Customer
                </ListItem>
                <ListItem
                  onClick={() => navigate("/properties/add")}
                  className={
                    "hover:bg-[#EFEAFE] hover:text-coolBlue font-medium border-none text-sm"
                  }
                >
                  <AddHomeWorkOutlinedIcon
                    sx={{ color: "#502FD8", marginRight: 1 }}
                    fontSize={"small"}
                  />
                  Add Property
                </ListItem>
                <ListItem
                  onClick={() => navigate("/reports/add")}
                  className={
                    "hover:bg-[#EFEAFE] hover:text-coolBlue font-medium border-none text-sm "
                  }
                >
                  <PostAddOutlinedIcon
                    sx={{ color: "#502FD8", marginRight: 1 }}
                    fontSize={"small"}
                  />
                  Add Report
                </ListItem>
                <ListItem
                  onClick={() => navigate("/tenants/add")}
                  className={
                    "hover:bg-[#EFEAFE] hover:text-coolBlue font-medium border-none text-sm "
                  }
                >
                  <AddHomeOutlinedIcon
                    sx={{ color: "#502FD8", marginRight: 1 }}
                    fontSize={"small"}
                  />
                  Add Tenancy
                </ListItem>
              </List>
            </div>
          </PopoverContent>
        </Popover>

        {/*
            <Popover placement="bottom-start">
                <PopoverHandler>
                    <div className={'pl-4 cursor-pointer'}>
                        <Avatar style={{ height: '40px', width: '40px' }}>
                            <PersonRounded fontSize='large' />
                        </Avatar>
                    </div>
                </PopoverHandler>
                <PopoverContent>
                    <div className="flex flex-col gap-2 w-[160px]">
                        <button onClick={logoutUser}
                                className='secondary-button'>
                            Logout
                            <LogoutRounded fontSize='small'/>
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
*/}
      </div>
    </div>
  );
};

export default Header;
