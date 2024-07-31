import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { REPORT_ITEMS } from "../constants";
import {
  CheckOutlined,
  ChevronRightRounded,
  CloseRounded,
  DownloadOutlined,
  PreviewOutlined,
  StartOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { API_URL, COLOR_SCHEMES, X_API_KEY } from "../../../utils/constants";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  FormControl,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import RoomsView from "./Rooms";
import axios from "axios";
import MetersView from "./Meters";
import UtilitiesView from "./Utilites";
import FireAlarmView from "./Fire";
import SignatureView from "./Signature";
import { useReportState } from "../../../contexts/reportContext";
import { useAuthState } from "../../../contexts/authContext";
import { useToastState } from "../../../contexts/toastContext";
import DocumentsView from "./Documents";
import CheckInOverviewView from "./CheckInOverview";
import { useAllDataState } from "../../../contexts/allDataContext";
import LoadingAnimation from "../../../components/LoadingAnimation";
import PageHeader from "../../../components/MainLayout/PageHeader";
import ReportItemsCard from "../../../components/Card/ReportsItemsCard";
import Checkbox from "../../../components/Checkbox/Checkbox";

const ViewReport = () => {
  const navigate = useNavigate();
  const {
    allReports,
    getMeters,
    getUtilities,
    getRooms,
    getFireAlarmResponse,
    getCheckInOverviewResponse,
    getNotes,
    getSignature,
    status,
    getCurrentReportStatus,
  } = useReportState();
  const { getTenancies } = useAllDataState();
  const { tenancies } = useAllDataState();
  const { token } = useAuthState();
  const { triggerToast } = useToastState();
  const {
    state: { item },
  } = useLocation();
  const [report, setReport] = useState({});
  const [isTenancyTypeHMO, setIsTenancyTypeHMO] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState({});

  const handleSetReport = (_id, type) => {
    setReport(allReports.filter((it) => it._id === _id)[0]);
    const tenancy = tenancies.filter(
      (tenancy) => tenancy.viewTenancy.item.report_id?._id === _id
    )[0]?.viewTenancy?.item;
    if (tenancy?.type === "HMO") {
      setIsTenancyTypeHMO(true);
      setTenants(tenancy.tenants);
    }

    type === "download"
      ? (() => {
        setPreviewType("download");
        setPopupOpen(true);
      })()
      : viewPDF(_id, tenancy?.type === "HMO");
  };

  useEffect(() => {
    setReport(allReports.filter((it) => it._id === item._id)[0]);
    setReportStatus(allReports.filter((it) => it._id === item._id)[0].status);
    const tenancy = tenancies.filter(
      (tenancy) => tenancy.viewTenancy.item.report_id?._id === report._id
    )[0]?.viewTenancy?.item;
    if (tenancy?.type === "HMO") {
      setIsTenancyTypeHMO(true);
      setTenants(tenancy.tenants);
    }
  }, [allReports, item]);

  useEffect(() => {
    getRooms(item._id);
    getMeters(item._id);
    getUtilities(item._id);
    getFireAlarmResponse(item._id);
    getCheckInOverviewResponse(item._id, report?.report_type);
    getNotes(item._id);
    getSignature(item._id);
    getCurrentReportStatus(item._id);
  }, [
    item._id,
    getMeters,
    getUtilities,
    getRooms,
    getFireAlarmResponse,
    getNotes,
    getSignature,
    getCurrentReportStatus,
    getCheckInOverviewResponse,
    report?.report_type,
  ]);

  const [roomTypes, setRoomTypes] = useState([]);
  const getRoomTypes = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/console/account/settings?entity_type=room_type`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": X_API_KEY,
          },
        }
      );
      const data = await response.data;
      setRoomTypes(data.data[0].entity_value);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const [meterTypes, setMeterTypes] = useState([]);
  const getMeterTypes = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/console/account/settings?entity_type=meters`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": X_API_KEY,
          },
        }
      );
      const data = await response.data;
      setMeterTypes(data.data[0].entity_value);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const [utilityTypes, setUtilityTypes] = useState([]);
  const getUtilityTypes = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/console/account/settings?entity_type=utilities`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": X_API_KEY,
          },
        }
      );
      const data = await response.data;
      setUtilityTypes(data.data[0].entity_value);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const [fireAlarmQuestions, setFireAlarmQuestions] = useState([]);
  const getFireAlarmQuestions = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/console/account/settings?entity_type=h_s_compliance_questions`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": X_API_KEY,
          },
        }
      );
      const data = await response.data;
      setFireAlarmQuestions(data.data[0].entity_value);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const [checkInOverviewQuestions, setCheckInOverviewQuestions] = useState([]);
  const getCheckInOverviewQuestions = useCallback(async () => {
    try {
      let questionType = "overview_inventory_questions";
      if (
        report?.report_type?.toLowerCase().replace(/\s/g, "") ===
        "inspectionreport"
      )
        questionType = "overview_inspection_questions";
      if (
        report?.report_type?.toLowerCase().replace(/\s/g, "") ===
        "checkoutreport"
      )
        questionType = "overview_checkout_questions";
      const response = await axios.get(
        `${API_URL}/account/settings?entity_type=${questionType}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.data;
      const dataEntry = data?.data;
      const newCheckinOverviewQuestions = dataEntry[0]
        ? dataEntry[0]?.entity_value
        : [];
      setCheckInOverviewQuestions(newCheckinOverviewQuestions);
    } catch (error) {
      console.log(error);
    }
  }, [token, report]);

  useEffect(() => {
    getRoomTypes();
    getMeterTypes();
    getUtilityTypes();
    getFireAlarmQuestions();
    if (token) {
      getCheckInOverviewQuestions();
    }
  }, [
    getRoomTypes,
    getMeterTypes,
    getUtilityTypes,
    getFireAlarmQuestions,
    getCheckInOverviewQuestions,
    token,
  ]);

  const handleModalOpen = (value) => {
    if (reportStatus !== "draft") {
      triggerToast("Report can't be edited in this state!", "warning");
      return;
    }
    if (value === "Rooms & Areas") {
      handleRoomsAndAreasOpen();
      return;
    } else if (value === "Meters") {
      handleMetersOpen();
      return;
    } else if (value === "Utilities") {
      handleUtilitiesOpen();
      return;
    } else if (value === "H&S Compliance") {
      handleFireAlarmOpen();
      return;
    } else if (value === "Inspection Comments") {
      handleReportNotesOpen();
      return;
    } else if (value === "Documents") {
      handleDocumentsOpen();
      return;
    } else if (value === "Signature") {
      handleSignatureOpen();
      return;
    } else if (value === "Check In Overview") {
      handleCheckInOverviewOpen();
      return;
    }
  };

  const [roomsAndAreasOpen, setRoomsAndAreasOpen] = useState(false);
  const handleRoomsAndAreasOpen = () => setRoomsAndAreasOpen(true);
  const handleRoomsAndAreasClose = () => setRoomsAndAreasOpen(false);

  const [metersOpen, setMetersOpen] = useState(false);
  const handleMetersOpen = () => setMetersOpen(true);
  const handleMetersClose = () => setMetersOpen(false);

  const [utilitiesOpen, setUtilitiesOpen] = useState(false);
  const handleUtilitiesOpen = () => setUtilitiesOpen(true);
  const handleUtilitiesClose = () => setUtilitiesOpen(false);

  const [fireAlarmOpen, setFireAlarmOpen] = useState(false);
  const handleFireAlarmOpen = () => setFireAlarmOpen(true);
  const handleFireAlarmClose = () => setFireAlarmOpen(false);

  const [reportNotesOpen, setReportNotesOpen] = useState(false);
  const handleReportNotesOpen = () => setReportNotesOpen(true);
  const handleReportNotesClose = () => setReportNotesOpen(false);

  const [documentsOpen, setDocumentsOpen] = useState(false);
  const handleDocumentsOpen = () => setDocumentsOpen(true);
  const handleDocumentsClose = () => setDocumentsOpen(false);

  const [signatureOpen, setSignatureOpen] = useState(false);
  const handleSignatureOpen = () => setSignatureOpen(true);
  const handleSignatureClose = () => setSignatureOpen(false);

  const [checkInOverviewOpen, setCheckInOverviewOpen] = useState(false);
  const handleCheckInOverviewOpen = () => setCheckInOverviewOpen(true);
  const handleCheckInOverviewClose = () => setCheckInOverviewOpen(false);

  const [reportStatus, setReportStatus] = useState("pending");
  const startInspection = useCallback(async () => {
    try {
      const response = await axios.post(
        `${API_URL}/account/report/start_inspection/${report._id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.data;
      triggerToast(data.message, "success");
      setReportStatus("started");
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [report, token, triggerToast]);

  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const previewReport = useCallback(async () => {
    setPreviewLoading(true);
    setPreviewUrl("");
    try {
      const response = await axios.get(
        `${API_URL}/account/report/download/${report._id
        }?original=${showOriginalReport}${selectedTenant?._id ? `&id=${selectedTenant._id}` : ""
        }`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = response.data;
      setPreviewUrl(data?.url);
      handlePreviewPdfDialogOpen();
      triggerToast("Report Ready For Download", "success");
    } catch (error) {
      console.log(error);
      triggerToast("Preview could not be loaded! Please try again!", "error");
    }
    setPreviewLoading(false);
  }, [report, token, triggerToast, selectedTenant]);

  const [popupOpen, setPopupOpen] = useState(false);

  const viewPDF = (reportId, isHMO) => {
    setPopupOpen(true);
    setPreviewType("preview");
  };

  const [previewPdfDialogOpen, setPreviewPdfDialogOpen] = useState(false);
  const handlePreviewPdfDialogOpen = () => setPreviewPdfDialogOpen(true);
  const handlePreviewPdfDialogClose = () => setPreviewPdfDialogOpen(false);

  const handleReportSubmit = async () => {
    let reportCompleted = true;
    // console.log(report);
    if (status) {
      const {
        check_in_overview,
        documents,
        h_s_compliance,
        inspection_comments,
        meters,
        rooms_and_areas,
        signature,
        utilities,
      } = status;

      let filteredStatus = {
        check_in_overview,
        signature,
        rooms_and_areas,
        h_s_compliance,
      };
      if (report?.report_type?.split(" ")[0].toLowerCase() === "checkout") {
        filteredStatus = { ...filteredStatus, meters, utilities };
      } else if (
        report?.report_type?.split(" ")[0].toLowerCase() === "inventory"
      ) {
        filteredStatus = { ...filteredStatus, meters, utilities, documents };
      }
      Object.values(filteredStatus).forEach((item) => {
        if (item !== "completed") reportCompleted = false;
      });
    }
    if (!reportCompleted && reportStatus === "draft") {
      triggerToast(
        "Please complete all sections before submitting!",
        "warning"
      );
      return;
    }
    try {
      const response = await axios.put(
        `${API_URL}/account/report/${report._id}`,
        { status: reportStatus === "draft" ? "completed" : "draft" },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.data;
      triggerToast(
        reportStatus === "draft"
          ? "Report submitted successfully"
          : "Report can be edited now",
        "success"
      );
      setReportStatus("submitted");
      getTenancies();
      reportStatus === "draft" && navigate(-1);
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  };

  const filteredReportItems = () => {
    return REPORT_ITEMS.filter((item) => {
      const reportType = report?.report_type?.toLowerCase().replace(/\s/g, "");

      if (reportType === "inspectionreport") {
        // Filter out "meters", "documents", and "utilities"
        return (
          item.title.toLowerCase() !== "meters" &&
          item.title.toLowerCase() !== "documents" &&
          item.title.toLowerCase() !== "utilities"
        );
      } else if (reportType === "checkoutreport") {
        // Filter out "documents"
        return item.title.toLowerCase() !== "documents";
      }

      // Keep all other items
      return true;
    });
  };

  const [pdfLoading, setPdfLoading] = useState(false);
  const [previewType, setPreviewType] = useState("");
  const handlePopupClose = () => {
    setSelectedTenant({});
    setPdfLoading(false);
    setPopupOpen(false);
  };
  const handlePdfPreview = () => {
    previewType === "download"
      ? previewReport(report?._id)
      : window.open(
        `/view-pdf/${report?._id}?original=${showOriginalReport}${selectedTenant._id ? `&id=${selectedTenant._id}` : ""
        }`,
        "_blank"
      );
    handlePopupClose();
  };

  const [showOriginalReport, setShowOriginalReport] = useState(true);

  return (
    <div className="pb-1">
      <Modal
        open={popupOpen}
        onClose={handlePopupClose}
        className="flex justify-center items-center"
      >
        <div
          className={`flex flex-col ${pdfLoading ? "items-center" : "items-start"
            } bg-white w-[767px] h-fit p-8 pt-6 gap-8 rounded-md`}
        >
          <div className="w-full justify-between flex text-[#010101 text-[22px] font-semibold">
            {previewType === "preview" ? "Preview Report" : "Download Report"}
            <button onClick={handlePopupClose} className="text-[#090909]">
              <CloseRounded className={"text-coolBlue"} />
            </button>
          </div>
          {pdfLoading ? (
            <LoadingAnimation />
          ) : isTenancyTypeHMO ? (
            <>
              <div className="flex gap-6 w-full flex-col">
                <span className="font-semibold text-lg">Original Report</span>
                <div className="grid gap-y-8 gap-x-32 grid-cols-3">
                  {tenants?.map((item, index) => (
                    <div className="flex gap-6 items-center">
                      <input
                        type="radio"
                        className={`w-4 h-4 bg-[#FEFEFF] text-coolBlue`}
                        checked={
                          selectedTenant?.email === item.email &&
                          showOriginalReport
                        }
                        onClick={() => {
                          setShowOriginalReport(true);
                          setSelectedTenant(item);
                        }}
                      />
                      <span className="font-normal text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
                <span
                  className={`font-semibold text-lg ${report?.type === "sent" || report?.status === "approved"
                      ? "flex"
                      : "hidden"
                    }`}
                >
                  Sent Report
                </span>
                <div
                  className={`grid gap-y-8 gap-x-32 grid-cols-3 font-semibold text-lg ${report?.type === "sent" || report?.status === "approved"
                      ? "flex"
                      : "hidden"
                    }`}
                >
                  {tenants?.map((item, index) => (
                    <div className="flex gap-6 items-center">
                      <input
                        type="radio"
                        className={`w-4 h-4 bg-[#FEFEFF] text-coolBlue`}
                        checked={
                          selectedTenant?.email === item.email &&
                          !showOriginalReport
                        }
                        onClick={() => {
                          setShowOriginalReport(false);
                          setSelectedTenant(item);
                        }}
                      />
                      <span className="font-normal text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-6 w-full">
              <div className="flex gap-6 items-center">
                <input
                  type="radio"
                  className={`w-4 h-4 bg-[#FEFEFF] text-coolBlue`}
                  checked={showOriginalReport}
                  onClick={() => {
                    setShowOriginalReport(true);
                  }}
                />
                <span className="font-normal text-sm">Original Report</span>
              </div>
              <div
                className={`flex gap-6 items-center ${report?.type === "sent" || report?.status === "approved"
                    ? "flex"
                    : "hidden"
                  }`}
              >
                <input
                  type="radio"
                  className={`w-4 h-4 bg-[#FEFEFF] text-coolBlue`}
                  checked={!showOriginalReport}
                  onClick={() => {
                    setShowOriginalReport(false);
                  }}
                />
                <span className="font-normal text-sm">Sent Report</span>
              </div>
            </div>
          )}
          <div className="flex justify-center w-full items-center">
            <button className="primary-button" onClick={handlePdfPreview}>
              {previewType === "preview" ? "Preview Report" : "Download Report"}
            </button>
          </div>
        </div>
      </Modal>
      <Dialog open={previewPdfDialogOpen} onClose={handlePreviewPdfDialogClose}>
        <span className="text-md font-semibold text-center md:w-[500px] h-[80px] px-8 pt-8 mb-4">
          PDF loaded. Do you want to view it now?
        </span>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingX: "2rem",
            paddingBottom: "1rem",
          }}
        >
          <button
            className="secondary-button"
            onClick={handlePreviewPdfDialogClose}
          >
            Cancel
          </button>
          <a
            className={"primary-button"}
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handlePreviewPdfDialogClose}
          >
            View
          </a>
        </DialogActions>
      </Dialog>
      <Modal open={roomsAndAreasOpen} onClose={handleRoomsAndAreasClose}>
        <RoomsView
          handleRoomsAndAreasClose={handleRoomsAndAreasClose}
          roomTypes={roomTypes}
        />
      </Modal>

      <Modal open={metersOpen} onClose={handleMetersClose}>
        <MetersView
          handleMetersClose={handleMetersClose}
          meterTypes={meterTypes.map(item => item === 'Oil Meter' ? 'Oil' : item)}
        />
      </Modal>

      <Modal open={utilitiesOpen} onClose={handleUtilitiesClose}>
        <UtilitiesView
          handleUtilitiesClose={handleUtilitiesClose}
          utilityTypes={utilityTypes}
        />
      </Modal>

      <Modal open={fireAlarmOpen} onClose={handleFireAlarmClose}>
        <FireAlarmView
          handleFireAlarmClose={handleFireAlarmClose}
          fireAlarmQuestions={fireAlarmQuestions}
        />
      </Modal>

      {/* <Modal
                open={reportNotesOpen}
                onClose={handleReportNotesClose}
                hideBackdrop={true}
            >
                <NotesView handleReportNotesClose={handleReportNotesClose} />
            </Modal> */}

      <Modal open={checkInOverviewOpen} onClose={handleCheckInOverviewClose}>
        <CheckInOverviewView
          handleCheckInOverviewClose={handleCheckInOverviewClose}
          checkInOverviewQuestions={checkInOverviewQuestions}
          reportType={report?.report_type}
        />
      </Modal>

      <Modal open={documentsOpen} onClose={handleDocumentsClose}>
        <DocumentsView
          handleDocumentsClose={handleDocumentsClose}
          report={report}
        />
      </Modal>

      <Modal open={signatureOpen} onClose={handleSignatureClose}>
        <SignatureView handleSignatureClose={handleSignatureClose} />
      </Modal>

      <PageHeader
        title={`${report?.report_type} / `}
        subtitle={`${report?.property_id?.address} (${report?.ref_number})`}
      />

      <div className="flex justify-between gap-4 pt-4 md:pt-10 md:mb-10">
        <div className="flex flex-col justify-between md:w-fit">
          {report?.property_id?.photos.length > 0 ? (
            <img
              src={report?.property_id?.photos[0]}
              alt="property"
              className="hidden md:block h-[140px] rounded-lg"
            />
          ) : (
            <div className="hidden md:flex justify-center items-center h-[140px] w-[250px] bg-gray-100 text-sm font-normal rounded-lg">
              No property image
            </div>
          )}
        </div>
        <div className="md:flex gap-4 hidden h-[40px] items-center">
          <button
            className={`secondary-button disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-500 flex items-center`}
            onClick={() => {
              report?.report_type === "Inventory Report"
                ? handleSetReport(report?._id, "download")
                : previewReport(report?._id, true);
            }}
            disabled={previewLoading}
          >
            {" "}
            <DownloadOutlined fontSize={"small"} className={"mr-2"} /> Download
            {previewLoading && (
              <CircularProgress color="primary" className="" size="2rem" />
            )}
          </button>
          <button
            className={`secondary-button disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-500`}
            onClick={() => {
              report?.report_type === "Inventory Report"
                ? handleSetReport(report?._id, "preview")
                : window.open(`/view-pdf/${report?._id}`, "_blank");
            }}
          >
            {" "}
            <VisibilityOutlined fontSize={"small"} className={"mr-2"} /> Preview
          </button>
          {reportStatus === "pending" ? (
            <button className="secondary-button" onClick={startInspection}>
              <StartOutlined fontSize={"small"} className={"mr-2"} />
              Start
            </button>
          ) : (
            <button className="primary-button" onClick={handleReportSubmit}>
              <CheckOutlined fontSize={"small"} className={"mr-2"} />{" "}
              {reportStatus !== "draft" ? "Redraft" : "Submit"}
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mb-8 md:hidden">
        <button
          className="secondary-button w-full disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-500"
          disabled={previewLoading}
          onClick={previewReport}
        >
          <VisibilityOutlined fontSize={"small"} className={"mr-2"} /> Preview
          {previewLoading && (
            <CircularProgress
              color="primary"
              className="ml-2 absolute left-[50px] top-1"
              size="2rem"
            />
          )}
        </button>
        {reportStatus === "pending" ? (
          <button className="secondary-button w-full" onClick={startInspection}>
            <StartOutlined fontSize={"small"} className={"mr-2"} /> Start
          </button>
        ) : (
          <button className="primary-button w-full">
            <CheckOutlined fontSize={"small"} className={"mr-2"} /> Submit
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 mb-[100px] md:mb-10">
        {filteredReportItems().map((data) => (
          <ReportItemsCard
            data={data}
            status={status}
            handleModalOpen={handleModalOpen}
            reportType={report?.report_type}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewReport;
