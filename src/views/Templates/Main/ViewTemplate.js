import { ChevronLeftRounded, CreateRounded } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import Input from "../../../components/Input/Input";
import CustomSelect from "../../../components/CustomSelect";
import axios from "axios";
import { API_URL } from "../../../utils/constants";
import { useAuthState } from "../../../contexts/authContext";
import { useToastState } from "../../../contexts/toastContext";
import AutoComplete from "../../../components/AutoComplete";
import { useLocation, useNavigate } from "react-router-dom";
import DatePickerComponent from "../../../components/DatePicker";
import AlertDialog from "../../../components/AlertDialog";
import dayjs from "dayjs";
import { useAllDataState } from "../../../contexts/allDataContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import { useTemplateState } from "../../../contexts/templateContext";

const PreviewTemplate = () => {
  const navigate = useNavigate();
  const {
    state: { item, isEdit },
  } = useLocation();

  const { token, user } = useAuthState();
  const { triggerToast } = useToastState();
  const { getTemplates } = useTemplateState();
  const { getProperties } = useAllDataState();

  const [form, setForm] = useState({
    template_type: "",
    template_name: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        template_type: item?.template_type,
        template_name: item?.template_name,
      });
    } else {
      setForm({
        template_type: "",
        template_name: "",
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
    setForm({ ...form, [name]: value });
  };

  const updateTemplate = useCallback(async () => {
    if (form?.template_name === "" || form?.template_type === "") {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    try {
      const response = await axios.put(
        `${API_URL}/account/template/${item._id}`,
        {
          template_name: form?.template_name,
          template_type: form.template_type,
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
      navigate("/templates");
      triggerToast("Template updated successfully!", "success");
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [token, triggerToast, form, getTemplates, item, navigate, getProperties]);

  const deleteTemplate = useCallback(async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/account/template/${item._id}`,
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
  }, [getTemplates, item, token, triggerToast, navigate, getProperties]);

  const [deleteTemplateDialogOpen, setdeleteTemplateDialogOpen] =
    useState(false);
  const handledeleteTemplateDialogOpen = () =>
    setdeleteTemplateDialogOpen(true);
  const handledeleteTemplateDialogClose = () =>
    setdeleteTemplateDialogOpen(false);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={"pb-1"}>
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center mt-6">
          <button onClick={() => navigate(-1)}>
            <ChevronLeftRounded className={"text-coolBlue"} fontSize="large" />
          </button>
          <span className="flex mx-auto text-xl md:text-2xl  font-bold">
            {isEditing ? "Edit" : "View"} Template
          </span>
        </div>
        <div>
          <div className="flex justify-between gap-2 mt-6">
            {user?.role !== "customer" ? (
              <button
                className="secondary-button disabled:text-gray-400 disabled:cursor-not-allowed mr-2"
                onClick={handledeleteTemplateDialogOpen}
              >
                <DeleteOutlineIcon className={"mr-1"} fontSize={"small"} />{" "}
                Delete Template
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
          <Input
            header={"Template Name"}
            type={"text"}
            placeholder={"Template Name"}
            name="template_name"
            value={form.template_name}
            onChange={handleChange}
            required={true}
            disabled={!isEditing}
          />

          <AutoComplete
            required={true}
            header={"Template Type"}
            name="template_type"
            disabled={!isEditing}
            value={form.template_type}
            handleChange={(e, val) => setForm({ ...form, template_type: val })}
            data={["Checkout", "Inventory", "Inspection"]}
            placeholder={"Template Type"}
          />
        </div>
      </div>
      <div className={"flex justify-between md:justify-end items-center my-10"}>
        <button
          className="primary-button disabled:text-gray-400 disabled:cursor-not-allowed"
          onClick={updateTemplate}
          disabled={!isEditing}
        >
          <CheckIcon fontSize={"small"} /> Save
        </button>
      </div>

      <AlertDialog
        open={deleteTemplateDialogOpen}
        handleClose={handledeleteTemplateDialogClose}
        accept={deleteTemplate}
        content={"Delete this template?"}
      />
    </div>
  );
};

export default PreviewTemplate;
