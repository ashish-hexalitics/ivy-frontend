import React from "react";
import { CSVLink } from "react-csv";
import { DownloadOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TitleButtons = ({
  title,
  data,
  addButton,
  route,
  userRole,
  disabled,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div></div>
      <div className="flex flex-col md:flex-row justify-end md:gap-6 md:items-center mt-8 mb-6">
        <div className="flex w-full items-center justify-between md:justify-between md:gap-4">
          {/* <CSVLink data={data} filename={`${title}.csv`}>
                    <button
                        className='secondary-button w-[110%] md:w-fit'>
                        <DownloadOutlined className={'mr-1'} fontSize={'small'}/> Export CSV
                    </button>

                </CSVLink> */}
          <span
            style={{ textTransform: "capitalize" }}
            className={"flex text-xl md:text-2xl  font-bold"}
          >
            {title}
          </span>
          {title === "customers" || "properties" ? (
            userRole !== "clerk" &&
            userRole !== "customer" && (
              <button
                className="primary-button md:w-fit w-1/2"
                onClick={() => navigate(`/${route ? route : title}/add`)}
              >
                + Add {addButton}
              </button>
            )
          ) : (
            <button
              disabled={disabled}
              className="primary-button md:w-fit w-1/2"
              onClick={() => navigate(`/${route ? route : title}/add`)}
            >
              + Add {addButton}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default TitleButtons;
