import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuthState } from "../../contexts/authContext";
import axios from "axios";
import { useToastState } from "../../contexts/toastContext";
import { API_URL } from "../../utils/constants";
import LoadingAnimation from "../LoadingAnimation";
import { useReportState } from "../../contexts/reportContext";
import { CircularProgress, Dialog, DialogActions } from "@mui/material";
import { DownloadOutlined } from "@mui/icons-material";
const width = window.innerWidth;

const ShowPdf = () => {
  const { reportId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tenantId = searchParams.get("id");
  const showOriginalReport = searchParams.get("original");
  const { reports } = useReportState();
  const { token } = useAuthState();
  const { triggerToast } = useToastState();
  const [pdfHtml, setPdfHtml] = useState();
  const [isLodaing, setIsLoading] = useState(false);
  const [report, setReport] = useState();
  const [propertyAddress, setPropertyAddress] = useState("");
  const [statusResponse, setStatusResponse] = useState({
    status: false,
    msg: "",
  });
  const navigate = useNavigate();
  const getSignatureStatus = async () => {
    try {
      const config = {
        method: "get",
        url: `${API_URL}/console/account/report/${reportId}/tenant/${tenantId}/status`,
      };
      const res = await axios.request(config);
      setStatusResponse({ status: res.data.status, msg: res.data.msg });
    } catch (error) {
      triggerToast(error?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    if (window.location.pathname.includes("show-report-pdf"))
      reportId && tenantId && getSignatureStatus();
  }, [
    reportId,
    tenantId,
    window.location.pathname.includes("show-report-pdf"),
  ]);

  useEffect(() => {
    setReport(
      reports.filter((report) => report.viewReport.item._id === reportId)[0]
    );
    setPropertyAddress(
      document
        .getElementById("pdf-html")
        ?.contentWindow?.document?.querySelector("#address")?.textContent
    );
    document
      .getElementById("pdf-html")
      ?.contentWindow.document?.getElementById("feedback-button")
      ?.addEventListener("click", handleApproval);
  }, [
    document
      .getElementById("pdf-html")
      ?.contentWindow?.document?.querySelector("#address")?.textContent,
    reports,
    pdfHtml,
  ]);

  useEffect(() => {
    const fetchPdfHtml = async () => {
      console.log(searchParams.get("id"));
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/account/report/preview/${reportId}${
            showOriginalReport ? `?original=${showOriginalReport}` : ""
          }${
            searchParams.get("id")
              ? `${
                  (showOriginalReport ? "&" : "?") +
                  `tenant_id=${searchParams.get("id")}`
                }`
              : ""
          }${
            window.location.pathname.includes("view-pdf")
              ? ""
              : (searchParams.get("id") || showOriginalReport ? "&" : "?") +
                `input_box=true&type=${
                  window.location.pathname.includes("inspect")
                    ? "inspector"
                    : "tenant"
                }`
          }`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        setPdfHtml(data);
        triggerToast("Report Preview Loaded Successfully", "success");
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPdfHtml();
  }, [reportId, token, tenantId]);

  const [previewLoading, setPreviewLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewPdfDialogOpen, setPreviewPdfDialogOpen] = useState(false);
  const handlePreviewPdfDialogOpen = () => setPreviewPdfDialogOpen(true);
  const handlePreviewPdfDialogClose = () => setPreviewPdfDialogOpen(false);
  const previewReport = useCallback(async () => {
    setPreviewLoading(true);
    setPreviewUrl("");
    try {
      const response = await axios.get(
        `${API_URL}/account/report/download/${reportId}`,
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
  }, [report, token, triggerToast]);

  const handleApproval = async () => {
    let elements = document
      .getElementById("pdf-html")
      ?.contentWindow?.document?.querySelectorAll(".item-comment");
    elements = Array.from(elements);
    let images = document
      .getElementById("pdf-html")
      ?.contentWindow?.document?.querySelectorAll(".feedback-image");
    images = Array.from(images);
    let imagesMapping = {};
    images = images.map((element) => {
      imagesMapping = {
        ...imagesMapping,
        [element.id.replace("img", "")]: element.src,
      };
    });
    elements = elements
      .filter(
        (elem) =>
          elem.value !== "" ||
          (imagesMapping[elem.id] && imagesMapping[elem.id] != "")
      )
      .map((element) => ({
        item_id: element.id,
        feedback: element.value,
        feedbackImg: imagesMapping[element.id] || "",
      }));
    console.log(elements);
    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/account/report/${reportId}/feedback?type=${
          window.location.pathname.includes("inspect") ? "inspector" : "tenant"
        }`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({
          payload: elements,
          tenant_id: tenantId,
          feedback: document
            ?.getElementById("pdf-html")
            ?.contentWindow?.document.getElementById("feedback-box").value,
        }),
      };
      const res = await axios.request(config);
      triggerToast("Feedback saved successfully", "success");
      navigate("/thanks");
    } catch (error) {
      triggerToast(error?.response?.data?.message, "error");
    }
  };

  console.log(width);
  return !(
    (statusResponse.status &&
      window.location.pathname.includes("show-report-pdf")) ||
    (!statusResponse.status &&
      !window.location.pathname.includes("show-report-pdf"))
  ) ? (
    statusResponse.msg ? (
      triggerToast(statusResponse.msg, "error")
    ) : (
      <></>
    )
  ) : !isLodaing ? (
    <div className="h-screen flex flex-col items-center">
      <Dialog open={previewPdfDialogOpen} onClose={handlePreviewPdfDialogClose}>
        <span className="text-lg font-semibold text-center w-[500px] h-[80px] px-8 pt-8 mb-4">
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
            className="px-6 py-2 text-base font-medium rounded-md shadow-md border border-coolBlue text-coolBlue"
            onClick={handlePreviewPdfDialogClose}
          >
            Cancel
          </button>
          <a
            className={`bg-coolBlue px-6 py-2 text-white text-base font-medium rounded-md shadow-md border`}
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handlePreviewPdfDialogClose}
          >
            View
          </a>
        </DialogActions>
      </Dialog>
      <div className="w-full flex justify-between items-center p-3 sticky bg-[#fafafa] top-0 z-10">
        <span className="font-semibold text-base flex-1 flex items-center">
          Feedback for {propertyAddress}
        </span>
        {window.location.pathname.includes("view-pdf") && (
          <button
            className={`primary-button`}
            onClick={previewReport}
            disabled={previewLoading}
          >
            <DownloadOutlined fontSize={"small"} />
            Download
            {previewLoading && (
              <CircularProgress color="primary" className="ml-2" size="1rem" />
            )}
          </button>
        )}
        {!window.location.pathname.includes("view-pdf") && (
          <button
            className={`py-2 px-12 text-white bg-coolBlue font-medium text-sm rounded-md shadow-md`}
            disabled={approvalLoading}
            onClick={(e) => {
              let elem = document
                .getElementById("pdf-html")
                ?.contentWindow?.document.getElementById("feedback-box");
              e.preventDefault();
              elem &&
                elem.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            {window.location.pathname.includes("inspect")
              ? "Confirm"
              : "Approve Report"}
            {approvalLoading && (
              <CircularProgress color="primary" className="ml-2" size="1rem" />
            )}
          </button>
        )}
      </div>
      {/* <div
        className="w-full min-h-screen overflow-x-scroll"
        dangerouslySetInnerHTML={{ __html: pdfHtml }}
      ></div> */}
      <iframe id="pdf-html" srcDoc={pdfHtml} width="100%" height="100%" />
    </div>
  ) : (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingAnimation />
    </div>
  );
};

export default ShowPdf;
