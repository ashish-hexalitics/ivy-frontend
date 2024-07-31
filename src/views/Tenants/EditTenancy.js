import {
  CheckOutlined,
  ChevronLeftRounded,
  CreateRounded,
  DeleteOutlined,
} from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import Input from "../../components/Input/Input";
import CustomSelect from "../../components/CustomSelect";
import { useLocation, useNavigate } from "react-router-dom";
import { useReportState } from "../../contexts/reportContext";
import Tbl from "../../components/Table/Tbl";
import { TENANCY_TYPES, TenantTableColumns } from "./constants";
import { useToastState } from "../../contexts/toastContext";
import { useAllDataState } from "../../contexts/allDataContext";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { useAuthState } from "../../contexts/authContext";
import AutoComplete from "../../components/AutoComplete";
import AccordionTable from "../../components/Accordion";
import AlertDialog from "../../components/AlertDialog";
import { validateEmail, validateMobile } from "../../utils/helper";
import dayjs from "dayjs";
import DatePickerComponent from "../../components/DatePicker";
import { Modal } from "@mui/material";

const EditTenancyView = () => {
  const navigate = useNavigate();
  const {
    state: { item, isEdit },
  } = useLocation();

  const { triggerToast } = useToastState();
  const { propertyList, reports } = useReportState();
  const { getTenancies, getProperties } = useAllDataState();
  const { token, user } = useAuthState();

  const [form, setForm] = useState({
    property: "",
    start_date: dayjs(new Date()),
    type: "SINGLE",
    report: "",
    tenants: [],
    property_id: "",
  });

  const [tenant, setTenant] = useState({
    name: "",
    email: "",
    mobile: "",
    status: "pending",
  });

  const [editTenantForm, setEditTenantForm] = useState({
    name: "",
    email: "",
    mobile: "",
    status: "pending",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isTenantEditing, setIsTenantEditing] = useState(false);
  const [tenantEmail, setTenantEmail] = useState("");

  const onTenantEdit = (tenantEmail) => {
    if (form?.reportStatus !== "draft") {
      triggerToast(
        "Tenancy can't be edited in current report state",
        "warning"
      );
      return;
    }
    setIsTenantEditing(true);
    setIsEditing(true);
    setTenantEmail(tenantEmail);
    const tenant = form.tenants.filter(
      (tenant) => tenant.email === tenantEmail
    )[0];
    setEditTenantForm(tenant);
  };

  const onTenantDelete = (tenantEmail) => {
    if (form?.reportStatus !== "draft") {
      triggerToast(
        "Tenancy can't be edited in current report state",
        "warning"
      );
      return;
    }
    setDeleteTenantOpen(true);
    setTenantEmail(tenantEmail);
  };

  useEffect(() => {
    if (item) {
      setForm({
        property: item?.property_id?.address,
        start_date: dayjs(item?.start_date),
        type: item?.type || "SINGLE",
        report: item?.report_id?.ref_number,
        reportStatus: item?.report_id?.status,
        tenants: item?.tenants.map((tenant) => {
          return {
            name: tenant.name,
            email: tenant.email,
            mobile: tenant.mobile,
            status: tenant.status,
            tenantId: tenant._id,
            reportId: item?.report_id?._id,
            tenancyType: item?.type,
            reportType: item?.report_id?.report_type,
          };
        }),
        property_id: propertyList.filter(
          (property) => property.address === item.property
        )[0]?._id,
      });
    }
    if (isEdit) {
      if (item?.report_id?.status !== "draft") {
        triggerToast(
          "Tenancy can't be edited in current report state",
          "warning"
        );
        setIsEditing(false);
      } else setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [item, propertyList, isEdit]);

  const add_tenant = () => {
    if (tenant.name === "" || tenant.email === "") {
      triggerToast("Please input the tenant details before saving", "warning");
      return;
    }
    if (!validateEmail(tenant.email)) {
      triggerToast(`Email is not valid!`, "error");
      return;
    }
    if (tenant.mobile && !validateMobile(tenant.mobile)) {
      triggerToast(`Contact number is not valid!`, "error");
      return;
    }
    if (!isTenantEditing && form.type === "SINGLE" && form.tenants.length > 0) {
      triggerToast(
        `Only one tenant can be added for a single tenancy!`,
        "error"
      );
      return;
    }
    setForm({ ...form, tenants: [...form.tenants, tenant] });
    setTenant({ name: "", email: "", mobile: "", status: "pending" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const updateTenancy = useCallback(async () => {
    if (form?.reportStatus !== "draft") {
      triggerToast(
        "Tenancy can't be edited in current report state",
        "warning"
      );
      return;
    }
    if (form.property_id === "" || form.type === "") {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    try {
      const response = await axios.put(
        `${API_URL}/account/tenancy/${item._id}`,
        {
          property_id: form.property_id,
          start_date: form.start_date,
          type: form.type,
          tenants: form.tenants,
          report_id: reports.filter(
            (report) => report.viewReport.item.ref_number === form.report
          )[0].viewReport.item._id,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const data = await response.data;
      setForm({
        property: "",
        start_date: dayjs(new Date()),
        type: "SINGLE",
        tenants: [],
      });
      getTenancies();
      getProperties();
      navigate("/reports");
      triggerToast("Tenancy updated successfully!", "success");
    } catch (error) {
      triggerToast("Could not update tenancy!", "error");
    }
  }, [
    token,
    form,
    triggerToast,
    getTenancies,
    item,
    navigate,
    reports,
    getProperties,
  ]);

  const deleteTenant = useCallback(async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/account/tenancy/${item._id}`,
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
  }, [getTenancies, item, token, triggerToast, navigate, getProperties]);

  const [deleteTenantDialogOpen, setDeleteTenantDialogOpen] = useState(false);
  const handleDeleteTenantDialogOpen = () => setDeleteTenantDialogOpen(true);
  const handleDeleteTenantDialogClose = () => setDeleteTenantDialogOpen(false);

  const handleTenantEditFormClose = () => {
    setIsTenantEditing(false);
  };

  const [deleteTenantOpen, setDeleteTenantOpen] = useState(false);
  const handleTenantDeleteClose = () => {
    setDeleteTenantOpen(false);
    setTenantEmail("");
  };

  const deleteTenantAccept = () => {
    setIsEditing(true);
    setForm((form) => ({
      ...form,
      tenants: form.tenants.filter((t) => t.email !== tenantEmail),
    }));
  };
  return (
    <div>
      <AlertDialog
        open={deleteTenantOpen}
        handleClose={handleTenantDeleteClose}
        accept={deleteTenantAccept}
        content={"Delete this tenant?"}
      />
      <Modal
        open={isTenantEditing}
        onClose={handleTenantEditFormClose}
        className="flex w-screen h-screen justify-center items-center"
      >
        <div className="flex flex-col gap-6 bg-white w-1/2 h-fit rounded-md items-center py-4 px-9 overflow-auto">
          <span className="text-lg font-semibold md:font-bold text-[#2D3436]">
            Edit Tenants
          </span>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Input
                header={"Name"}
                type={"text"}
                placeholder={"Name"}
                name={`name`}
                value={editTenantForm.name}
                onChange={(e) =>
                  setEditTenantForm((tenant) => ({
                    ...tenant,
                    name: e.target.value,
                  }))
                }
                required={true}
              />
              <Input
                header={"Email"}
                type={"text"}
                placeholder={"Email"}
                name={`email`}
                value={editTenantForm.email}
                onChange={(e) =>
                  setEditTenantForm((tenant) => ({
                    ...tenant,
                    email: e.target.value,
                  }))
                }
                required={true}
              />
            </div>
            <div className="md:w-[calc(50%_-_8px)]">
              <Input
                header={"Mobile"}
                type={"text"}
                placeholder={"Mobile"}
                name={`mobile`}
                value={editTenantForm.mobile}
                onChange={(e) =>
                  setEditTenantForm((tenant) => ({
                    ...tenant,
                    mobile: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              setForm({
                ...form,
                tenants: form.tenants.map((t) =>
                  t.email === tenantEmail ? editTenantForm : t
                ),
              });
              setIsTenantEditing(false);
            }}
          >
            Save
          </button>
        </div>
      </Modal>
      <div className="flex flex-col md:flex-row items-start justify-between mt-6">
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronLeftRounded className="text-coolBlue" fontSize="large" />
          </button>
          <span className="text-xl md:text-2xl font-semibold md:font-bold text-[#2D3436]">
            {isEditing ? "Edit" : "View"} Tenancy
            <span className="text-xl md:text-2xl font-semibold md:font-bold  text-gray-500">
              {" "}
              / {item?.report_id?.report_type} ({item?.report_id?.ref_number}){" "}
            </span>
          </span>
        </div>
        <div
          className={
            "flex gap-2 justify-between md:justify-end md:mt-0 mt-4 w-full md:w-fit"
          }
        >
          {user?.role !== "customer" ? (
            <button
              className="secondary-button w-full md:w-auto h-[40px]"
              onClick={handleDeleteTenantDialogOpen}
            >
              <DeleteOutlined fontSize={"small"} className={"mr-2"} /> Delete
            </button>
          ) : (
            <div></div>
          )}
          {!isEditing && (
            <button
              className="items-center secondary-button w-full md:w-auto h-[40px]"
              onClick={() => {
                if (form?.reportStatus !== "draft") {
                  triggerToast(
                    "Tenancy can't be edited in current report state",
                    "warning"
                  );
                } else setIsEditing(true);
              }}
            >
              <CreateRounded fontSize={"small"} className={"mr-2"} />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col mt-8 gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <AutoComplete
            required={true}
            header={"Property"}
            name="property"
            disabled={!isEditing}
            value={form.property}
            handleChange={(e, val) =>
              setForm({
                ...form,
                property: val,
                property_id: propertyList.filter(
                  (property) => property.address === val
                )[0]?._id,
              })
            }
            data={[...propertyList.map((property) => property.address), ""]}
            placeholder={"Property"}
          />

          <DatePickerComponent
            header={"Start Date"}
            placeholder={"Start Date"}
            name="start_date"
            value={form.start_date}
            onChange={(val) => setForm({ ...form, start_date: val })}
            required={true}
            disabled={!isEditing}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <CustomSelect
            required={true}
            header={"Type"}
            name="type"
            value={form.type}
            handleChange={handleChange}
            data={TENANCY_TYPES}
            placeholder={"Type"}
            disabled={!isEditing}
          />
          <AutoComplete
            required={true}
            header={"Report"}
            name="report"
            disabled={!isEditing}
            value={form.report}
            handleChange={(e, val) => setForm({ ...form, report: val })}
            data={
              form.property === ""
                ? [""]
                : [
                  ...reports
                    .filter(
                      (report) =>
                        report?.viewReport?.item?.property_id?._id ===
                        form.property_id
                    )
                    .map((report) => report.viewReport.item.ref_number),
                  "",
                ]
            }
            placeholder={"Report"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 my-8">
        <span className="text-lg font-semibold md:font-bold text-[#2D3436]">
          Tenants
        </span>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Input
              header={"Name"}
              type={"text"}
              placeholder={"Name"}
              name={`name`}
              value={tenant.name}
              onChange={(e) => setTenant({ ...tenant, name: e.target.value })}
              required={true}
              disabled={!isEditing}
            />
            <Input
              header={"Email"}
              type={"text"}
              placeholder={"Email"}
              name={`email`}
              value={tenant.email}
              onChange={(e) => setTenant({ ...tenant, email: e.target.value })}
              required={true}
              disabled={!isEditing}
            />
          </div>
          <div className="md:w-[calc(50%_-_8px)]">
            <Input
              header={"Mobile"}
              type={"text"}
              placeholder={"Mobile"}
              name={`mobile`}
              value={tenant.mobile}
              onChange={(e) => setTenant({ ...tenant, mobile: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="w-full my-4 flex justify-center md:justify-end">
          <button
            className="secondary-button
                disabled:bg-gray-200 disabled:cursor-not-allowed"
            onClick={add_tenant}
            disabled={!isEditing}
          >
            {isTenantEditing ? "Edit Tenant" : "+ Add Tenant"}
          </button>
        </div>
      </div>
      {form.tenants.length > 0 && (
        <div className="flex flex-col gap-4">
          <span className="text-xl font-bold text-[#2D3436]">
            Tenants Table
          </span>
          <div className="hidden md:block bg-white rounded-md shadow-md border border-[#eeeeee]">
            <Tbl
              height={140}
              data={form.tenants.map((tenant, index) => ({
                ...tenant,
                rank: 1,
                name:
                  form.type === "JOINT" && index === 0
                    ? `${tenant.name} (Lead Tenant)`
                    : tenant.name,
              }))}
              columns={TenantTableColumns}
              type="Edit_Tenants"
              onTenantEdit={onTenantEdit}
              onTenantDelete={onTenantDelete}
            />
          </div>
          <div className="block md:hidden">
            <AccordionTable
              data={form.tenants.map((tenant) => ({ ...tenant, rank: 1 }))}
              type={"View Tenancy"}
            />
          </div>
        </div>
      )}

      <div className="flex justify-center my-10 md:justify-end items-center">
        <button
          className="primary-button
                disabled:bg-gray-200 disabled:cursor-not-allowed"
          onClick={updateTenancy}
          disabled={!isEditing}
        >
          <CheckOutlined /> Save
        </button>
      </div>

      <AlertDialog
        open={deleteTenantDialogOpen}
        handleClose={handleDeleteTenantDialogClose}
        accept={deleteTenant}
        content={"Delete this tenant?"}
      />
    </div>
  );
};

export default EditTenancyView;
