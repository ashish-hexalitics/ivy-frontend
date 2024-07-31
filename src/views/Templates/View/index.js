import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { REPORT_ITEMS } from "../constants";
import {
  CheckOutlined,
  CloseRounded,
  DownloadOutlined,
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
import { useTemplateState } from "../../../contexts/templateContext";

const ViewTemplate = () => {
  const navigate = useNavigate();
  const {
    allReports,
    getMeters,
    getUtilities,
    getRooms,
    getFireAlarmResponse,
    getCheckInOverviewResponse,
    status,
  } = useTemplateState();

  const { getTemplates, templates, allTemplates } = useTemplateState();
  const { getTenancies } = useAllDataState();
  const { tenancies } = useAllDataState();
  const { token } = useAuthState();
  const { triggerToast } = useToastState();
  const {
    state: { item },
  } = useLocation();
  const [template, setTemplate] = useState({});

  // const handleSetReport = (_id, type) => {
  //   setReport(allReports.filter((it) => it._id === _id)[0]);
  //   const tenancy = tenancies.filter(
  //     (tenancy) => tenancy.viewTenancy.item.report_id?._id === _id
  //   )[0]?.viewTenancy?.item;
  //   if (tenancy?.type === "HMO") {
  //     setIsTenancyTypeHMO(true);
  //     setTenants(tenancy.tenants);
  //   }

  //   type === "download"
  //     ? (() => {
  //         setPreviewType("download");
  //         setPopupOpen(true);
  //       })()
  //     : viewPDF(_id, tenancy?.type === "HMO");
  // };

  useEffect(() => {
    setTemplate(item);
  }, [item]);

  useEffect(() => {
    getRooms(item._id);
    getMeters(item._id);
    getUtilities(item._id);
    getFireAlarmResponse(item._id);
    getCheckInOverviewResponse(item._id, template?.template_type + " report");
  }, [
    item._id,
    getMeters,
    getUtilities,
    getRooms,
    getFireAlarmResponse,
    getCheckInOverviewResponse,
    template?.template_type,
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
        template?.template_type?.toLowerCase().replace(/\s/g, "") ===
        "inspection"
      )
        questionType = "overview_inspection_questions";
      if (
        template?.template_type?.toLowerCase().replace(/\s/g, "") === "checkout"
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
  }, [token, template]);

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

  // const handleReportSubmit = async () => {
  //   let reportCompleted = true;
  //   // console.log(report);
  //   if (status) {
  //     const {
  //       check_in_overview,
  //       documents,
  //       h_s_compliance,
  //       inspection_comments,
  //       meters,
  //       rooms_and_areas,
  //       signature,
  //       utilities,
  //     } = status;

  //     let filteredStatus = {
  //       check_in_overview,
  //       signature,
  //       rooms_and_areas,
  //       h_s_compliance,
  //     };
  //     if (report?.report_type?.split(" ")[0].toLowerCase() === "checkout") {
  //       filteredStatus = { ...filteredStatus, meters, utilities };
  //     } else if (
  //       report?.report_type?.split(" ")[0].toLowerCase() === "inventory"
  //     ) {
  //       filteredStatus = { ...filteredStatus, meters, utilities, documents };
  //     }
  //     Object.values(filteredStatus).forEach((item) => {
  //       if (item !== "completed") reportCompleted = false;
  //     });
  //   }
  //   if (!reportCompleted && reportStatus === "draft") {
  //     triggerToast(
  //       "Please complete all sections before submitting!",
  //       "warning"
  //     );
  //     return;
  //   }
  //   try {
  //     const response = await axios.put(
  //       `${API_URL}/account/report/${report._id}`,
  //       { status: reportStatus === "draft" ? "completed" : "draft" },
  //       {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     );
  //     const data = await response.data;
  //     triggerToast(
  //       reportStatus === "draft"
  //         ? "Report submitted successfully"
  //         : "Report can be edited now",
  //       "success"
  //     );
  //     setReportStatus("submitted");
  //     getTenancies();
  //     reportStatus === "draft" && navigate(-1);
  //   } catch (error) {
  //     triggerToast(error.response.data.message, "error");
  //   }
  // };

  const filteredReportItems = () => {
    return REPORT_ITEMS.filter(
      (it) => !(it.title === "Documents" || it.title === "Signaturen")
    ).filter((item) => {
      const templateType = template?.template_type
        ?.toLowerCase()
        .replace(/\s/g, "");

      if (templateType === "inspection") {
        // Filter out "meters", "documents", and "utilities"
        return (
          item.title.toLowerCase() !== "meters" &&
          item.title.toLowerCase() !== "documents" &&
          item.title.toLowerCase() !== "utilities"
        );
      } else if (templateType === "checkout") {
        // Filter out "documents"
        return item.title.toLowerCase() !== "documents";
      }

      // Keep all other items
      return true;
    });
  };

  return (
    <div className="pb-1">
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
          reportType={template?.template_type + " Report"}
        />
      </Modal>

      <Modal open={signatureOpen} onClose={handleSignatureClose}>
        <SignatureView handleSignatureClose={handleSignatureClose} />
      </Modal>

      <div className="flex w-full justify-between items-center mb-7">
        <PageHeader
          title={`${template?.template_type} / `}
          subtitle={template?.template_name}
        />
        <button className="primary-button w-full">
          <CheckOutlined fontSize={"small"} className={"mr-2"} /> Save
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-[100px] md:mb-10">
        {filteredReportItems().map((data) => (
          <ReportItemsCard
            data={data}
            status={[]}
            handleModalOpen={handleModalOpen}
            reportType={template?.template_type + "report"}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewTemplate;
