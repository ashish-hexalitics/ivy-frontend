import { CheckOutlined, ChevronLeftRounded } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import Input from "../../components/Input/Input";
import CustomSelect from "../../components/CustomSelect";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { validateEmail, validateMobile } from "../../utils/helper";
import dayjs from "dayjs";
import DatePickerComponent from "../../components/DatePicker";

const AddTenancyView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { triggerToast } = useToastState();
  const { propertyList, reports } = useReportState();
  const { getTenancies, getProperties } = useAllDataState();
  const { token } = useAuthState();

  const [form, setForm] = useState({
    property: "",
    start_date: dayjs(new Date()),
    type: "",
    report: "",
    tenants: [],
    property_id: "",
  });

  useEffect(() => {
    if (state && state.property) {
      setForm({
        ...form,
        report: state.report,
        property: state.property,
        property_id: propertyList.filter(
          (property) => property.address === state.property
        )[0]?._id,
      });
    }

    if (state && state.warning) {
      triggerToast("This report doesn't have any tenancies", "warning");
      const { propertyAddress, referenceNo } = state;
      setForm({
        ...form,
        property: propertyAddress,
        report: referenceNo,
        property_id: propertyList.filter(
          (property) => property.address === propertyAddress
        )[0]?._id,
      });
    }
  }, [state]);

  const [tenant, setTenant] = useState({
    name: "",
    email: "",
    mobile: "",
    status: "pending",
  });

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
    if (form.type === "SINGLE" && form.tenants.length > 0) {
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
    console.log(name, value);
    setForm({ ...form, [name]: value });
  };

  const addTenancy = useCallback(async () => {
    if (form.property_id === "" || form.type === "" || form.report === "") {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/account/tenancy`,
        {
          property_id: form.property_id,
          start_date: form.start_date,
          type: form.type,
          report_id: reports.filter(
            (report) => report.viewReport.item.ref_number === form.report
          )[0].viewReport.item._id,
          tenants: form.tenants,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const data = await response.data;
      setForm({
        property: "",
        start_date: new Date(),
        type: "",
        tenants: [],
      });
      getTenancies();
      getProperties();
      triggerToast("Tenancy created successfully!", "success");
      if (state && state.property) {
        navigate("/reports");
      } else navigate("/reports");
    } catch (error) {
      triggerToast("Could not create tenancy!", "error");
    }
  }, [
    token,
    form,
    triggerToast,
    getTenancies,
    navigate,
    getProperties,
    reports,
    state,
  ]);

  return (
    <div>
      <div className="flex gap-4 items-center mt-6">
        <button onClick={() => navigate(-1)}>
          <ChevronLeftRounded className="text-coolBlue" fontSize="large" />
        </button>
        <span className="text-xl md:text-2xl font-semibold md:font-bold text-[#2D3436]">
          Add Tenancy
        </span>
      </div>

      <div className="flex flex-col mt-8 gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <AutoComplete
            required={true}
            header={"Property"}
            name="property"
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
          />

          <AutoComplete
            required={true}
            header={"Report"}
            name="report"
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

      <div className="flex flex-col gap-4 mt-8">
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
            />
            <Input
              header={"Email"}
              type={"text"}
              placeholder={"Email"}
              name={`email`}
              value={tenant.email}
              onChange={(e) => setTenant({ ...tenant, email: e.target.value })}
              required={true}
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
            />
          </div>
        </div>
        <div className="w-full my-4 flex justify-center md:justify-end">
          <button
            className="secondary-button
                disabled:bg-gray-200 disabled:cursor-not-allowed"
            onClick={add_tenant}
          >
            + Add Tenant
          </button>
        </div>
      </div>

      {form.tenants.length > 0 && (
        <div className="flex flex-col gap-4 my-4">
          <span className="text-md font-bold text-[#2D3436]">
            Tenants Table
          </span>
          <div className="hidden md:block bg-white rounded-md shadow-md border border-[#eeeeee]">
            <Tbl
              height={100}
              data={form.tenants.map((tenant) => ({ ...tenant, rank: 1 }))}
              columns={TenantTableColumns}
              type="Edit_Tenants"
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

      <div className="flex my-10 justify-center md:justify-end">
        <button className="primary-button" onClick={addTenancy}>
          <CheckOutlined /> Save
        </button>
      </div>
    </div>
  );
};

export default AddTenancyView;
