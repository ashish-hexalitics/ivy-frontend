import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useReportState } from "../../contexts/reportContext";
import { photo_bw, upload, upload_photo } from "../../assets";
import {
  AddCircleOutlineOutlined,
  AddOutlined,
  CheckOutlined,
  ChevronLeftRounded,
  CloseRounded,
  DeleteForeverRounded,
} from "@mui/icons-material";
import Input from "../../components/Input/Input";
import { Divider } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { useAuthState } from "../../contexts/authContext";
import { useToastState } from "../../contexts/toastContext";
import {
  validateEmail,
  validateMobile,
  validatePassword,
} from "../../utils/helper";
import { useAllDataState } from "../../contexts/allDataContext";
import Tbl from "../../components/Table/Tbl";
import { useNavigate } from "react-router-dom";
import { NotesColumns } from "./constants";
import AccordionTable from "../../components/Accordion";
import AlertDialog from "../../components/AlertDialog";
import UploadPhoto from "../../components/Upload/UploadPhoto";
import PasswordChecker from "../../components/PasswordChecker";

const AddCustomerView = () => {
  const navigate = useNavigate();

  const { getDocLink } = useReportState();
  const { token } = useAuthState();
  const { triggerToast } = useToastState();
  const { getCustomers } = useAllDataState();

  const [form, setForm] = useState({
    logo: [],
    name: "",
    address_1: "",
    address_2: "",
    town: "",
    postcode: "",
    email: "",
    phone: "",
    company_no: "",
    vat_no: "",
    website: "",
    contact: [],
    notes: [],
    password: "",
    confirm_password: "",
  });

  const add_another_contact = () =>
    setForm({
      ...form,
      contact: [
        ...form.contact,
        { contact_name: "", contact_email: "", contact_mobile: "" },
      ],
    });

  const [note, setNote] = useState("");
  const add_notes = () => {
    if (note === "") {
      triggerToast("Add note to save!", "warning");
      return;
    }
    setForm({
      ...form,
      notes: [
        ...form.notes,
        {
          note,
          date: new Date()
            .toLocaleString("en-GB", { timeZone: "UTC" })
            .split(",")[0],
          time: new Date()
            .toLocaleString("en-GB", { timeZone: "UTC" })
            .split(",")[1],
        },
      ],
    });
    setNote("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("contact_name")) {
      let _idx = name.split("_")[2];
      setForm({
        ...form,
        contact: form.contact.map((item, idx) =>
          idx === Number(_idx)
            ? {
              contact_name: value,
              contact_email: item.contact_email,
              contact_mobile: item.contact_mobile,
            }
            : item
        ),
      });
      return;
    } else if (name.includes("contact_email")) {
      let _idx = name.split("_")[2];
      setForm({
        ...form,
        contact: form.contact.map((item, idx) =>
          idx === Number(_idx)
            ? {
              contact_name: item.contact_name,
              contact_email: value,
              contact_mobile: item.contact_mobile,
            }
            : item
        ),
      });
      return;
    } else if (name.includes("contact_mobile")) {
      let _idx = name.split("_")[2];
      setForm({
        ...form,
        contact: form.contact.map((item, idx) =>
          idx === Number(_idx)
            ? {
              contact_name: item.contact_name,
              contact_email: item.contact_email,
              contact_mobile: value,
            }
            : item
        ),
      });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [],
    },
    onDropAccepted: (file) => {
      const formData = new FormData();
      formData.append("photo", file[0]);
      let secure_url = getDocLink(formData, "photo");
      secure_url.then((res) => setForm({ ...form, logo: [...form.logo, res] }));
    },
  });

  const deletePhoto = (url) => {
    setForm({ ...form, logo: form.logo.filter((item) => item !== url) });
    triggerToast("Save form now to see changes!", "info");
  };

  const [deletePhotoDialogOpen, setDeletePhotoDialogOpen] = useState(false);
  const handleDeletePhotoDialogOpen = () => setDeletePhotoDialogOpen(true);
  const handleDeletePhotoDialogClose = () => setDeletePhotoDialogOpen(false);

  const addCustomer = useCallback(async () => {
    if (
      form.name === "" ||
      form.password === "" ||
      form.confirm_password === ""
    ) {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    if (form.password !== form.confirm_password) {
      triggerToast("Passwords does not match!", "error");
      return;
    }
    if (form.email && !validateEmail(form.email)) {
      triggerToast("Email is not valid!", "error");
      return;
    }
    if (form.phone && !validateMobile(form.phone)) {
      triggerToast("Contact number is not valid!", "error");
      return;
    }
    if (!validatePassword(form.password)) {
      triggerToast("Password is not valid!", "error");
      return;
    }
    let flag = false;
    if (form.contact.length > 0) {
      form.contact.forEach((item, idx) => {
        if (!validateEmail(item.contact_email)) {
          triggerToast(`#${idx + 1} Email is not valid!`, "error");
          flag = true;
        }
      });
    }
    if (flag) {
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/account/customer`,
        {
          name: form.name,
          address: form.address_1 + form.address_2,
          town: form.town,
          postcode: form.postcode,
          email: form.email,
          contact_number: form.phone,
          vet_no: form.vat_no,
          company_no: form.company_no,
          logo: form.logo,
          password: form.password,
          contact_information: form.contact
            .filter(
              (item) => item.contact_name !== "" && item.contact_email !== ""
            )
            .map((item) => {
              return {
                name: item.contact_name,
                mobile: item.contact_mobile,
                email: item.contact_email,
              };
            }),
          notes: form.notes,
          website_url: form.website,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const data = await response.data;
      setForm({
        logo: [],
        name: "",
        address_1: "",
        address_2: "",
        town: "",
        postcode: "",
        email: "",
        phone: "",
        company_no: "",
        vat_no: "",
        website: "",
        contact: [],
        notes: [],
        password: "",
        confirm_password: "",
      });
      getCustomers();
      navigate("/customers");
      triggerToast("Customer created successfully!", "success");
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [token, form, triggerToast, getCustomers, navigate]);

  const deleteNote = (note) => {
    setForm({ ...form, notes: form.notes.filter(_note => _note.note !== note.note && _note.date && note.date) })
  }

  return (
    <div className="pb-1">
      <div className="flex gap-4 items-center mt-6">
        <button onClick={() => navigate(-1)}>
          <ChevronLeftRounded className="text-coolBlue" fontSize="large" />
        </button>
        <span className="text-xl md:text-2xl font-semibold md:font-bold text-[#2D3436]">
          Add Customer
        </span>
      </div>

      <div className="flex flex-col gap-4 mt-8 mb-10">
        <UploadPhoto
          form={form}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          handleDeletePhotoDialogOpen={handleDeletePhotoDialogOpen}
          deletePhotoDialogOpen={deletePhotoDialogOpen}
          handleDeletePhotoDialogClose={handleDeletePhotoDialogClose}
          deletePhoto={deletePhoto}
          itemName={"logo"}
          title={"Logo"}
        />

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Input
            header={"Customer Name"}
            type={"text"}
            placeholder={"Customer Name"}
            name="name"
            value={form.name}
            onChange={handleChange}
            required={true}
          />
          <Input
            header={"Address 1"}
            type={"text"}
            placeholder={"Address 1"}
            name="address_1"
            value={form.address_1}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between gap-4 flex-col md:flex-row ">
          <Input
            header={"Address 2"}
            type={"text"}
            placeholder={"Address 2"}
            name="address_2"
            value={form.address_2}
            onChange={handleChange}
          />
          <Input
            header={"Town"}
            type={"text"}
            placeholder={"Town"}
            name="town"
            value={form.town}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between gap-4 flex-col md:flex-row ">
          <Input
            header={"Postcode"}
            type={"text"}
            placeholder={"Postcode"}
            name="postcode"
            value={form.postcode}
            onChange={handleChange}
          />
          <Input
            header={"Email Address"}
            type={"text"}
            placeholder={"Email Address"}
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between gap-4 flex-col md:flex-row ">
          <Input
            header={"Phone Number"}
            type={"text"}
            placeholder={"Phone Number"}
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <Input
            header={"Company No"}
            type={"text"}
            placeholder={"Company No"}
            name="company_no"
            value={form.company_no}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between gap-4 flex-col md:flex-row ">
          <Input
            header={"Vat No"}
            type={"text"}
            placeholder={"Vat No"}
            name="vat_no"
            value={form.vat_no}
            onChange={handleChange}
          />
          <Input
            header={"Website"}
            type={"text"}
            placeholder={"Website"}
            name="website"
            value={form.website}
            onChange={handleChange}
          />
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-4 my-4">
        <span className="text-lg font-bold mt-4 text-[#2D3436]">Contact</span>
        {form.contact.map((item, idx) => (
          <div className="flex justify-between items-end mt-4 md:items-center gap-4 flex-col md:flex-row ">
            <button
              className="md:hidden md w-[30px] rounded-full p-1"
              onClick={() =>
                setForm({
                  ...form,
                  contact: form.contact.filter((_, index) => index !== idx),
                })
              }
            >
              <CloseRounded className={"text-coolBlue"} fontSize="small" />
            </button>
            <Input
              header={"Contact Name"}
              type={"text"}
              placeholder={"Contact Name"}
              name={`contact_name_${idx}`}
              value={form.contact[idx].contact_name}
              onChange={handleChange}
            />
            <Input
              header={"Contact Email"}
              type={"text"}
              placeholder={"Contact Email"}
              name={`contact_email_${idx}`}
              value={form.contact[idx].contact_email}
              onChange={handleChange}
            />
            <Input
              header={"Contact Mobile"}
              type={"text"}
              placeholder={"Contact Mobile"}
              name={`contact_mobile_${idx}`}
              value={form.contact[idx].contact_mobile}
              onChange={handleChange}
            />
            <button
              className="hidden md:block w-[30px] text-coolBlue rounded-full p-1"
              onClick={() =>
                setForm({
                  ...form,
                  contact: form.contact.filter((_, index) => index !== idx),
                })
              }
            >
              <CloseRounded fontSize="small" />
            </button>
          </div>
        ))}
        <button
          onClick={add_another_contact}
          className="w-fit my-4 text-coolBlue flex items-center gap-1 md:text-base text-sm"
        >
          <AddCircleOutlineOutlined />
          <span className="font-semibold text-sm">
            {form.contact.length === 0
              ? "Add a Contact"
              : "Add Another Contact"}
          </span>
        </button>
      </div>

      <Divider />

      <div className="flex flex-col gap-4 mt-10">
        <span className="text-lg font-bold text-[#2D3436]">Notes</span>
        <Input
          header={"Add Notes"}
          type={"textarea"}
          placeholder={"Notes"}
          name={"notes"}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          taHeight="110px"
        />
        <div className={"flex justify-center md:justify-end"}>
          <button
            className="secondary-button disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center gap-[1px]"
            onClick={add_notes}
          >
            <AddOutlined /> Add Note
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-4 md:mb-10">
        <span className="text-lg my-4 font-bold text-[#2D3436]">
          Note History
        </span>
        {form.notes.length > 0 ? (
          <>
            <div className="hidden md:block bg-white border border-[#eeeeee] rounded-md">
              <Tbl data={form.notes} columns={NotesColumns} type="Notes" deleteNote={deleteNote} />
            </div>
            <div className="block md:hidden my-4">
              <AccordionTable data={form.notes} type={"View Notes"} />
            </div>
          </>
        ) : (
          <span className={"text-sm"}>There is no history yet</span>
        )}
      </div>

      <Divider />

      <div className="flex flex-col gap-4 my-10">
        <span className="text-lg font-bold text-[#2D3436]">Password</span>
        {form.password && <PasswordChecker password={form.password} />}
        <div className="flex justify-between gap-4 flex-col md:flex-row ">
          <Input
            header={"Password"}
            type={"password"}
            placeholder={"Password"}
            name={"password"}
            value={form.password}
            onChange={handleChange}
            required={true}
          />
          <Input
            header={"Confirm Password"}
            type={"password"}
            placeholder={"Confirm Password"}
            name={"confirm_password"}
            value={form.confirm_password}
            onChange={handleChange}
            required={true}
          />
        </div>
      </div>

      <div className="flex justify-center md:justify-end mb-10">
        <button
          className="primary-button flex items-center gap-[1px]"
          onClick={addCustomer}
        >
          <CheckOutlined /> Save
        </button>
      </div>
    </div>
  );
};

export default AddCustomerView;
