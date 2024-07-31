import { CheckOutlined, ChevronLeftRounded } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import Input from "../../../components/Input/Input";
import CustomSelect from "../../../components/CustomSelect";
import axios from "axios";
import { API_URL } from "../../../utils/constants";
import { useAuthState } from "../../../contexts/authContext";
import { useToastState } from "../../../contexts/toastContext";
import { useReportState } from "../../../contexts/reportContext";
import { useTemplateState } from "../../../contexts/templateContext";
import AutoComplete from "../../../components/AutoComplete";
import { useLocation, useNavigate } from "react-router-dom";
import DatePickerComponent from "../../../components/DatePicker";
import dayjs from "dayjs";
import { useAllDataState } from "../../../contexts/allDataContext";

const AddReportView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { templates } = useTemplateState();

  const { token } = useAuthState();
  const { triggerToast } = useToastState();
  const { getReports, propertyList, reportTypeList, clerkList, allReports } =
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
    previous_inventory_reports: "",
  });
  const [linkedInventoryReports, setLinkedInventoryReports] = useState([]);

  useEffect(() => {
    if (state) {
      setForm({ ...form, property: state });
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
        previous_inventory_reports: "",
      });
    }
  }, [state]);

  useEffect(() => {
    const filteredReports = allReports.filter(
      (it) =>
        it.property_id.address === form.property &&
        it.report_type.toLowerCase().replace(/\s/g, "") === "inventoryreport"
    );
    setLinkedInventoryReports(filteredReports);
  }, [form.property]);

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

  useEffect(() => {
    if (form?.report_type.toLowerCase().replace(/\s/g, "") === "checkoutreport")
      setForm({ ...form, tenancy: "No" });
  }, [form?.report_type]);
  const getPreviousInventoryReportsData = () => {
    const data = ["None"];
    linkedInventoryReports.forEach((it) => data.push(it.ref_number));
    return data;
  };

  const addReport = useCallback(async () => {
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
      const filteredPreviousInventoryReports = linkedInventoryReports.filter(
        (it) => it.ref_number === form.previous_inventory_reports
      );
      const linkedInventoryReportId = filteredPreviousInventoryReports.length
        ? filteredPreviousInventoryReports[0]._id
        : null;
      const response = await axios.post(
        `${API_URL}/account/report`,
        {
          property_id: propertyList.filter(
            (property) => property.address === form.property
          )[0]._id,
          ref_number: form.ref_number,
          date: new Date(form.date),
          start_time: form.start_time,
          end_time: form.finish_time,
          tenancy: form.tenancy === "Yes" ? true : false,
          report_type: form.report_type,
          template_type: form.template_type,
          assigned_person_id: form.agent_clerk,
          linked_inventory_report: linkedInventoryReportId,
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
      triggerToast("Report created successfully!", "success");
      if (form.tenancy === "Yes") {
        navigate("/tenants/add", {
          state: { property: form.property, report: form.ref_number },
        });
      } else {
        navigate("/reports");
      }
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [
    token,
    triggerToast,
    propertyList,
    form,
    getReports,
    navigate,
    getProperties,
  ]);

  return (
    <div className="pb-1 pt-6">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronLeftRounded className={"text-coolBlue"} fontSize="large" />
          </button>
          <span className="flex mx-auto text-xl md:text-2xl font-bold">
            Add Report
          </span>
        </div>
      </div>

      <div className="flex flex-col mt-8 gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <AutoComplete
            required={true}
            header={"Property"}
            name="property"
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
          />
        </div>

        <div
          className={`flex flex-col md:flex-row justify-between gap-4 ${
            form.report_type.toLowerCase().replace(/\s/g, "") ===
            "checkoutreport"
              ? ""
              : "md:w-1/2"
          }`}
        >
          <CustomSelect
            required={true}
            header={"Report Type"}
            name="report_type"
            value={form.report_type}
            handleChange={handleChange}
            data={reportTypeList}
            placeholder={"Report type"}
          />

          {form.report_type.toLowerCase().replace(/\s/g, "") ===
            "checkoutreport" && (
            <CustomSelect
              required={true}
              header={"Compare against previous inventory"}
              name="previous_inventory_reports"
              value={form.previous_inventory_reports}
              handleChange={handleChange}
              data={getPreviousInventoryReportsData()}
              placeholder={"Previous Inventory Reports"}
            />
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <DatePickerComponent
            header={"Date"}
            placeholder={"Date"}
            name="date"
            value={form.date}
            onChange={(val) => setForm({ ...form, date: val })}
            required={true}
          />
          <CustomSelect
            required={true}
            header={"Template Name"}
            name="template_type"
            value={form.template_type}
            handleChange={handleChange}
            data={[
              "None",
              ...templates
                .filter(
                  (t) =>
                    t.templateType.toLowerCase() ===
                    form.report_type.split(" ")[0].toLowerCase()
                )
                .map((t) => t?.templateName),
            ]}
            placeholder={"Template name"}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Input
            header={"Start Time"}
            type={"time"}
            placeholder={"Start time"}
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required={true}
          />

          <Input
            header={"Finish Time"}
            type={"time"}
            placeholder={"Finish time"}
            name="finish_time"
            value={form.finish_time}
            onChange={handleChange}
            required={true}
          />
        </div>

        <div className={`flex flex-col md:flex-row justify-between gap-4`}>
          <CustomSelect
            required={true}
            header={"Tenancy"}
            name="tenancy"
            value={form.tenancy}
            handleChange={handleChange}
            data={["Yes", "No"]}
            placeholder={"Tenancy"}
            disabled={
              form.report_type.toLowerCase().replace(/\s/g, "") ===
              "checkoutreport"
            }
          />

          <CustomSelect
            required={true}
            header={"Agent/Clerk"}
            name="agent_clerk"
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
      </div>
      <div className="flex my-10 justify-center md:justify-end">
        <button className="primary-button" onClick={addReport}>
          <CheckOutlined /> Save
        </button>
      </div>
    </div>
  );
};

export default AddReportView;
