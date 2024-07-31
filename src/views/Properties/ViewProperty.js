import {
  AddOutlined,
  ApartmentOutlined,
  AssignmentIndOutlined,
  BathtubOutlined,
  BedOutlined,
  ChairAltOutlined,
  CreateRounded,
  FilterAltOutlined,
  FormatListBulletedOutlined,
  PermIdentityOutlined,
  PlaceOutlined,
  SignpostOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/constants";
import { useAuthState } from "../../contexts/authContext";
import { PropertyReportColumns } from "./constants";
import Tbl from "../../components/Table/Tbl";
import { useAllDataState } from "../../contexts/allDataContext";
import { useToastState } from "../../contexts/toastContext";
import AlertDialog from "../../components/AlertDialog";
import { useReportState } from "../../contexts/reportContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PropertyInfoItem from "./PropertyInfoItem";
import DashboardCard from "../../components/Card/DashboardCard";
import PageHeader from "../../components/MainLayout/PageHeader";
import AccordionTable from "../../components/Accordion";
import { filterData } from "../../utils/helper";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  useMediaQuery,
  useRadioGroup,
  useTheme,
} from "@mui/material";
import { DateRange } from "react-date-range";
import { REPORT_STATUS } from "../Reports/constants";

const ViewProperty = () => {
  const { token, user } = useAuthState();
  const { getProperties } = useAllDataState();
  const { triggerToast } = useToastState();
  const { getPropertyList, reports, reportTypeList, clerkList } =
    useReportState();

  const {
    state: { item },
  } = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const [filteredReports, setFilteredReports] = useState([]);
  const [reportTypeFilter, setReportTypeFilter] = useState("");
  const [reportStatusFilter, setReportStatusFilter] = useState("");
  const [clerkAgentFilter, setClerkAgentFilter] = useState("");
  const [filterMinDate, setFilterMinDate] = useState("");
  const [filterMaxDate, setFilterMaxDate] = useState("");

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const lessThanSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const toTitleCase = (str) => {
    if (str === "waiting_to_be_signed") {
      return "Waiting";
    }
    return str
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  };

  const StyledFormControlLabel = styled((props) => (
    <FormControlLabel {...props} />
  ))(({ checked }) => ({
    ".MuiFormControlLabel-label": checked && {
      color: "#5131D7",
      fontWeight: "bold",
    },
    marginTop: "-10px",
  }));

  function CustomFormControlLabel(props) {
    // MUI UseRadio Group
    const radioGroup = useRadioGroup();

    let checked = false;

    if (radioGroup) {
      checked = radioGroup.value === props.value;
    }

    return <StyledFormControlLabel checked={checked} {...props} />;
  }

  const clearFilters = () => {
    setReportTypeFilter("");
    setReportStatusFilter("");
    setClerkAgentFilter("");
    setFilterMinDate("");
    setFilterMaxDate("");
  };

  const getPropertyReports = () => {
    setFilteredReports(
      reports.filter(
        (report) => item?._id === report?.viewReport?.item?.property_id?._id
      )
    );
  };

  useEffect(() => {
    getPropertyReports();
  }, [item]);

  const deleteProperty = useCallback(async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/account/property/${item._id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.data;
      getProperties();
      getPropertyList();
      triggerToast("Property deleted successfully!", "success");
      navigate("/properties");
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [getProperties, item, token, triggerToast, navigate, getPropertyList]);

  const [deletePropertyDialogOpen, setDeletePropertyDialogOpen] =
    useState(false);
  const handleDeletePropertyDialogOpen = () =>
    setDeletePropertyDialogOpen(true);
  const handleDeletePropertyDialogClose = () =>
    setDeletePropertyDialogOpen(false);

  useEffect(() => {
    if (reports.length > 0) {
      setFilteredReports(
        filterData(
          reports,
          reportTypeFilter,
          reportStatusFilter,
          clerkAgentFilter,
          filterMinDate,
          filterMaxDate,
          item?._id
        )
      );
    }
  }, [
    reports,
    reportTypeFilter,
    reportStatusFilter,
    clerkAgentFilter,
    filterMinDate,
    filterMaxDate,
    item
  ]);

  return (
    <div className="pb-1">
      <PageHeader
        title={`${item?.address} /`}
        subtitle={item?.customer_user_id?.name}
        children={
          <div className="flex items-center justify-end gap-1 flex-col md:flex-row w-full md:w-fit mt-5">
            <div
              className={
                "flex gap-2 justify-between md:justify-end md:mt-0 mt-4 w-full md:w-fit"
              }
            >
              {user?.role !== "customer" && user?.role !== "clerk" && (
                <button
                  className="w-full md:w-auto secondary-button disabled:text-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                  onClick={handleDeletePropertyDialogOpen}
                >
                  <DeleteOutlineIcon className={"mr-1"} fontSize={"small"} />{" "}
                  Delete Property
                </button>
              )}
              {/*                        <button className='secondary-button mr-2'>
                            <CloseOutlined fontSize={'small'}/> Cancel
                        </button>
                        <button className='primary-button disabled:text-gray-400 disabled:cursor-not-allowed'
                        >
                            <CheckIcon fontSize={'small'}/> Save
                        </button>*/}
              {user?.role !== "customer" && user?.role !== "clerk" && (
                <button
                  onClick={() =>
                    navigate("/properties/edit", { state: { item: item } })
                  }
                  className="w-full md:w-auto secondary-button flex justify-center items-center overflow-hidden"
                >
                  <CreateRounded className={"mr-1"} fontSize="small" />
                  Edit Property
                </button>
              )}
            </div>
            <button
              onClick={() => navigate("/reports/add", { state: item.address })}
              className="w-full md:w-auto primary-button flex justify-center items-center"
            >
              <AddOutlined className={"mr-1"} fontSize="small" />
              Add Report
            </button>
          </div>
        }
      />

      <div className="flex flex-col gap-4 ">
        <div className="flex gap-4 flex-col md:flex-row mt-4 mb-4 items-center">
          {item.photos.length > 0 && item.photos[0].includes("http") ? (
            <img
              src={item.photos[0]}
              alt=""
              className="max-h-[200px] rounded-md shadow-md "
            />
          ) : (
            <div className="h-[200px] w-[350px] bg-gray-100 rounded-lg flex justify-center items-center">
              <span className="text-sm font-medium text-gray-500">
                No display photo available.
              </span>
            </div>
          )}
          <div className="flex flex-col justify-between p-4 gap-2">
            <div className="flex flex-wrap gap-6">
              <PropertyInfoItem
                title={"Customer Name"}
                item={item?.customer_user_id?.name}
                icon={<PermIdentityOutlined sx={{ color: "#5131D7" }} />}
              />
              <PropertyInfoItem
                title={"Post Code"}
                item={item?.postcode}
                icon={<SignpostOutlined sx={{ color: "#5131D7" }} />}
              />
              <PropertyInfoItem
                title={"Town"}
                item={item?.town}
                icon={<ApartmentOutlined sx={{ color: "#5131D7" }} />}
              />
              <PropertyInfoItem
                title={"Type"}
                item={item?.type}
                icon={<FormatListBulletedOutlined sx={{ color: "#5131D7" }} />}
              />
              <PropertyInfoItem
                title={"Address"}
                item={item?.address}
                icon={<PlaceOutlined sx={{ color: "#5131D7" }} />}
              />
              <PropertyInfoItem
                title={"Amenities"}
                item={item?.amenities.join(", ")}
                icon={<BathtubOutlined sx={{ color: "#5131D7" }} />}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center my-6">
        <DashboardCard
          icon={<BedOutlined sx={{ color: "#5131D7" }} />}
          title={"Bedrooms"}
          stat={item?.bedrooms < 10 ? `${item.bedrooms}` : item.bedrooms}
        />
        <DashboardCard
          icon={<BathtubOutlined sx={{ color: "#5131D7" }} />}
          title={"Bathrooms"}
          stat={item?.bathrooms < 10 ? `${item.bathrooms}` : item.bathrooms}
        />
        <DashboardCard
          icon={<ChairAltOutlined sx={{ color: "#5131D7" }} />}
          title={"Furnished"}
          stat={item?.furnishing ? "Yes" : "No"}
        />
        <DashboardCard
          icon={<AssignmentIndOutlined sx={{ color: "#5131D7" }} />}
          title={"Ref"}
          stat={item?.ref_number}
        />
      </div>

      <div className="flex flex-col md:flex-row  md:justify-end gap-4 mb-6">
        {(reportTypeFilter !== "" ||
          reportStatusFilter !== "" ||
          clerkAgentFilter !== "" ||
          filterMinDate !== "" ||
          filterMaxDate !== "") && (
            <button
              className="text-coolBlue  text-sm font-medium mr-2"
              onClick={clearFilters}
            >
              <CloseOutlinedIcon fontSize={"small"} /> Clear filters
            </button>
          )}
        <Popover placement="bottom-start">
          <PopoverHandler>
            <div className="cursor-pointer secondary-button flex items-center justify-center">
              <FilterAltOutlined
                fontSize={"small"}
                className={"text-coolBlue"}
              />
              <span className=" text-sm font-semibold ">Report Type</span>
            </div>
          </PopoverHandler>
          <PopoverContent>
            <div className="flex flex-col gap-4 w-fit pl-3">
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="reportTypeFilter"
                  value={reportTypeFilter}
                  onChange={(e) => setReportTypeFilter(e.target.value)}
                >
                  {reportTypeList.length > 0 &&
                    reportTypeList.map((item) => (
                      <CustomFormControlLabel
                        className={"font-bold"}
                        key={item}
                        value={item}
                        control={
                          <Radio
                            className={"m-2"}
                            sx={{
                              marginY: 1,
                              "&.Mui-checked": {
                                color: "#532FD9",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: 20,
                              },
                            }}
                          />
                        }
                        label={
                          <span className="label-text hover:font-bold  text-sm hover:text-coolBlue">
                            {item}
                          </span>
                        }
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            </div>
          </PopoverContent>
        </Popover>

        <Popover placement="bottom-start">
          <PopoverHandler>
            <div className="cursor-pointer secondary-button flex items-center justify-center">
              <FilterAltOutlined
                fontSize={"small"}
                className={"text-coolBlue"}
              />
              <span className=" text-sm font-semibold">Report Status</span>
            </div>
          </PopoverHandler>
          <PopoverContent>
            <div className="flex flex-col gap-4 w-fit pl-3">
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="reportStatusFilter"
                  value={reportStatusFilter}
                  onChange={(e) => setReportStatusFilter(e.target.value)}
                >
                  {REPORT_STATUS.map((item) => (
                    <CustomFormControlLabel
                      value={item}
                      control={
                        <Radio
                          sx={{
                            marginY: 1,
                            "&.Mui-checked": {
                              color: "#532FD9",
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: 20,
                            },
                          }}
                        />
                      }
                      autoFocus={false}
                      label={
                        <span className="label-text hover:font-bold  text-sm hover:text-coolBlue">
                          {toTitleCase(item)}
                        </span>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </PopoverContent>
        </Popover>

        <Popover placement="bottom-start">
          <PopoverHandler>
            <div className="cursor-pointer secondary-button flex items-center justify-center">
              <FilterAltOutlined
                fontSize={"small"}
                className={"text-coolBlue"}
              />
              <span className=" text-sm font-semibold">Clerk/Agent</span>
            </div>
          </PopoverHandler>
          <PopoverContent>
            <div className="flex flex-col gap-4 w-fit pl-3">
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="clerkAgentFilter"
                  value={clerkAgentFilter}
                  onChange={(e) => setClerkAgentFilter(e.target.value)}
                >
                  {clerkList.length > 0 &&
                    clerkList.map((item) => (
                      <CustomFormControlLabel
                        value={item.name}
                        control={
                          <Radio
                            sx={{
                              marginY: 1,
                              "&.Mui-checked": {
                                color: "#532FD9",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: 20,
                              },
                            }}
                          />
                        }
                        autoFocus={false}
                        label={
                          <span className="label-text hover:font-bold  text-sm hover:text-coolBlue">
                            {item.name}
                          </span>
                        }
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            </div>
          </PopoverContent>
        </Popover>
        <Popover placement="bottom-start">
          <PopoverHandler>
            <div className="cursor-pointer secondary-button flex items-center justify-center">
              <CalendarMonthOutlined
                fontSize={"small"}
                className={"text-coolBlue"}
              />
              <span className="text-sm font-semibold">Select Date Range</span>
            </div>
          </PopoverHandler>
          <PopoverContent className="shadow-md">
            <DateRange
              onChange={(item) => {
                setFilterMinDate(item.selection.startDate);
                setFilterMaxDate(item.selection.endDate);
                setState([item.selection]);
              }}
              editableDateInputs={true}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={true}
              months={2}
              ranges={state}
              rangeColors={["#532FD9", "#FFF4F3"]}
              direction={lessThanSmall ? "vertical" : "horizontal"}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-12 mb-8 md:block hidden border border-[#eeeeee] rounded-md shadow-md">
        <Tbl
          data={filteredReports.map((report) => ({
            ...report,
            reportType: report.reportType.split(" ")[0],
          }))}
          columns={PropertyReportColumns}
          type="View Reports"
        />
      </div>
      <div className="block md:hidden mt-4 mb-20">
        <AccordionTable data={filteredReports} type={"View Reports"} />
      </div>

      <AlertDialog
        open={deletePropertyDialogOpen}
        handleClose={handleDeletePropertyDialogClose}
        accept={deleteProperty}
        content={"Delete this property?"}
      />
    </div>
  );
};

export default ViewProperty;
