import { ChevronLeftRounded, CreateRounded } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import Input from "../../../components/Input/Input";
import CustomSelect from "../../../components/CustomSelect";
import axios from "axios";
import { API_URL } from "../../../utils/constants";
import { useAuthState } from "../../../contexts/authContext";
import { useToastState } from "../../../contexts/toastContext";
import { useReportState } from "../../../contexts/reportContext";
import AutoComplete from "../../../components/AutoComplete";
import { useLocation, useNavigate } from "react-router-dom";
import DatePickerComponent from "../../../components/DatePicker";
import AlertDialog from "../../../components/AlertDialog";
import dayjs from "dayjs";
import { useAllDataState } from "../../../contexts/allDataContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";

const PreviewReport = () => {
  const navigate = useNavigate();
  const {
    state: { item, isEdit },
  } = useLocation();

  const { token, user } = useAuthState();
  const { triggerToast } = useToastState();
  const { getReports, propertyList, reportTypeList, clerkList } =
    useReportState();
  const { getProperties } = useAllDataState();

  const [form, setForm] = useState({
    property: "",
    ref_number: "",
    report_type: "",
    template_type: "",
    date: dayjs(new Date()),
    start_time: "",
    finish_time: "",
    agent_clerk: "",
    tenancy: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        property: item?.property_id?.address,
        ref_number: item?.ref_number,
        report_type: item?.report_type,
        template_type: item?.template_type,
        date: item?.date,
        start_time: item?.start_time,
        finish_time: item?.end_time,
        agent_clerk: item?.assigned_person_id?._id,
        tenancy: item?.tenancy ? "Yes" : "No",
      });
    } else {
      setForm({
        property: "",
        ref_number: "",
        report_type: "",
        template_type: "",
        date: dayjs(new Date()),
        start_time: "",
        finish_time: "",
        agent_clerk: "",
        tenancy: "",
      });
    }
    if (isEdit) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [item, isEdit]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "start_time") {
      let end_time_hr = (Number(value.split(":")[0]) + 2) % 24;
      setForm({
        ...form,
        finish_time: `${end_time_hr > 9 ? end_time_hr : `0${end_time_hr}`}:${
          value.split(":")[1]
        }`,
        start_time: value,
      });
      return;
    } else if (name === "finish_time") {
      if (value < form.start_time) {
        triggerToast("End time should not be before start time!", "warning");
        return;
      }
    }
    setForm({ ...form, [name]: value });
  };

  const updateReport = useCallback(async () => {
    if (
      form.property === "" ||
      form.ref_number === "" ||
      form.report_type === "" ||
      form.date === "" ||
      form.start_time === "" ||
      form.finish_time === "" ||
      form.agent_clerk === "" ||
      form.tenancy === ""
    ) {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    try {
      const response = await axios.put(
        `${API_URL}/account/report/${item._id}`,
        {
          property_id: propertyList.filter(
            (property) => property.address === form.property
          )[0]._id,
          ref_number: form.ref_number,
          date: form.date,
          start_time: form.start_time,
          end_time: form.finish_time,
          tenancy: form.tenancy === "Yes" ? true : false,
          report_type: form.report_type,
          template_type: form.template_type,
          assigned_person_id: form.agent_clerk,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.data;
      getReports();
      getProperties();
      if (form.tenancy === "Yes") {
        navigate("/tenants/add", {
          state: { property: form.property, report: form.ref_number },
        });
      } else {
        navigate("/reports");
      }
      triggerToast("Report updated successfully!", "success");
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [
    token,
    triggerToast,
    propertyList,
    form,
    getReports,
    item,
    navigate,
    getProperties,
  ]);

  const deleteReport = useCallback(async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/account/report/${item._id}`,
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
      navigate("/reports");
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [getReports, item, token, triggerToast, navigate, getProperties]);

  const [deleteReportDialogOpen, setDeleteReportDialogOpen] = useState(false);
  const handleDeleteReportDialogOpen = () => setDeleteReportDialogOpen(true);
  const handleDeleteReportDialogClose = () => setDeleteReportDialogOpen(false);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={"pb-1"}>
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center mt-6">
          <button onClick={() => navigate(-1)}>
            <ChevronLeftRounded className={"text-coolBlue"} fontSize="large" />
          </button>
          <span className="flex mx-auto text-xl md:text-2xl  font-bold">
            {isEditing ? "Edit" : "View"} Report
          </span>
        </div>
        <div>
          <div className="flex justify-between gap-2 mt-6">
            {user?.role !== "customer" ? (
              <button
                className="secondary-button disabled:text-gray-400 disabled:cursor-not-allowed mr-2"
                onClick={handleDeleteReportDialogOpen}
              >
                <DeleteOutlineIcon className={"mr-1"} fontSize={"small"} />{" "}
                Delete Report
              </button>
            ) : (
              <div></div>
            )}
            {!isEditing && (
              <button
                className="secondary-button"
                onClick={() => setIsEditing(true)}
              >
                <CreateRounded fontSize="small" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-10">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <AutoComplete
            required={true}
            header={"Property"}
            name="property"
            disabled={!isEditing}
            value={form.property}
            handleChange={(e, val) => setForm({ ...form, property: val })}
            data={[...propertyList.map((property) => property.address), ""]}
            placeholder={"Property"}
          />

          <Input
            header={"Ref Number"}
            type={"text"}
            placeholder={"Ref number"}
            name="ref_number"
            value={form.ref_number}
            onChange={handleChange}
            required={true}
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <CustomSelect
            required={true}
            header={"Report Type"}
            name="report_type"
            disabled={!isEditing}
            value={form.report_type}
            handleChange={handleChange}
            data={reportTypeList}
            placeholder={"Report type"}
          />

          <Input
            header={"Template Type"}
            type={"text"}
            placeholder={"Template type"}
            name="template_type"
            value={form.template_type}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <DatePickerComponent
            header={"Date"}
            placeholder={"Date"}
            name="date"
            value={form.date}
            onChange={(val) => setForm({ ...form, date: val })}
            required={true}
            disabled={!isEditing}
          />
          <Input
            header={"Start Time"}
            type={"time"}
            placeholder={"Start time"}
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required={true}
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Input
            header={"Finish Time"}
            type={"time"}
            placeholder={"Finish time"}
            name="finish_time"
            value={form.finish_time}
            onChange={handleChange}
            required={true}
            disabled={!isEditing}
          />

          <CustomSelect
            required={true}
            header={"Agent/Clerk"}
            name="agent_clerk"
            disabled={!isEditing}
            value={form.agent_clerk}
            handleChange={handleChange}
            data={clerkList.map((clerk) => {
              return {
                label: clerk.name,
                value: clerk._id,
              };
            })}
            placeholder={"Agent/Clerk"}
            DataType="2"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 md:w-[calc(50%_-_8px)]">
          <CustomSelect
            required={true}
            header={"Tenancy"}
            name="tenancy"
            disabled={!isEditing}
            value={form.tenancy}
            handleChange={handleChange}
            data={["Yes", "No"]}
            placeholder={"Tenancy"}
          />
        </div>
      </div>
      <div className={"flex justify-between md:justify-end items-center my-10"}>
        <button
          className="primary-button disabled:text-gray-400 disabled:cursor-not-allowed"
          onClick={updateReport}
          disabled={!isEditing}
        >
          <CheckIcon fontSize={"small"} /> Save
        </button>
      </div>

      <AlertDialog
        open={deleteReportDialogOpen}
        handleClose={handleDeleteReportDialogClose}
        accept={deleteReport}
        content={"Delete this report?"}
      />
    </div>
  );
};

export default PreviewReport;
