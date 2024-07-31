import {
  CheckOutlined,
  ChevronLeftRounded,
  DeleteForeverRounded,
} from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { photo_bw, upload, upload_photo } from "../../../assets";
import Input from "../../../components/Input/Input";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../utils/constants";
import { useAuthState } from "../../../contexts/authContext";
import { useToastState } from "../../../contexts/toastContext";
import { useReportState } from "../../../contexts/reportContext";
import AlertDialog from "../../../components/AlertDialog";
import { useTemplateState } from "../../../contexts/templateContext";

const FireAlarmView = ({ handleFireAlarmClose, fireAlarmQuestions }) => {
  const {
    state: { item },
  } = useLocation();
  const { token, user } = useAuthState();
  const { triggerToast } = useToastState();
  const { getDocLink, getFireAlarmResponse, fireAlarm } = useTemplateState();

  // const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState("");
  const [questions, setQuestions] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    if (fireAlarm.length > 0) {
      // setPhotos(fireAlarm[0].metadata.images);
      setComments(fireAlarm[0].metadata.comment);
      setQuestions(fireAlarm[0].metadata.response);
      setId(fireAlarm[0]._id);
    } else {
      // setPhotos([]);
      setComments("");
      setQuestions([]);
      setId("");
    }
  }, [fireAlarm]);

  const addAnswer = (e) => {
    const { name, value } = e.target;
    let question = questions.filter((ques) => ques.question === name);
    if (question.length === 0)
      setQuestions([
        ...questions,
        {
          question: name,
          answer: value,
        },
      ]);
    else {
      setQuestions(
        questions.map((ques) => {
          if (ques.question === name) {
            ques.answer = value;
          }
          return ques;
        })
      );
    }
  };

  const addFireAlarmCompliance = useCallback(
    async (body) => {
      try {
        const response = await axios.post(
          `${API_URL}/account/template_response`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        triggerToast("H&S compliance added successfully!", "success");
        getFireAlarmResponse(item._id);
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, triggerToast, getFireAlarmResponse, item]
  );

  const updateFireAlarmCompliance = useCallback(
    async (body) => {
      try {
        const response = await axios.put(
          `${API_URL}/account/template_response/${id}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        getFireAlarmResponse(item._id);
        triggerToast("H&S compliance updated successfully!", "success");
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, triggerToast, id, getFireAlarmResponse, item]
  );

  const _addFireAlarmCompliance = () => {
    addFireAlarmCompliance({
      template_id: item._id,
      entity_type: "h_s_compliance",
      metadata: {
        comment: comments,
        response: questions,
      },
    });
    setComments("");
    setQuestions([]);
    handleFireAlarmClose();
  };

  const _updateFireAlarmCompliance = () => {
    updateFireAlarmCompliance({
      template_id: item._id,
      entity_type: "h_s_compliance",
      metadata: {
        comment: comments,
        response: questions,
      },
    });
    setId("");
    handleFireAlarmClose();
  };

  // const { getRootProps, getInputProps } = useDropzone({
  //   multiple: true,
  //   accept: {
  //     "image/*": [],
  //   },
  //   onDropAccepted: (files) => {
  //     files.map(async (file) => {
  //       const formData = new FormData();
  //       formData.append("photo", file);
  //       let secure_url = getDocLink(formData, "photo");
  //       secure_url.then((res) => setPhotos((photos) => [...photos, res]));
  //     });
  //   },
  // });

  // const deletePhoto = (url) => {
  //   setPhotos(photos.filter((photo) => photo !== url));
  //   triggerToast("Save form now to see changes!", "info");
  // };

  const [deletePhotoDialogOpen, setDeletePhotoDialogOpen] = useState(false);
  const handleDeletePhotoDialogOpen = () => setDeletePhotoDialogOpen(true);
  const handleDeletePhotoDialogClose = () => setDeletePhotoDialogOpen(false);

  return (
    <div className="flex justify-end mt-24 md:mt-0">
      <div className="flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] bg-[#fff] md:px-4 h-screen overflow-y-scroll pt-4 md:pt-10">
        {" "}
        <div className="flex gap-4 items-center mx-4 md:mx-8">
          <button onClick={handleFireAlarmClose}>
            <ChevronLeftRounded className="text-coolBlue" fontSize="large" />
          </button>
          <span className="font-bold text-base md:text-xl text-[#212121]">
            Compliance Overview
          </span>
        </div>
        <div className="flex flex-col gap-8 md:bg-[#fff] mx-4 md:mx-5 md:p-4 mb-40 md:mb-0">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col w-full md:w-fit md:basis-1/2 gap-4 md:gap-2">
              <span className="font-medium text-sm text-[#282828]">
                Questions
              </span>
              <div className="flex flex-col gap-8 md:bg-white md:p-4">
                {fireAlarm.length > 0 &&
                fireAlarm[0].metadata.response.length > 0
                  ? questions.map((question, idx) => (
                      <div key={idx} className="flex flex-col gap-4">
                        <span className="text-sm text-[#282828] font-medium">
                          {idx + 1}. {question.question.split("_")[0]}
                        </span>
                        <div className="flex flex-col md:flex-row gap-1 md:gap-32 text-sm px-4">
                          <div className="flex items-center gap-2 ">
                            <input
                              type="radio"
                              id={`Yes_${idx}`}
                              name={question.question}
                              className="cursor-pointer"
                              value="Yes"
                              onChange={addAnswer}
                              checked={question.answer === "Yes"}
                            />
                            <label
                              htmlFor={`Yes_${idx}`}
                              className="text-sm text-[#4D4D4D] cursor-pointer"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center gap-2 ">
                            <input
                              type="radio"
                              id={`No_${idx}`}
                              name={question.question}
                              className="cursor-pointer"
                              value="No"
                              onChange={addAnswer}
                              checked={question.answer === "No"}
                            />
                            <label
                              htmlFor={`No_${idx}`}
                              className="text-sm text-[#4D4D4D] cursor-pointer"
                            >
                              No
                            </label>
                          </div>
                          <div className="flex items-center gap-2 ">
                            <input
                              type="radio"
                              id={`N/A_${idx}`}
                              name={question.question}
                              className="cursor-pointer"
                              value="N/A"
                              onChange={addAnswer}
                              checked={question.answer === "N/A"}
                            />
                            <label
                              htmlFor={`N/A_${idx}`}
                              className="text-sm text-[#4D4D4D] cursor-pointer"
                            >
                              N/A
                            </label>
                          </div>
                        </div>
                      </div>
                    ))
                  : fireAlarmQuestions.map((question, idx) => (
                      <div key={idx} className="flex flex-col gap-4">
                        <span className="text-[#282828] text-sm font-semibold">
                          {idx + 1}. {question}
                        </span>
                        <div className="flex gap-32 text-sm">
                          <div className="flex items-center gap-2 ">
                            <input
                              type="radio"
                              id={`Yes_${idx}`}
                              name={`${question}_${idx}`}
                              className="cursor-pointer"
                              value="Yes"
                              onChange={addAnswer}
                            />
                            <label
                              htmlFor={`Yes_${idx}`}
                              className="text-sm text-[#4D4D4D] cursor-pointer"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center gap-2 ">
                            <input
                              type="radio"
                              id={`No_${idx}`}
                              name={`${question}_${idx}`}
                              className="cursor-pointer"
                              value="No"
                              onChange={addAnswer}
                            />
                            <label
                              htmlFor={`No_${idx}`}
                              className="text-sm text-[#4D4D4D] cursor-pointer"
                            >
                              No
                            </label>
                          </div>
                          <div className="flex items-center gap-2 ">
                            <input
                              type="radio"
                              id={`N/A_${idx}`}
                              name={`${question}_${idx}`}
                              className="cursor-pointer"
                              value="N/A"
                              onChange={addAnswer}
                            />
                            <label
                              htmlFor={`N/A_${idx}`}
                              className="text-sm text-[#4D4D4D] cursor-pointer"
                            >
                              N/A
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            <div className="flex flex-col w-full md:w-fit md:basis-1/2 gap-6">
              <div>
                <Input
                  placeholder={"Enter comments"}
                  header={"Comments"}
                  name="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  type="textarea"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center md:justify-end mb-10">
            {id !== "" ? (
              <button
                className="primary-button"
                onClick={_updateFireAlarmCompliance}
              >
                <CheckOutlined /> Save
              </button>
            ) : (
              <button
                className="primary-button"
                onClick={_addFireAlarmCompliance}
              >
                <CheckOutlined /> Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireAlarmView;
