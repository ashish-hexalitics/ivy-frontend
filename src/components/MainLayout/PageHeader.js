import { ChevronLeftRounded } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ children, title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <div className="flex md:justify-between flex-col md:flex-row items-start mb-6">
      <div className="flex gap-4 items-center mt-6">
        <button onClick={() => navigate(-1)}>
          <ChevronLeftRounded className={"text-coolBlue"} fontSize="large" />
        </button>
        <div className={"flex"}>
          <span className="flex mx-auto text-md md:text-2xl font-bold">
            {" "}
            {title}{" "}
          </span>
          {subtitle && (
            <span className="text-md md:text-2xl font-bold text-gray-500 ml-1">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <div />
      {children}
    </div>
  );
};

export default PageHeader;
