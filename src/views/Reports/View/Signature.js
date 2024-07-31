import {
  CheckOutlined,
  ChevronLeftRounded,
  EditOutlined,
} from "@mui/icons-material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Input from "../../../components/Input/Input";
import ReactSignatureCanvas from "react-signature-canvas";
import { API_URL } from "../../../utils/constants";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAuthState } from "../../../contexts/authContext";
import { useReportState } from "../../../contexts/reportContext";
import { useToastState } from "../../../contexts/toastContext";

const SignatureView = ({ handleSignatureClose }) => {
  const {
    state: { item },
  } = useLocation();
  const { token } = useAuthState();
  const { getDocLink, getSignature, sign, getCurrentReportStatus } =
    useReportState();
  const { triggerToast } = useToastState();

  useEffect(() => {
    if (sign.length > 0) {
      setName(sign[0].metadata.name);
      setDate(sign[0].metadata.date);
    } else {
      setName("");
      setDate("");
    }
  }, [sign]);

  let sigCanvas = useRef({});
  const [signature, setSignature] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [editSign, setEditSign] = useState(false);

  const handleSignChange = (url) => {
    const file = new File([url], "signature");
    setSignature(file);
  };

  const formatIntoPng = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      return dataURL;
    }
  };

  const clearSignPad = () => {
    setSignature("");
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const editSignature = () => {
    setName("");
    setDate("");
    setSignature("");
    setEditSign(true);
  };

  const _submitSignature = useCallback(async () => {
    if (name === "" || date === "" || signature === "") {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("photo", signature);
      let secure_url = getDocLink(formData, "photo");
      secure_url.then(async (res) => {
        try {
          const response = await axios.post(
            `${API_URL}/account/report_response`,
            {
              report_id: item._id,
              entity_type: "signature",
              metadata: {
                date,
                name,
                signature: res,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = await response.data;
          triggerToast("Signature added successfully!", "success");
          getSignature(item._id);
          getCurrentReportStatus(item._id);
          handleSignatureClose();
        } catch (error) {
          triggerToast(error.response.data.message, "error");
        }
      });
    } catch (error) {
      triggerToast("File upload failed", "error");
    }
  }, [
    date,
    item,
    name,
    token,
    triggerToast,
    getDocLink,
    signature,
    getSignature,
    getCurrentReportStatus,
  ]);

  const _updateSignature = useCallback(async () => {
    if (name === "" || date === "" || signature === "") {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("photo", signature);
      let secure_url = getDocLink(formData, "photo");
      secure_url.then(async (res) => {
        try {
          const response = await axios.put(
            `${API_URL}/account/report_response/${sign[0]._id}`,
            {
              report_id: item._id,
              entity_type: "signature",
              metadata: {
                date,
                name,
                signature: res,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = await response.data;
          triggerToast("Signature updated successfully!", "success");
          getSignature(item._id);
          handleSignatureClose();
        } catch (error) {
          triggerToast(error.response.data.message, "error");
        }
      });
      setEditSign(false);
    } catch (error) {
      triggerToast("File upload failed", "error");
    }
  }, [
    date,
    item,
    name,
    token,
    triggerToast,
    getDocLink,
    signature,
    getSignature,
    sign,
  ]);

  return (
    <div className="flex justify-end mt-24 md:mt-0">
      <div className="flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] md:px-4 bg-[#fff] h-screen overflow-y-scroll pt-4 md:pt-10">
        {" "}
        <div className="flex gap-4 items-center mx-4 md:mx-8">
          <button onClick={handleSignatureClose}>
            <ChevronLeftRounded className="text-coolBlue" fontSize="large" />{" "}
          </button>
          <span className="font-bold text-base md:text-xl text-[#212121]">
            Signature
          </span>
        </div>
        <div className="flex gap-8 mx-4 md:mx-8 flex-col md:flex-row">
          <Input
            header={"Enter date"}
            type={"date"}
            placeholder={"Enter date"}
            name="date_checked"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            required={true}
            disabled={sign.length > 0 && !editSign ? true : false}
          />
          <Input
            header={"Enter name"}
            type={"text"}
            placeholder={"Enter name"}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true}
            disabled={sign.length > 0 && !editSign ? true : false}
          />
        </div>
        <div className="flex flex-col gap-4 mx-4 md:mx-8 mb-40 md:mb-0">
          <div className="flex justify-between md:items-center gap-4 flex-col md:flex-row">
            <span className="text-sm text-[#282828] font-semibold">
              Signature <span className="text-red-700 text-sm">*</span>{" "}
            </span>
            <div className="flex flex-col md:flex-row gap-4">
              {sigCanvas &&
                sigCanvas?.current &&
                Object.keys(sigCanvas?.current)?.length > 0 && (
                  <button className="secondary-button" onClick={clearSignPad}>
                    Clear Sign Pad
                  </button>
                )}
              {sign.length > 0 && (
                <button className="secondary-button" onClick={editSignature}>
                  <EditOutlined fontSize={"smallTbl"} /> Edit Signature
                </button>
              )}
            </div>
          </div>
          {sign.length > 0 && !editSign ? (
            <div className="w-full bg-white">
              <img src={sign[0].metadata.signature} alt="sign" />
            </div>
          ) : (
            <div className="w-full bg-gray-100 rounded-lg relative">
              {signature === "" && (
                <span className="absolute top-4 left-4 text-[#A0A0A0] text-sm">
                  Scribble to add signature
                </span>
              )}
              <ReactSignatureCanvas
                ref={sigCanvas}
                onEnd={() => handleSignChange(formatIntoPng())}
                penColor="black"
                canvasProps={{
                  width: 1000,
                  height: 350,
                  className: "sigCanvas",
                }}
              />
            </div>
          )}
          {sign.length === 0 && (
            <div className="w-full flex justify-center md:justify-end mb-10">
              <button className="primary-button" onClick={_submitSignature}>
                <CheckOutlined /> Save
              </button>
            </div>
          )}
          {sign.length > 0 && editSign && (
            <div className="w-full flex justify-center md:justify-end mb-10">
              <button className="primary-button" onClick={_updateSignature}>
                <CheckOutlined /> Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignatureView;
