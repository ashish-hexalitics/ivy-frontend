import { COLOR_SCHEMES } from "../../utils/constants";
import { ChevronRightRounded } from "@mui/icons-material";
import React from "react";

const ReportItemsCard = ({ data, status, handleModalOpen, reportType }) => {
  const getOverviewTypeTitle = () => {
    if (reportType?.toLowerCase().replace(/\s/g, "") === "inspectionreport")
      return "Inspection Overview";
    else if (reportType?.toLowerCase().replace(/\s/g, "") === "checkoutreport")
      return "Check Out Overview";
    else return "Check In Overview";
  };

  return (
    <div
      key={data.title}
      className="bg-[#F4F4F6] w-full flex justify-between items-center p-4 rounded-md"
    >
      <span
        className="font-semibold text-sm text-[#2D3436] cursor-pointer w-full"
        onClick={() => handleModalOpen(data.title)}
      >
        {data.title.toLowerCase().replace(/\s/g, "") === "checkinoverview"
          ? getOverviewTypeTitle()
          : data.title}
      </span>
      <div className="flex gap-4 items-center">
        {status && (
          <span
            className="text-sm px-3 py-2 rounded-full w-max capitalize"
            style={{
              color:
                COLOR_SCHEMES[
                  status &&
                    status[
                      data.title
                        .toLowerCase()
                        .replaceAll(" ", "_")
                        .replace(
                          "&",
                          data.title.toLowerCase().replaceAll(" ", "") ===
                            "rooms&areas"
                            ? "and"
                            : "_"
                        )
                    ]
                ]?.text,
              backgroundColor:
                COLOR_SCHEMES[
                  status &&
                    status[
                      data.title
                        .toLowerCase()
                        .replaceAll(" ", "_")
                        .replace(
                          "&",
                          data.title.toLowerCase().replaceAll(" ", "") ===
                            "rooms&areas"
                            ? "and"
                            : "_"
                        )
                    ]
                ]?.bg,
              borderColor:
                COLOR_SCHEMES[
                  status &&
                    status[
                      data.title
                        .toLowerCase()
                        .replaceAll(" ", "_")
                        .replace(
                          "&",
                          data.title.toLowerCase().replaceAll(" ", "") ===
                            "rooms&areas"
                            ? "and"
                            : "_"
                        )
                    ]
                ]?.text,
            }}
          >
            {status &&
              status[
                data.title
                  .toLowerCase()
                  .replaceAll(" ", "_")
                  .replace(
                    "&",
                    data.title.toLowerCase().replaceAll(" ", "") ===
                      "rooms&areas"
                      ? "and"
                      : "_"
                  )
              ]}
          </span>
        )}
        <button
          onClick={() => handleModalOpen(data.title)}
          className="hidden md:block"
        >
          <ChevronRightRounded fontSize="medium" />
        </button>
      </div>
    </div>
  );
};

export default ReportItemsCard;
