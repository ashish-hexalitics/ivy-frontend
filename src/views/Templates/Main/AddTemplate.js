import { CheckOutlined, ChevronLeftRounded } from "@mui/icons-material";
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
import dayjs from "dayjs";
import { useAllDataState } from "../../../contexts/allDataContext";
import { useTemplateState } from "../../../contexts/templateContext";

const AddTemplateView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { token } = useAuthState();
  const { triggerToast } = useToastState();
  const {
    getTemplates,
    propertyList,
    reportTypeList,
    clerkList,
    allTemplates,
  } = useTemplateState();

  const [form, setForm] = useState({
    template_type: "",
    template_name: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const addTemplate = useCallback(async () => {
    if (form.template_name === "" || form.template_type === "") {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/account/template`,
        {
          template_name: form?.template_name,
          template_type: form?.template_type,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.data;
      getTemplates();
      triggerToast("Template created successfully!", "success");
      navigate("/templates");
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [token, triggerToast, form, navigate]);

  return (
    <div className="pb-1 pt-6">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronLeftRounded className={"text-coolBlue"} fontSize="large" />
          </button>
          <span className="flex mx-auto text-xl md:text-2xl font-bold">
            Add Template
          </span>
        </div>
      </div>

      <div className="flex flex-col mt-8 gap-4">
        <div className={`flex flex-col md:flex-row justify-between gap-4`}>
          <Input
            header={"Template Name"}
            type={"text"}
            placeholder={"Template Name"}
            name="template_name"
            value={form.template_name}
            onChange={handleChange}
            required
          />

          <CustomSelect
            required={true}
            header={"Template Type"}
            name="template_type"
            value={form.template_type}
            handleChange={handleChange}
            data={["Inventory", "Checkout", "Inspection"]}
            placeholder={"Template type"}
          />
        </div>
      </div>
      <div className="flex my-10 justify-center md:justify-end">
        <button className="primary-button" onClick={addTemplate}>
          <CheckOutlined /> Save
        </button>
      </div>
    </div>
  );
};

export default AddTemplateView;
