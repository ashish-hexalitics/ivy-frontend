import {
  CheckOutlined,
  ChevronLeftRounded,
  DeleteForeverRounded,
} from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useReportState } from "../../contexts/reportContext";
import { useAllDataState } from "../../contexts/allDataContext";
import { photo_bw, upload, upload_photo } from "../../assets";
import CustomSelect from "../../components/CustomSelect";
import Input from "../../components/Input/Input";
import { Switch } from "@mui/material";
import Checkbox from "../../components/Checkbox/Checkbox";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../contexts/authContext";
import axios from "axios";
import { API_URL, PROPERTY_TYPES } from "../../utils/constants";
import { useToastState } from "../../contexts/toastContext";
import AlertDialog from "../../components/AlertDialog";
import UploadPhoto from "../../components/Upload/UploadPhoto";

const AddPropertyView = () => {
  const navigate = useNavigate();

  const { getDocLink, getPropertyList } = useReportState();
  const { customers, getProperties, amenityList } = useAllDataState();
  const { token, user } = useAuthState();
  const { triggerToast } = useToastState();

  const [form, setForm] = useState({
    photo: [],
    name: "",
    ref_no: "",
    address: "",
    town: "",
    postcode: "",
    type: "",
    furnishing: false,
    bedrooms: 0,
    bathrooms: 0,
    amenity: [],
  });

  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${API_URL}/account/settings?entity_type=property_types`,
          { headers: { Authorization: "Bearer " + token } }
        );
        const data = await res.data;
        setPropertyTypeOptions(data.data[0].entity_value);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "furnishing") {
      setForm({ ...form, furnishing: e.target.checked });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleAmenities = (e) => {
    const { name } = e.target;
    setForm({
      ...form,
      amenity:
        form.amenity.filter((item) => item === name).length > 0
          ? form.amenity.filter((item) => item !== name)
          : [...form.amenity, name],
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [],
    },
    onDropAccepted: (files) => {
      files.map((file) => {
        const formData = new FormData();
        formData.append("photo", file);
        let secure_url = getDocLink(formData, "photo");
        secure_url.then((res) =>
          setForm((form) => ({ ...form, photo: [...form.photo, res] }))
        );
      });
    },
  });

  const deletePhoto = (url) => {
    setForm({ ...form, photo: form.photo.filter((item) => item !== url) });
    triggerToast("Save form now to see changes!", "info");
  };

  const [deletePhotoDialogOpen, setDeletePhotoDialogOpen] = useState(false);
  const handleDeletePhotoDialogOpen = () => setDeletePhotoDialogOpen(true);
  const handleDeletePhotoDialogClose = () => setDeletePhotoDialogOpen(false);

  const addProperty = useCallback(async () => {
    if (
      form.name === "" ||
      form.address === "" ||
      form.town === "" ||
      form.postcode === "" ||
      form.type === ""
    ) {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/account/property`,
        {
          customer_user_id: form.name,
          ref_number: form.ref_no,
          address: form.address,
          town: form.town,
          postcode: form.postcode,
          type: form.type,
          furnishing: form.furnishing,
          bedrooms: form.bedrooms,
          bathrooms: form.bathrooms,
          amenities: form.amenity,
          photos: form.photo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.data;
      getProperties();
      getPropertyList();
      navigate("/properties");
      triggerToast("Property created successfully!", "success");
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [form, token, triggerToast, getProperties, getPropertyList, navigate]);

  return (
    <div>
      <div className="flex gap-4 items-center mt-6">
        <button onClick={() => navigate(-1)}>
          <ChevronLeftRounded className="text-coolBlue" fontSize="large" />
        </button>
        <span className="text-xl md:text-2xl font-semibold md:font-bold text-[#2D3436]">
          Add Property
        </span>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <UploadPhoto
          form={form}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          handleDeletePhotoDialogOpen={handleDeletePhotoDialogOpen}
          deletePhotoDialogOpen={deletePhotoDialogOpen}
          handleDeletePhotoDialogClose={handleDeletePhotoDialogClose}
          deletePhoto={deletePhoto}
          itemName={"photo"}
          userRole={["customer"]}
        />

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <CustomSelect
            required={true}
            header={"Customer Name"}
            name="name"
            value={form.name}
            handleChange={handleChange}
            data={customers.map((customer) => {
              return {
                label: customer.customerName,
                value: customer.viewCustomer.item.user_id,
              };
            })}
            placeholder={"Customer Name"}
            DataType="2"
          />

          <Input
            header={"Ref Number"}
            type={"text"}
            placeholder={"Ref Number"}
            name="ref_no"
            value={form.ref_no}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Input
            header={"Address"}
            type={"text"}
            placeholder={"Address"}
            name="address"
            value={form.address}
            onChange={handleChange}
            required={true}
          />
          <Input
            header={"Town"}
            type={"text"}
            placeholder={"Town"}
            name="town"
            value={form.town}
            onChange={handleChange}
            required={true}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Input
            header={"Postcode"}
            type={"text"}
            placeholder={"Postcode"}
            name="postcode"
            value={form.postcode}
            onChange={handleChange}
            required={true}
          />
          <CustomSelect
            required={true}
            header={"Type"}
            name="type"
            value={form.type}
            handleChange={handleChange}
            data={propertyTypeOptions}
            placeholder={"Type"}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Input
            header={"Bedrooms"}
            type={"number"}
            placeholder={"Bedrooms"}
            name="bedrooms"
            value={form.bedrooms}
            onChange={handleChange}
          />
          <Input
            header={"Bathrooms"}
            type={"number"}
            placeholder={"Bathrooms"}
            name="bathrooms"
            value={form.bathrooms}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 my-4">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Furnished</span>
            <Switch
              sx={{
                "& .MuiSwitch-switchBase": {
                  "&.Mui-checked": {
                    color: "#5131D7",
                    "& + .MuiSwitch-track": {
                      backgroundColor: "rgb(186,180,204)",
                    },
                  },
                },
              }}
              name="furnishing"
              checked={form.furnishing}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        {amenityList.map((amenity) => (
          <Checkbox
            handleChange={handleAmenities}
            Lstyle={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "22px",
              color: "#151515",
            }}
            label={amenity}
            name={amenity}
          />
        ))}
      </div>

      <div className="flex justify-center md:justify-end my-10">
        <button className="primary-button" onClick={addProperty}>
          <CheckOutlined className="mr-1" /> Save
        </button>
      </div>
    </div>
  );
};

export default AddPropertyView;
