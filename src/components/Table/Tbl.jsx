import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt";
import "./Tbl.css";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  API_URL,
  COLOR_SCHEMES,
  REPORT_ROWS_BG_COLOR,
  cloneReportData,
} from "../../utils/constants";
import {
  ApartmentRounded,
  ChevronRightRounded,
  CloseRounded,
  DeleteForeverRounded,
  Edit,
  EditRounded,
  ModeEditRounded,
  Add,
  Send,
  Visibility,
  Download,
  EditOutlined,
  HolidayVillageOutlined,
  VisibilityOutlined,
  PreviewOutlined,
  DownloadOutlined,
  FileCopyOutlined,
  InsertPhotoOutlined,
  FormatListBulletedOutlined,
  MailOutlined,
  DriveFileRenameOutlineOutlined,
  DeleteOutlined,
  RingVolumeOutlined,
} from "@mui/icons-material";
import { Dialog, DialogActions, Modal, Tooltip } from "@mui/material";
import { useAuthState } from "../../contexts/authContext";
import ReactSignatureCanvas from "react-signature-canvas";
import { logo } from "../../assets";
import axios from "axios";
import { useToastState } from "../../contexts/toastContext";
import LoadingAnimation from "../LoadingAnimation";
import { useAllDataState } from "../../contexts/allDataContext";
import { useReportState } from "../../contexts/reportContext";
import Input from "../Input/Input";
import Checkbox from "../Checkbox/Checkbox";
import { formatDate, validateEmail } from "../../utils/helper";
import AlertDialog from "../AlertDialog";
import {
  PopoverContent,
  PopoverHandler,
  Popover,
} from "@material-tailwind/react";
import { useTemplateState } from "../../contexts/templateContext";

