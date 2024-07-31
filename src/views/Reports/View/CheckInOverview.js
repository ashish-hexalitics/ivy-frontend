import {CheckOutlined, ChevronLeftRounded} from "@mui/icons-material";
import React, {useCallback, useEffect, useState} from "react";
import Input from "../../../components/Input/Input";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {API_URL} from "../../../utils/constants";
import {useAuthState} from "../../../contexts/authContext";
import {useToastState} from "../../../contexts/toastContext";
import {useReportState} from "../../../contexts/reportContext";

const CheckInOverviewView = ({
                                 handleCheckInOverviewClose,
                                 checkInOverviewQuestions,
                                 reportType,
                             }) => {
    const {
        state: {item},
    } = useLocation();
    const {token} = useAuthState();
    const {triggerToast} = useToastState();
    const {
        getCheckInOverviewResponse,
        checkInOverview,
        getCurrentReportStatus,
    } = useReportState();

    const [comments, setComments] = useState("");
    const [propertyInfo, setPropertyInfo] = useState("")
    const [questions, setQuestions] = useState([]);
    const [id, setId] = useState("");


    useEffect(() => {
        if (checkInOverview?.length > 0) {
            setComments(checkInOverview.filter(it => (it.entity_type === "check_in_overview" || it.entity_type === "check_out_overview" || it.entity_type === "inspection_overview"))[0]?.metadata?.comment)
            setQuestions(checkInOverview.filter(it => (it.entity_type === "check_in_overview" || it.entity_type === "check_out_overview" || it.entity_type === "inspection_overview"))[0]?.metadata?.response)
            setPropertyInfo(checkInOverview.filter(it => (it.entity_type === "check_in_overview" || it.entity_type === "check_out_overview" || it.entity_type === "inspection_overview"))[0]?.metadata?.property_info)
            setId(checkInOverview.filter(it => (it.entity_type === "check_in_overview" || it.entity_type === "check_out_overview" || it.entity_type === "inspection_overview"))[0]?._id)
        } else {
            setComments('')
            setQuestions([])
            setPropertyInfo('')
            setId('')
        }
    }, [checkInOverview])

    const addAnswer = (e) => {
        const {name, value} = e.target
        let question = questions?.filter(ques => ques.question === name)
        let default_ans = checkInOverviewQuestions?.filter(ques => ques.question === name.split('_')[0])[0]?.answer
        if (question?.length === 0)
            setQuestions([...questions, {
                question: name,
                answer: value,
                if_yes_in_green: default_ans
            }])
        else {
            setQuestions(questions?.map(ques => {
                if (ques.question === name) {
                    ques.answer = value
                }
                return ques
            }))
        }
    }

    const addCheckInOverviewResponse = useCallback(
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
                triggerToast("Check in overview added successfully!", "success");
                getCheckInOverviewResponse(item._id, reportType);
                getCurrentReportStatus(item._id);
            } catch (error) {
                triggerToast(error.response.data.message, "error");
            }
        },
        [
            token,
            triggerToast,
            getCheckInOverviewResponse,
            item,
            getCurrentReportStatus,
            reportType
        ]
    );

    const updateCheckInOverviewResponse = useCallback(
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
                getCheckInOverviewResponse(item._id, reportType);
                getCurrentReportStatus(item._id);
                triggerToast("Check in overview updated successfully!", "success");
            } catch (error) {
                triggerToast(error.response.data.message, "error");
            }
        },
        [token, triggerToast, id, getCheckInOverviewResponse, item, reportType]
    );

    const _addCheckInOverviewResponse = () => {
        if (questions?.length !== checkInOverviewQuestions?.length) {
            triggerToast("Please answer all the questions", "error");
            return;
        }
        addCheckInOverviewResponse({
            report_id: item._id,
            entity_type: reportType?.toLowerCase().replace(/\s/g, "") ===
            "inspectionreport"
                ? "inspection_overview" : reportType?.toLowerCase().replace(/\s/g, "") ===
                "checkoutreport" ? "check_out_overview"
                    : "check_in_overview",
            metadata: {
                comment: comments,
                property_info: propertyInfo,
                response: questions,
            },
        });
        setComments("");
        setPropertyInfo("");
        setQuestions([]);
        handleCheckInOverviewClose();
    };

    const _updateCheckInOverviewResponse = () => {
        updateCheckInOverviewResponse({
            report_id: item._id,
            entity_type: reportType?.toLowerCase().replace(/\s/g, "") ===
            "inspectionreport"
                ? "inspection_overview" : reportType?.toLowerCase().replace(/\s/g, "") ===
                "checkoutreport" ? "check_out_overview"
                    : "check_in_overview",
            metadata: {
                comment: comments,
                property_info: propertyInfo,
                response: questions,
            },
        });
        setId("");
        handleCheckInOverviewClose();
    };

    return (
   <div className='flex justify-end mt-24 md:mt-0'>
            <div
                className="flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] bg-[#fff] md:px-4 h-screen overflow-y-scroll pt-4 md:pt-10">
                <div className="flex gap-4 items-center mx-4 md:mx-8">
                    <button onClick={handleCheckInOverviewClose}>
                        <ChevronLeftRounded className={'text-coolBlue'} fontSize="large"/>
                    </button>
                    <span className="font-bold text-base md:text-xl text-[#212121]">
            Check In Overview
          </span>
                </div>

                <div className="flex flex-col gap-8 md:bg-[#fff] mx-4 md:mx-5 md:p-4 mb-40 md:mb-0">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col w-full md:w-fit md:basis-1/2 gap-4 md:gap-2">
                            <span className="font-medium text-sm text-[#282828]">Questions</span>
                            <div className="flex flex-col gap-8 md:bg-white md:p-4">
                                {checkInOverview?.length > 0 &&
                                checkInOverview[0]?.metadata?.response?.length > 0
                                    ? questions?.map((question, idx) => (
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
                                    : checkInOverviewQuestions?.map((question, idx) => (
                                        <div key={idx} className="flex flex-col gap-4">
                        <span className="text-[#282828] text-sm font-semibold">
                          {idx + 1}. {question.question}
                        </span>
                                            <div className="flex gap-32 text-sm">
                                                <div className="flex items-center gap-2 ">
                                                    <input
                                                        type="radio"
                                                        id={`Yes_${idx}`}
                                                        name={`${question.question}_${idx}`}
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
                                                        name={`${question.question}_${idx}`}
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
                                                        name={`${question.question}_${idx}`}
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
                            <div className="flex flex-col gap-4">
                                <Input
                                    placeholder={"Enter comments"}
                                    header={"Comments"}
                                    name="comments"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    type="textarea"
                                />
                                <Input
                                    placeholder={"Property Information"}
                                    header={"Property Information"}
                                    name="property information"
                                    value={propertyInfo}
                                    onChange={(e) => setPropertyInfo(e.target.value)}
                                    type="textarea"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center md:justify-end mb-10">
                        {id !== "" ? (
                            <button
                                className="primary-button"
                                onClick={_updateCheckInOverviewResponse}
                            >
                                <CheckOutlined  className={'mr-2'} fontSize={'small'} />
                                Save
                            </button>
                        ) : (
                            <button
                                className="primary-button"
                                onClick={_addCheckInOverviewResponse}
                            >
                                <CheckOutlined className={'mr-2'} fontSize={'small'} />
                                Save
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckInOverviewView;
