import { CheckOutlined, ChevronLeftRounded, DeleteForeverRounded } from "@mui/icons-material";
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


const FireAlarmView = ({ handleFireAlarmClose, fireAlarmQuestions }) => {
  const {
    state: { item },
  } = useLocation();
  const { token, user } = useAuthState();
  const { triggerToast } = useToastState();
  const {
    getDocLink,
    getFireAlarmResponse,
    fireAlarm,
    getCurrentReportStatus,
  } = useReportState();

  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState("");
  const [questions, setQuestions] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    if (fireAlarm.length > 0) {
      setPhotos(fireAlarm[0].metadata.images);
      setComments(fireAlarm[0].metadata.comment);
      setQuestions(fireAlarm[0].metadata.response);
      setId(fireAlarm[0]._id);
    } else {
      setPhotos([]);
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
          `${API_URL}/account/report_response`,
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
        getCurrentReportStatus(item._id);
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, triggerToast, getFireAlarmResponse, item, getCurrentReportStatus]
  );

  const updateFireAlarmCompliance = useCallback(
    async (body) => {
      try {
        const response = await axios.put(
          `${API_URL}/account/report_response/${id}`,
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
      report_id: item._id,
      entity_type: "h_s_compliance",
      metadata: {
        comment: comments,
        images: photos,
        response: questions,
      },
    });
    setPhotos([]);
    setComments("");
    setQuestions([]);
    handleFireAlarmClose();
  };

  const _updateFireAlarmCompliance = () => {
    updateFireAlarmCompliance({
      report_id: item._id,
      entity_type: "h_s_compliance",
      metadata: {
        comment: comments,
        images: photos,
        response: questions,
      },
    });
    setId("");
    handleFireAlarmClose();
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: {
      "image/*": [],
    },
    onDropAccepted: (files) => {
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("photo", file);
        let secure_url = getDocLink(formData, "photo");
        secure_url.then((res) => setPhotos((photos) => [...photos, res]));
      });
    },
  });

  const deletePhoto = (url) => {
    setPhotos(photos.filter((photo) => photo !== url));
    triggerToast("Save form now to see changes!", "info");
  };

  const [deletePhotoDialogOpen, setDeletePhotoDialogOpen] = useState(false);
  const handleDeletePhotoDialogOpen = () => setDeletePhotoDialogOpen(true);
  const handleDeletePhotoDialogClose = () => setDeletePhotoDialogOpen(false);

    return (
        <div className='flex justify-end mt-24 md:mt-0'>
            <div className='flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] bg-[#fff] md:px-4 h-screen overflow-y-scroll pt-4 md:pt-10'>                <div className='flex gap-4 items-center mx-4 md:mx-8'>
                    <button onClick={handleFireAlarmClose}>
                        <ChevronLeftRounded className='text-coolBlue' fontSize='large' />
                    </button>
                    <span className='font-bold text-base md:text-xl text-[#212121]'>Compliance Overview</span>
                </div>

                <div className='flex flex-col gap-8 md:bg-[#fff] mx-4 md:mx-5 md:p-4 mb-40 md:mb-0'>
                    <div className='flex flex-col md:flex-row gap-6'>

                        <div className='flex flex-col w-full md:w-fit md:basis-1/2 gap-4 md:gap-2'>
                            <span className='font-medium text-sm text-[#282828]'>Questions</span>
                            <div className='flex flex-col gap-8 md:bg-white md:p-4'>
                                {fireAlarm.length > 0 && fireAlarm[0].metadata.response.length > 0 ?
                                    questions.map((question, idx) => <div key={idx} className='flex flex-col gap-4' >
                                        <span className='text-sm text-[#282828] font-medium'>{idx + 1}. {question.question.split('_')[0]}</span>
                                        <div className='flex flex-col md:flex-row gap-1 md:gap-32 text-sm px-4'>
                                            <div className='flex items-center gap-2 '>
                                                <input type="radio" id={`Yes_${idx}`} name={question.question} className='cursor-pointer' value="Yes" onChange={addAnswer} checked={question.answer === 'Yes'} />
                                                <label htmlFor={`Yes_${idx}`} className='text-sm text-[#4D4D4D] cursor-pointer' >Yes</label>
                                            </div>
                                            <div className='flex items-center gap-2 '>
                                                <input type="radio" id={`No_${idx}`} name={question.question} className='cursor-pointer' value="No" onChange={addAnswer} checked={question.answer === 'No'} />
                                                <label htmlFor={`No_${idx}`} className='text-sm text-[#4D4D4D] cursor-pointer'  >No</label>
                                            </div>
                                            <div className='flex items-center gap-2 '>
                                                <input type="radio" id={`N/A_${idx}`} name={question.question} className='cursor-pointer' value="N/A" onChange={addAnswer} checked={question.answer === 'N/A'} />
                                                <label htmlFor={`N/A_${idx}`} className='text-sm text-[#4D4D4D] cursor-pointer' >N/A</label>
                                            </div>
                                        </div>
                                    </div>)
                                    :
                                    fireAlarmQuestions.map((question, idx) => <div key={idx} className='flex flex-col gap-4' >
                                        <span className='text-[#282828] text-sm font-semibold'>{idx + 1}. {question}</span>
                                        <div className='flex gap-32 text-sm'>
                                            <div className='flex items-center gap-2 '>
                                                <input type="radio" id={`Yes_${idx}`} name={`${question}_${idx}`} className='cursor-pointer' value="Yes" onChange={addAnswer} />
                                                <label htmlFor={`Yes_${idx}`} className='text-sm text-[#4D4D4D] cursor-pointer' >Yes</label>
                                            </div>
                                            <div className='flex items-center gap-2 '>
                                                <input type="radio" id={`No_${idx}`} name={`${question}_${idx}`} className='cursor-pointer' value="No" onChange={addAnswer} />
                                                <label htmlFor={`No_${idx}`} className='text-sm text-[#4D4D4D] cursor-pointer'  >No</label>
                                            </div>
                                            <div className='flex items-center gap-2 '>
                                                <input type="radio" id={`N/A_${idx}`} name={`${question}_${idx}`} className='cursor-pointer' value="N/A" onChange={addAnswer} />
                                                <label htmlFor={`N/A_${idx}`} className='text-sm text-[#4D4D4D] cursor-pointer' >N/A</label>
                                            </div>
                                        </div>
                                    </div>)
                                }
                            </div>
                        </div>

                        <div className='flex flex-col w-full md:w-fit md:basis-1/2 gap-6'>

                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center gap-4'>
                                    <span className='font-medium text-sm text-[#282828]'>Photo</span>
{/*                                    {photos.length > 0 && <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <img src={upload} alt="upload" className='bg-white p-1 shadow-lg rounded-sm cursor-pointer' />
                                    </div>}*/}
                                </div>
                                <div className='h-[200px] mb-4 border-2 border-dashed bg-white flex flex-col justify-center items-center gap-4 cursor-pointer' {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <img src={upload_photo} alt="upload_photo" />
                                    <span className='text-sm text-[#686868] font-medium'>Click or drag a file to this area to upload.</span>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {photos.map(item => <div className='flex bg-white items-center
                                        justify-start flex-wrap gap-4'>
                                        <div className='lex flex-col items-end p-1 w-full rounded-lg bg-gray-100 p-2'>
                                            {user?.role !== 'customer' && <div className={'flex justify-end w-full items-end'}>
                                                <button onClick={handleDeletePhotoDialogOpen}>
                                                <DeleteForeverRounded className={'text-coolBlue'}/>
                                            </button>
                                            </div>}
                                            <img src={item.length > 0 ? item : photo_bw} alt="photo_bw" className='h-[120px] w-[120px] object-cover rounded-lg' />
                                            <AlertDialog open={deletePhotoDialogOpen} handleClose={handleDeletePhotoDialogClose} accept={() => deletePhoto(item)} content={"Delete this photo?"} />
                                        </div>
                                    </div>)}
                                </div>
                            </div>

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

                    <div className='w-full flex justify-center md:justify-end mb-10'>
                        {id !== '' ?
                            <button className='primary-button' onClick={_updateFireAlarmCompliance} ><CheckOutlined /> Save</button>
                            :
                            <button className='primary-button' onClick={_addFireAlarmCompliance} ><CheckOutlined /> Save</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FireAlarmView;