const Tbl = ({ data, columns, type, ...restProps }) => {
  const { onTenantEdit, onTenantDelete, deleteNote } = restProps;
  const { user } = useAuthState();
  const { getTemplates } = useTemplateState();
  const navigate = useNavigate();
  $.DataTable = DT;
  const tableRef = useRef();
  const ht = window.innerHeight;
  const {
    tenancies,
    getProperties,
    getTenancies,
    getCustomers,
    getPropertyList,
  } = useAllDataState();
  const [currentImage, setCurrentImage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [emailOpen, setEmailOpen] = React.useState(false);
  const [signatureOpen, setSignatureOpen] = React.useState(false);
  const [currentReportId, setCurrentReportId] = useState("");
  const [currentReport, setCurrentReport] = useState({});
  const [contacts, setContacts] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [emailLoading, setEmailLoading] = useState(false);
  const { triggerToast } = useToastState();
  const { token } = useAuthState();
  const handleOpen = (url) => {
    setCurrentImage(url);
    setOpen(true);
  };
  const handleClose = () => {
    setCurrentImage("");
    setOpen(false);
  };

  const getTenancyItem = (id) => {
    return tenancies
      .filter((item) => item.viewTenancy.item.report_id !== null)
      .filter((item) => item.viewTenancy.item.report_id._id === id)[0]
      ?.viewTenancy?.item;
  };
  const { allReports, getReports } = useReportState();
  const [popupOpen, setPopupOpen] = useState(false);

  const deleteReport = useCallback(
    async (reportId) => {
      try {
        const response = await axios.delete(
          `${API_URL}/account/report/${reportId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        getReports();
        getProperties();
        triggerToast("Report deleted successfully!", "success");
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [getReports, token, triggerToast, navigate, getProperties]
  );

  const deleteTemplate = useCallback(
    async (templateId) => {
      try {
        const response = await axios.delete(
          `${API_URL}/account/template/${templateId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        getTemplates();
        getProperties();
        triggerToast("Template deleted successfully!", "success");
        navigate("/templates");
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [getTemplates, token, triggerToast, navigate, getProperties]
  );

  const deleteTenant = useCallback(
    async (tenantId) => {
      try {
        const response = await axios.delete(
          `${API_URL}/account/tenancy/${tenantId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        getTenancies();
        getProperties();
        triggerToast("Tenant deleted successfully!", "success");
        navigate("/reports");
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [getTenancies, token, triggerToast, navigate, getProperties]
  );

  const deleteCustomer = useCallback(
    async (itemId) => {
      try {
        const response = await axios.delete(
          `${API_URL}/account/customer/${itemId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        getCustomers();
        triggerToast("Customer deleted successfully!", "success");
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [getCustomers, token, triggerToast, navigate]
  );

  const [deleteReportDialogOpen, setDeleteReportDialogOpen] = useState(false);
  const [deleteDialogAccept, setDeleteDialogAccept] = useState();
  const [deleteDialogContent, setDeleteDialogContent] = useState("");

  const handleDeleteReportDialogClose = () => {
    setDeleteReportDialogOpen(false);
  };

  const deleteProperty = useCallback(
    async (propertyId) => {
      try {
        const response = await axios.delete(
          `${API_URL}/account/property/${propertyId}`,
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
    },
    [getProperties, token, triggerToast, navigate, getPropertyList]
  );

  const handleItemDelete = (itemId, type) => {
    if (type === "reports") {
      setDeleteDialogContent("Delete this report?");
      setDeleteReportDialogOpen(true);
      setDeleteDialogAccept(() => () => deleteReport(itemId));
    } else if (type === "templates") {
      setDeleteDialogContent("Delete this template?");
      setDeleteReportDialogOpen(true);
      setDeleteDialogAccept(() => () => deleteTemplate(itemId));
    } else if (type === "tenants") {
      setDeleteDialogContent("Delete this tenancy?");
      setDeleteReportDialogOpen(true);
      setDeleteDialogAccept(() => () => deleteTenant(itemId));
    } else if (type === "customers") {
      setDeleteDialogContent("Delete this customer?");
      setDeleteReportDialogOpen(true);
      setDeleteDialogAccept(() => () => deleteCustomer(itemId));
    } else if (type === "properties") {
      setDeleteDialogContent("Delete this property?");
      setDeleteDialogAccept(() => () => deleteProperty(itemId));
      setDeleteReportDialogOpen(true);
    }
  };

  const [previewPdfDialogOpen, setPreviewPdfDialogOpen] = useState(false);
  const handlePreviewPdfDialogOpen = () => setPreviewPdfDialogOpen(true);
  const handlePreviewPdfDialogClose = () => setPreviewPdfDialogOpen(false);

  const [pdfLoading, setPdfLoading] = useState(false);
  const [previewType, setPreviewType] = useState("");
  const handlePopupClose = () => {
    setSelectedTenant({});
    setPdfLoading(false);
    setIsTenancyTypeHMO(false);
    setPopupOpen(false);
  };

  const [selectedTenant, setSelectedTenant] = useState({});
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isTenancyTypeHMO, setIsTenancyTypeHMO] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [report, setReport] = useState({});
  const [showOriginalReport, setShowOriginalReport] = useState(true);

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

  const viewPDF = (reportId, isHMO) => {
    setPopupOpen(true);
    setPreviewType("preview");
  };

  const handleTenantFeedback = (tenantData) => {
    const { onTenantEdit, reportId, tenancyType } = tenantData;
  };

  const [cloneReportPopupOpen, setCloneReportPopupOpen] = useState(false);

  const handleCloneReportPopupClose = () => {
    setCloneReportPopupOpen(false);
    setCloneReportFormData({
      rooms_and_areas: false,
      rooms_and_areas_images: false,
      check_in_overview: false,
      check_in_overview_images: false,
      inspection_overview: false,
      inspection_overview_images: false,
      check_out_overview: false,
      check_out_overview_images: false,
      h_s_compliance: false,
      h_s_compliance_images: false,
      utilities: false,
      utilities_images: false,
      meters: false,
      meters_images: false,
    });
    setCurrentReport({});
  };

  const [cloneReportFormData, setCloneReportFormData] = useState({
    rooms_and_areas: false,
    rooms_and_areas_images: false,
    check_in_overview: false,
    check_in_overview_images: false,
    inspection_overview: false,
    inspection_overview_images: false,
    check_out_overview: false,
    check_out_overview_images: false,
    h_s_compliance: false,
    h_s_compliance_images: false,
    utilities: false,
    utilities_images: false,
    meters: false,
    meters_images: false,
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleCloneReport = async () => {
    try {
      await axios.post(
        `${API_URL}/account/report/${currentReport?._id}/clone`,
        cloneReportFormData,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );
      getReports();
      handleCloneReportPopupClose();
      triggerToast(
        `Report ${currentReport?.ref_number} Cloned Successfully`,
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const previewReport = useCallback(
    async (_id, hideOriginal) => {
      setPreviewLoading(true);
      handlePreviewPdfDialogOpen();
      setPreviewUrl("");
      try {
        const response = await axios.get(
          `${API_URL}/account/report/download/${_id}${hideOriginal
            ? ""
            : `?original=${showOriginalReport}${selectedTenant?._id ? `&id=${selectedTenant._id}` : ""
            }`
          }`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        setPreviewUrl(data?.url);
        triggerToast("Report Ready For Download", "success");
      } catch (error) {
        console.log(error);
        triggerToast("Preview could not be loaded! Please try again!", "error");
      }
      setPreviewLoading(false);
    },
    [report, token, triggerToast, selectedTenant]
  );

  const [sideMenuOpen, setSidemenuOpen] = useState(false);

  useEffect(() => {
    const table = $(tableRef.current).DataTable({
      dom: 'lf<"data-table-wrapper"t>ip',
      data: data,
      columns: columns,
      createdRow: function (row, data, dataIndex) {
        if (data.isPriority) {
          $(row).addClass("priority");
        }
      },
      columnDefs: [
        {
          targets: [type === "Reports" || type === "Properties" ? 0 : null],
          width: 60,
          className: "center",
          createdCell: (td, cellData, rowData) => {
            if (cellData.length === 0) {
              return ReactDOM.render(<ApartmentRounded color="red" />, td);
            }
            return ReactDOM.render(
              <img
                onClick={() => handleOpen(cellData)}
                src={cellData}
                alt="property"
                className="border border-[#eeeeee] rounded-md cursor-pointer bg-black"
              />,
              td
            );
          },
        },
        {
          targets: [
            (type === "Reports" || type === "View Reports") &&
            columns.length - 6,
          ],
          width: 100,
          className: "center",
          createdCell: (td, cellData, rowData) =>
            ReactDOM.render(
              <div className="flex items-center">
                {cellData}
              </div>,
              td
            ),
        },
        {
          targets: [
            type === "Reports" || type === "View Reports"
              ? columns.length - 2
              : null,
            type === "Edit_Tenants" && columns.length - 2,
          ],
          width: 100,
          className: "center",
          createdCell: (td, cellData, rowData) =>
            ReactDOM.render(
              <div
                id={rowData.id}
                className="flex items-center justify-center"
                style={{
                  background:
                    COLOR_SCHEMES[cellData] && COLOR_SCHEMES[cellData].bg,
                  border: `1px solid ${COLOR_SCHEMES[cellData] && COLOR_SCHEMES[cellData].text
                    }`,
                  borderRadius: "7px",
                  color:
                    COLOR_SCHEMES[cellData] && COLOR_SCHEMES[cellData].text,
                  padding: "2px",
                  fontWeight: 600,
                }}
              >
                {cellData === "waiting_to_be_signed" ? "waiting" : cellData}
              </div>,
              td
            ),
        },
        {
          targets: [
            type !== "Notes" &&
            type !== "Edit_Tenants" &&
            type !== "Report Notes" &&
            type !== "Settings" &&
            columns.length - 1,
          ],
          className: "center dt-control",
          width: 60,
          orderable: false,
          data: null,
          defaultContent: "",
          createdCell: (td, cellData, rowData, dataIndex) =>
            ReactDOM.render(
              <Popover
                placement={"bottom-start"}
                dismiss={{
                  outsidePress: true,
                  outsidePressEvent: "pointerdown",
                }}
              >
                <PopoverHandler>
                  <MoreVertIcon fontSize={"small"} />
                </PopoverHandler>
                <PopoverContent className="shadow-md">
                  <div
                    id={`menu_${dataIndex}`}
                    style={{
                      gap: "1rem",
                      flexDirection: "column",
                      minWidth: "160px",
                      fontSize: 14,
                    }}
                  >
                    {user?.role === "customer" ||
                      (user?.role === "clerk" &&
                        (cellData.route.includes("customer") ||
                          cellData.route.includes("properties"))) ? null : (
                      <span
                        className="cursor-pointer text-start hover:text-coolBlue font-medium"
                        onClick={() => {
                          navigate(`/${cellData.route.split("/")[1]}/edit`, {
                            state: { item: cellData.item, isEdit: true },
                          });
                        }}
                      >
                        <EditOutlined
                          fontSize={"small"}
                          className={"text-coolBlue mr-2"}
                        />
                        Edit
                      </span>
                    )}
                    <span
                      className="cursor-pointer text-start hover:text-coolBlue font-medium"
                      onClick={() => {
                        navigate(cellData.route, {
                          state: { item: cellData.item, isEdit: false },
                        });
                      }}
                    >
                      <VisibilityOutlined
                        fontSize={"small"}
                        className={"text-coolBlue mr-2"}
                      />
                      View{" "}
                      {type === "Reports" || type === "Templates"
                        ? type.slice(0, type.length - 1)
                        : ""}
                    </span>
                    {!(
                      cellData.route.includes("tenants") ||
                      cellData.route.includes("users") ||
                      cellData.route.includes("templates") ||
                      cellData.route.includes("customers")
                    ) && (
                        <span
                          className="cursor-pointer text-start hover:text-coolBlue font-medium"
                          onClick={() => {
                            getTenancyItem(cellData?.item?._id)
                              ? navigate(`/tenants/edit`, {
                                state: {
                                  item: getTenancyItem(cellData?.item?._id),
                                  isEdit: false,
                                },
                              })
                              : navigate(`/tenants/add`, {
                                state: {
                                  propertyAddress:
                                    cellData?.item?.property_id?.address,
                                  referenceNo: cellData?.item?.ref_number,
                                  warning: true,
                                },
                              });
                          }}
                        >
                          <HolidayVillageOutlined
                            fontSize={"small"}
                            className={"text-coolBlue mr-2"}
                          />
                          {cellData.route.includes("properties")
                            ? "Tenants"
                            : "View Tenancy"}
                        </span>
                      )}
                    {cellData.route.includes("report") && (
                      <>
                        <div className="flex gap-1 items-center">
                          <span
                            className="cursor-pointer text-start hover:text-coolBlue font-medium"
                            onClick={() => {
                              cellData.item?.report_type === "Inventory Report"
                                ? handleSetReport(cellData.item?._id, "preview")
                                : window.open(
                                  `/view-pdf/${cellData?.item?._id}`,
                                  "_blank"
                                );
                            }}
                          >
                            <PreviewOutlined
                              fontSize={"small"}
                              className={"text-coolBlue mr-2"}
                            />
                            Preview
                          </span>
                        </div>
                        <span
                          className="cursor-pointer text-start hover:text-coolBlue font-medium"
                          onClick={() => {
                            cellData.item?.report_type === "Inventory Report"
                              ? handleSetReport(cellData.item?._id, "download")
                              : previewReport(cellData.item?._id, true);
                          }}
                        >
                          <DownloadOutlined
                            fontSize={"small"}
                            className={"text-coolBlue mr-2"}
                          />
                          Download
                        </span>
                        <span
                          className="cursor-pointer text-start hover:text-coolBlue font-medium"
                          onClick={() => {
                            setCloneReportPopupOpen(true);
                            setCurrentReport(cellData?.item);
                          }}
                        >
                          <FileCopyOutlined
                            fontSize={"small"}
                            className={"text-coolBlue mr-2"}
                          />
                          Clone Report
                        </span>
                        {cellData?.item?.status === "completed" && (
                          <span
                            className="cursor-pointer text-start hover:text-coolBlue font-medium"
                            onClick={() => {
                              setCurrentReportId(cellData.item?._id);
                              setEmailOpen(true);
                              handleEmailOpen(cellData?.item?._id);
                            }}
                          >
                            <MailOutlined
                              fontSize={"small"}
                              className={"text-coolBlue mr-2"}
                            />
                            Email
                          </span>
                        )}
                        {cellData?.item?.status === "completed" &&
                          cellData?.item?.report_type?.toLowerCase() ===
                          "inventory report" && (
                            <span
                              className="cursor-pointer text-start hover:text-coolBlue font-medium"
                              onClick={() => {
                                setCurrentReportId(cellData.item?._id);
                                setSignatureOpen(true);
                                handleEmailOpen(cellData?.item?._id);
                              }}
                            >
                              <DriveFileRenameOutlineOutlined
                                fontSize={"small"}
                                className={"text-coolBlue mr-2"}
                              />
                              Send for Signature
                            </span>
                          )}
                        {/* <span
                          className="cursor-pointer text-start hover:text-coolBlue font-medium"
                          onClick={() => { }}
                        >
                          <FormatListBulletedOutlined
                            fontSize={"small"}
                            className={"text-coolBlue mr-2"}
                          />
                          View Logs
                        </span> */}

                        <span
                          className="cursor-pointer text-start hover:text-coolBlue font-medium"
                          onClick={() => {
                            navigate(`/reports/gallery/${cellData.item?._id}`);
                          }}
                        >
                          <InsertPhotoOutlined
                            fontSize={"small"}
                            className={"text-coolBlue mr-2"}
                          />
                          Gallery
                        </span>
                      </>
                    )}
                    {user?.role === "customer" ||
                      (user?.role === "clerk" &&
                        (cellData.route.includes("customer") ||
                          cellData.route.includes("properties"))) ? null : (
                      <span
                        className="cursor-pointer text-start hover:text-coolBlue font-medium"
                        onClick={() =>
                          handleItemDelete(
                            cellData?.item?._id,
                            cellData.route.split("/")[1]
                          )
                        }
                      >
                        <DeleteOutlined
                          fontSize={"small"}
                          className={"text-coolBlue mr-2"}
                        />
                        Delete
                      </span>
                    )}
                  </div>
                </PopoverContent>
              </Popover>,
              td
            ),
        },
        {
          targets: [type === "Edit_Tenants" && 1],
          createdCell: (td, cellData, rowData) => {
            ReactDOM.render(
              <div style={{ color: COLOR_SCHEMES[rowData.status]?.text }}>
                {cellData}
              </div>,
              td
            );
          },
        },
        {
          targets: [
            (type === "Reports" || type === "View Reports") &&
            columns.length - 3,
          ],
          createdCell: (td, cellData, rowData) => {
            ReactDOM.render(
              <div
                className="cursor-pointer text-center"
                onClick={() => {
                  getTenancyItem(
                    allReports.filter(
                      (r) =>
                        r?.ref_number === rowData?.referenceNo ||
                        r?.ref_number ===
                        rowData?.viewProperty?.item?.ref_number
                    )[0]?._id
                  )
                    ? navigate(`/tenants/edit`, {
                      state: {
                        item: getTenancyItem(rowData?.viewReport?.item?._id),
                        isEdit: false,
                      },
                    })
                    : navigate(`/tenants/add`, {
                      state: {
                        propertyAddress:
                          rowData?.viewReport?.item?.property_id?.address,
                        referenceNo: rowData?.viewReport?.item?.ref_number,
                        warning: true,
                      },
                    });
                }}
              >
                {cellData}
              </div>,
              td
            );
          },
        },
        {
          targets: [type === "Properties" && columns.length - 3],
          createdCell: (td, cellData, rowData) => {
            ReactDOM.render(
              <div
                className="flex cursor-pointer w-full  "
                onClick={() => navigate("/reports", { state: { property: rowData } })}
              >
                {cellData}
              </div>,
              td
            );
          },
        },
        {
          targets: [type === "Tenants" && columns.length - 2],
          width: 120,
          createdCell: (td, cellData, rowData) => {
            ReactDOM.render(
              <div className="flex flex-col items-end gap-1 flex-wrap overflow-x-auto">
                {cellData.map((data, idx) => {
                  if (idx < 1) {
                    return (
                      <div
                        className={`rounded-md w-[100px] h-[22px] px-2 flex items-center justify-center`}
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: COLOR_SCHEMES[data.status]?.text,
                          backgroundColor: COLOR_SCHEMES[data.status]?.bg,
                          border: `1px solid ${COLOR_SCHEMES[data.status]?.text}`,
                        }}
                      >
                        {data.name}
                      </div>
                    );
                  }
                  return null;
                })}
                {cellData.length > 1 && <span className="text-[11px] font-medium">+{cellData.length - 1} more</span>}
              </div>,
              td
            );
          },
        },
        {
          targets: [type === "Reports" && 1, type === "Reports" && 3],
          width: 150,
          align: 'left',
          createdCell: (td, cellData, rowData) => {
            ReactDOM.render(
              <span className="flex  ">{cellData}</span>,
              td
            );
          },
        },
        // {
        //   targets: [(type === "Reports" || type === "View Reports") && 2],
        //   createdCell: (td, cellData, rowData) => {
        //     ReactDOM.render(
        //       <span className="flex  ">
        //         {formatDate(cellData)}
        //       </span>,
        //       td
        //     );
        //   },
        // },
        // {
        //   targets: [type === "Properties" && columns.length - 2],
        //   createdCell: (td, cellData, rowData) => {
        //     ReactDOM.render(
        //       <div
        //       className="cursor-pointer"
        //       onClick={() => {
        //       navigate("/tenants");
        //       }}
        //       >
        //         {cellData}
        //       </div>,
        //       td
        //     );
        //   },
        // },
        {
          targets: [type === "Report Notes" && columns.length - 1],
          width: 100,
          className: "center",
          createdCell: (td, cellData, rowData) =>
            ReactDOM.render(
              <div
                id={rowData.id}
                onClick={() => {
                  cellData.func(cellData.item);
                }}
                style={{
                  color: "#212121",
                  cursor: "pointer",
                }}
              >
                <Edit fontSize="small" color="primary" />
              </div>,
              td
            ),
        },
        {
          targets: [(type === "Notes" || type === "Edit_Tenants") && columns.length - 1],
          width: 100,
          className: "center",
          orderable: false,
          data: null,
          defaultContent: "",
          createdCell: (td, cellData, rowData) =>
            ReactDOM.render(
              <div className="flex justify-start text-[#212121] gap-2">
                <Tooltip title="Delete">
                  <DeleteForeverRounded
                    fontSize="small"
                    color="error"
                    className="cursor-pointer"
                    onClick={deleteNote && (() => deleteNote(rowData))}
                  />
                </Tooltip>
              </div>,
              td
            ),
        },
        {
          targets: [(type === "Edit_Tenants") && columns.length - 1],
          width: 100,
          className: "center",
          orderable: false,
          data: null,
          defaultContent: "",
          createdCell: (td, cellData, rowData) =>
            ReactDOM.render(
              <div className="flex justify-start text-[#212121] gap-2">
                <Tooltip title="Download Report">
                  <Download
                    fontSize="small"
                    color="primary"
                    onClick={() => {
                      rowData?.reportType === "Inventory Report"
                        ? (() => {
                          setSelectedTenant({ _id: rowData?.tenantId });
                          handleSetReport(rowData?.reportId, "download");
                        })()
                        : previewReport(rowData?.reportId, true);
                    }}
                    className="cursor-pointer"
                  />
                </Tooltip>
                <Tooltip title="Preview Report">
                  <Visibility
                    fontSize="small"
                    color="primary"
                    onClick={() => {
                      rowData.reportType === "Inventory Report"
                        ? (() => {
                          setSelectedTenant({ _id: rowData?.tenantId });
                          handleSetReport(rowData?.reportId, "preview");
                        })()
                        : window.open(
                          `/view-pdf/${rowData?.reportId}`,
                          "_blank"
                        );
                    }}
                    className="cursor-pointer"
                  />
                </Tooltip>
                <Tooltip title="Edit">
                  <Edit
                    fontSize="small"
                    color="primary"
                    onClick={onTenantEdit && (() => onTenantEdit(cellData))}
                    className="cursor-pointer"
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <DeleteForeverRounded
                    fontSize="small"
                    color="error"
                    className="cursor-pointer"
                    onClick={onTenantDelete && (() => onTenantDelete(cellData))}
                  />
                </Tooltip>
                {rowData.status === "sent" && (
                  <Tooltip title="Resend Signature Email">
                    <Send
                      fontSize="small"
                      className="cursor-pointer text-blue-300"
                      onClick={() =>
                        handleSendSigature(rowData, rowData?.reportId)
                      }
                    />
                  </Tooltip>
                )}
                {rowData.status === "signed" && (
                  <Tooltip title="Inspector Comments">
                    <a
                      href={
                        rowData.tenancyType === "HMO"
                          ? `${window.location.pathname.split("/")[0]
                          }/inspect/${rowData.reportId}?id=${rowData.tenantId
                          }`
                          : `${window.location.pathname.split("/")[0]
                          }/inspect/${rowData.reportId}`
                      }
                      target="_blank"
                    >
                      <Visibility
                        fontSize="small"
                        className="cursor-pointer"
                        onClick={() => handleTenantFeedback(rowData)}
                      />
                    </a>
                  </Tooltip>
                )}
              </div>,
              td
            ),
        },
        {
          targets: [
            type === "Reports" && 2,
            (type === "Templates" || type === "View Reports") && 1,
          ],
          width: 100,
          className: "center",
          createdCell: (td, cellData, rowData) =>
            ReactDOM.render(
              <div
                id={rowData.id}
                onClick={() => {
                  cellData.func(cellData.item);
                }}
                style={{
                  color: "#212121",
                  cursor: "pointer",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {
                  new Date(cellData)
                    .toLocaleString("en-GB", { timeZone: "UTC" })
                    .split(",")[0]
                }
              </div>,
              td
            ),
        },
        {
          targets: [type === "Users" && columns.length - 2],
          width: 100,
          className: "center",
          createdCell: (td, cellData, rowData) =>
            ReactDOM.render(
              <div
                id={rowData.id}
                onClick={() => {
                  cellData.func(cellData.item);
                }}
                style={{
                  color: "#212121",
                  cursor: "pointer",
                  display: 'flex',
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {
                  new Date(cellData)
                    .toLocaleString("en-GB", { timeZone: "UTC" })
                    .split(",")[0]
                }
              </div>,
              td
            ),
        },
        { targets: [type === "Edit_Tenants" && 0], className: "hidden" },
        {
          targets: [type === "Settings" && columns.length - 1],
          width: 180,
          className: "center",
          createdCell: (td, cellData, rowData) =>
            ReactDOM.render(
              <div
                id={rowData.id}
                className="flex gap-2"
                style={{
                  color: "#212121",
                  cursor: "pointer",
                }}
              >
                <EditRounded
                  color="primary"
                  onClick={() =>
                    cellData.handleEditDelete(cellData.item, "edit")
                  }
                />
                <DeleteForeverRounded
                  color="error"
                  onClick={() =>
                    cellData.handleEditDelete(cellData.item, "delete")
                  }
                />
              </div>,
              td
            ),
        },
        {
          targets: [(type === "Customers" && columns.length - 3), (type === "Customers" && columns.length - 2), (type === "Customers" && columns.length - 6),
          (type === 'Properties' && columns.length - 2), (type === 'Properties' && columns.length - 4), (type === 'Properties' && columns.length - 5), (type === 'Properties' && columns.length - 7),
          (type === 'Reports' && columns.length - 7), (type === 'Templates' && 2),
          (type === 'Tenants' && columns.length - 2), (type === 'Tenants' && columns.length - 3), (type === 'Tenants' && columns.length - 4), (type === 'Tenants' && columns.length - 5),
          ],
          width: 100,
          className: "center",
          createdCell: (td, cellData, rowData) =>
            ReactDOM.render(
              <span className="text-center flex items-center justify-center">{cellData}</span>,
              td
            ),
        },
      ],
      scrollY: `${ht / 2}`,
      destroy: true, // I think some clean up is happening here
    });
    table.on("click", "td.dt-control", function (e) {
      let tr = e.target.closest("tr");
      let row = table.row(tr);
      const menu = document.getElementById(`menu_${row[0][0]}`);
      if (menu) {
        if (menu.style.display === "flex") {
          row.child.hide();
          menu.style.display = "none";
        } else {
          row.child("").show();
          let menus = document.querySelectorAll('[id^="menu"]');
          menus.forEach((item) => (item.style.display = "none"));
          menu.style.display = "flex";
          menu.style.flexDirection = "column";
          row.child.hide();
        }
      }
    });
    // // Extra step to do extra clean-up.
    return function () {
      table.destroy();
    };
  }, [columns, data, ht, navigate, type, user]);

  const reloadTableData = (data) => {
    const table = $(".data-table-wrapper").find("table").DataTable();
    table.clear();
    table.rows.add(data);
    table.draw();
  };

  useEffect(() => {
    reloadTableData(data);
  }, [data]);

  const handleEmailOpen = async (id) => {
    setEmailLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/account/report/${id}/email`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = response.data;
      setTenants(data?.tenant);
      setContacts(data?.customer);
      triggerToast("Contacts and Tenants loaded successfully", "success");
    } catch (error) {
      console.log(error);
    } finally {
      setEmailLoading(false);
    }
  };

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [inputEmail, setInputEmail] = useState("");
  const [customEmails, setCustomEmails] = useState([]);

  const handleCustomEmailAdd = () => {
    if (!validateEmail(inputEmail)) {
      triggerToast("Please enter a valid email", "warning");
      return;
    }
    setCustomEmails((customEmails) => [...customEmails, inputEmail]);
    setInputEmail("");
  };

  const handleCustomEmailDelete = (email) => {
    setCustomEmails(customEmails.filter((e) => e !== email));
  };

  const handleSendEmail = async () => {
    let checkedItems = [];
    const filteredContacts = contacts.filter((item) =>
      selectedContacts.includes(item.email)
    );
    const filteredTenants = tenants.filter((item) =>
      selectedTenants.includes(item.email)
    );
    checkedItems = [...filteredContacts, ...filteredTenants];
    customEmails.map((email) => checkedItems.push({ email: email }));
    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/account/report/${currentReportId}/email`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({ payload: checkedItems }),
      };
      const res = await axios.request(config);
      triggerToast("Email sent successfully", "success");
      handleEmailClose();
    } catch (error) {
      triggerToast(error?.response?.data?.message, "error");
    }
  };
  const handleSendSigature = async (tenant, reportId) => {
    let checkedItems = [];
    console.log(tenant);
    const filteredTenants = tenants.filter((item) =>
      selectedTenants.includes(item.email)
    );
    checkedItems = [...filteredTenants];
    if (tenant) checkedItems.push(tenant);
    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/account/report/${currentReportId || reportId
          }/signature`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({ payload: checkedItems }),
      };
      const res = await axios.request(config);
      triggerToast("Signature sent successfully", "success");
      setSignatureOpen(false);
    } catch (error) {
      triggerToast(error?.response?.data?.message, "error");
    }
  };

  const handleEmailClose = () => {
    setContacts([]);
    setTenants([]);
    setCurrentReportId("");
    setSelectedContacts([]);
    setSelectedTenants([]);
    setInputEmail("");
    setCustomEmails([]);
    setEmailOpen(false);
  };

  const handleCheckboxClick = (type, item) => {
    if (type === "contact") {
      if (selectedContacts.includes(item)) {
        setSelectedContacts(selectedContacts.filter((i) => i !== item));
      } else {
        setSelectedContacts([...selectedContacts, item]);
      }
    } else if (type === "tenant") {
      if (selectedTenants.includes(item)) {
        setSelectedTenants(selectedTenants.filter((i) => i !== item));
      } else {
        setSelectedTenants([...selectedTenants, item]);
      }
    }
  };

  return (
    <div className="w-full">
      <Modal
        open={popupOpen}
        onClose={handlePopupClose}
        className="flex   items-center"
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
          ) : isTenancyTypeHMO && type !== "Edit_Tenants" ? (
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
                  className={`${report?.type === "sent" || report?.status === "approved"
                    ? "flex"
                    : "hidden"
                    } grid gap-y-8 gap-x-32 grid-cols-3`}
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
          <div className="flex   w-full items-center">
            <button className="primary-button" onClick={handlePdfPreview}>
              {previewType === "preview" ? "Preview Report" : "Download Report"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        open={cloneReportPopupOpen}
        onClose={handleCloneReportPopupClose}
        className="w-screen h-screen flex items-center  "
      >
        <div className="bg-white w-fit h-fit p-8 pt-6 flex flex-col gap-8 rounded-md">
          <span className="text-[#010101 text-[22px] font-semibold">
            Clone Report {currentReport && currentReport?.ref_number}
          </span>
          <div className="flex flex-col gap-3">
            {cloneReportData?.map((data) => (
              <div
                key={data?.name}
                className={`${data[
                  currentReport?.report_type?.toLowerCase().replace(/\s/g, "")
                ]
                  ? "flex"
                  : "hidden"
                  } gap-16 items-center`}
              >
                <span className="font-medium text-base w-[160px]">
                  {data?.title}
                </span>
                <div className="flex gap-8 items-center">
                  <Checkbox
                    label="Content"
                    value={cloneReportFormData[data?.name]}
                    handleChange={(e) =>
                      setCloneReportFormData({
                        ...cloneReportFormData,
                        [data.name]: e.target.checked,
                      })
                    }
                  />
                  {data?.images && (
                    <Checkbox
                      label="Images"
                      value={cloneReportFormData[`${data?.name}_images`]}
                      handleChange={(e) =>
                        setCloneReportFormData({
                          ...cloneReportFormData,
                          [`${data?.name}_images`]: e.target.checked,
                        })
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            className="primary-button mx-auto"
            onClick={handleCloneReport}
          >
            Clone
          </button>
        </div>
      </Modal>
      <Dialog open={previewPdfDialogOpen} onClose={handlePreviewPdfDialogClose}>
        {previewLoading ? (
          <div className="flex md:w-[500px] h-[100px] px-8 pt-8 mb-4 items-center   overflow-hidden">
            <LoadingAnimation />
          </div>
        ) : (
          <>
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
          </>
        )}
      </Dialog>
      <table
        className="display dt-responsive align"
        width="100%"
        id="table"
        ref={tableRef}
      ></table>
      <Modal
        open={emailOpen}
        onClose={handleEmailClose}
        className="flex   items-center"
      >
        <div
          className={`flex flex-col ${emailLoading ? "items-center" : "items-start"
            } bg-white w-[767px] h-fit p-8 pt-6 gap-8 rounded-md`}
        >
          {emailLoading ? (
            <LoadingAnimation />
          ) : (
            <>
              <div className="flex w-full">
                <span className="flex-1 text-[#010101 text-[22px] font-semibold">
                  Who do you want to email this report to?
                </span>
                <button onClick={handleEmailClose} className="text-[#090909]">
                  <CloseRounded />
                </button>
              </div>
              <div className="flex gap-6 w-full flex-col">
                <span className="font-semibold text-lg">Contacts</span>
                <div className="grid grid-cols-3 gap-x-32 gap-y-8">
                  {contacts?.map((item, index) => (
                    <div className="flex gap-6 items-center">
                      <input
                        type="checkbox"
                        className={`w-4 h-4 bg-[#FEFEFF] ${selectedContacts.includes(item.email)
                          ? ""
                          : "borderless-checkbox"
                          } shadow-sm shadow-gray-300`}
                        value={selectedContacts.includes(item.email)}
                        onClick={() =>
                          handleCheckboxClick("contact", item.email)
                        }
                      />
                      <span className="font-normal text-[16px]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-6 w-full flex-col">
                <span className="font-semibold text-lg">Tenants</span>
                <div className="grid gap-y-8 gap-x-32 grid-cols-3">
                  {tenants?.map((item, index) => (
                    <div className="flex gap-6 items-center">
                      <input
                        type="checkbox"
                        className={`w-4 h-4 bg-[#FEFEFF] ${selectedTenants.includes(item.email)
                          ? ""
                          : "borderless-checkbox"
                          } shadow-sm shadow-gray-300`}
                        value={selectedTenants.includes(item.email)}
                        onClick={() =>
                          handleCheckboxClick("tenant", item.email)
                        }
                      />
                      <span className="font-normal text-[16px]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full flex flex-col gap-3">
                <span className="font-semibold text-lg">
                  Enter Custom Email
                </span>
                <div className="w-full flex gap-4 items-center">
                  <Input
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                  />
                  <Add
                    className="cursor-pointer"
                    onClick={handleCustomEmailAdd}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {customEmails.map((email) => (
                    <div className="flex gap-2 items-center">
                      <span key={email} className="font-normal text-[16px]">
                        {email}
                      </span>
                      <DeleteForeverRounded
                        color="error"
                        className="cursor-pointer"
                        fontSize="small"
                        onClick={() => handleCustomEmailDelete(email)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full flex  ">
                <button
                  className="text-sm font-medium border bg-coolBlue text-white px-4 rounded-lg shadow-md w-[190px] py-4"
                  onClick={handleSendEmail}
                >
                  Email Report
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
      <Modal
        open={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        className="flex   items-center"
      >
        <div
          className={`flex flex-col ${emailLoading ? "items-center" : "items-start"
            } bg-white w-[767px] h-fit p-8 pt-6 gap-8 rounded-md`}
        >
          {emailLoading ? (
            <LoadingAnimation />
          ) : (
            <>
              <div className="flex w-full">
                <span className="flex-1 text-[#010101 text-[22px] font-semibold">
                  Who do you want to send this report for signature to?
                </span>
                <button
                  onClick={() => setSignatureOpen(false)}
                  className="text-[#090909]"
                >
                  <CloseRounded />
                </button>
              </div>
              <div className="flex gap-6 w-full flex-col">
                <span className="font-semibold text-lg">Tenants</span>
                <div className="grid gap-y-8 gap-x-32 grid-cols-3">
                  {tenants?.map((item, index) => (
                    <div className="flex gap-6 items-center">
                      <input
                        type="checkbox"
                        className={`w-4 h-4 bg-[#FEFEFF] ${selectedTenants.includes(item.email)
                          ? ""
                          : "borderless-checkbox"
                          } shadow-sm shadow-gray-300`}
                        value={selectedTenants.includes(item.email)}
                        onClick={() =>
                          handleCheckboxClick("tenant", item.email)
                        }
                      />
                      <span className="font-normal text-[16px]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full flex  ">
                <button
                  className="text-sm font-medium border bg-coolBlue text-white px-4 rounded-lg shadow-md w-[190px] py-4"
                  onClick={() => handleSendSigature()}
                >
                  Send for Signature
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
      <Modal open={open} onClose={handleClose}>
        <div className="flex justify-end mt-24 md:mt-0">
          <div className="flex   items-center w-full md:w-[calc(100%_-_245px)] h-screen">
            <div className="w-3/4 flex items-start gap-2">
              <img src={currentImage} alt="property" className="rounded-md" />
              <button onClick={handleClose} className="text-white">
                <CloseRounded />
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <AlertDialog
        open={deleteReportDialogOpen}
        handleClose={handleDeleteReportDialogClose}
        accept={deleteDialogAccept}
        content={deleteDialogContent}
      />
    </div>
  );
};

export default Tbl;
