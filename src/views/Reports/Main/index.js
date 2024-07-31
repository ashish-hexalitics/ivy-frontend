import React, { useEffect, useState } from "react";
import Tbl from "../../../components/Table/Tbl";
import { useReportState } from "../../../contexts/reportContext";
import { REPORT_STATUS, columns } from "../constants";
import {
  CalendarMonthOutlined,
  DownloadOutlined,
  DownloadRounded,
  FilterAlt,
  FilterAltOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
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
import { CSVLink } from "react-csv";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { filterData } from "../../../utils/helper";
import AccordionTable from "../../../components/Accordion";
import TitleButtons from "../../../components/MainLayout/TitleButtons";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const ReportsView = () => {
  const { reports, reportTypeList, clerkList } = useReportState();
  const theme = useTheme();

  const { state } = useLocation()

  const [filteredReports, setFilteredReports] = useState([]);
  const [reportTypeFilter, setReportTypeFilter] = useState("");
  const [reportStatusFilter, setReportStatusFilter] = useState("");
  const [clerkAgentFilter, setClerkAgentFilter] = useState("");
  const [filterMinDate, setFilterMinDate] = useState("");
  const [filterMaxDate, setFilterMaxDate] = useState("");

  const clearFilters = () => {
    setReportTypeFilter("");
    setReportStatusFilter("");
    setClerkAgentFilter("");
    setFilterMinDate("");
    setFilterMaxDate("");
  };

  const [stateDate, setStateDate] = useState([
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
          state?.property?.property_id
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
    state
  ]);

  return (
    <div className="pb-1">
      <TitleButtons data={reports} title={"reports"} addButton={"Report"} />

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
                setStateDate([item.selection]);
              }}
              editableDateInputs={true}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={true}
              months={2}
              ranges={stateDate}
              rangeColors={["#532FD9", "#FFF4F3"]}
              direction={lessThanSmall ? "vertical" : "horizontal"}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="hidden md:block border border-[#eeeeee] rounded-lg shadow-lg mb-20">
        <Tbl
          data={filteredReports.map((report) => ({
            ...report,
            reportType: report.reportType.split(" ")[0],
          }))}
          columns={columns}
          type={"Reports"}
        />
      </div>

      <div className="block md:hidden mt-4 mb-20">
        <AccordionTable data={filteredReports} type={"Reports"} />
      </div>
    </div>
  );
};

export default ReportsView;
