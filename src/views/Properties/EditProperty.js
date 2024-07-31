import { CheckOutlined } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useReportState } from "../../contexts/reportContext";
import { useAllDataState } from "../../contexts/allDataContext";
import { Switch } from "@mui/material";
import Checkbox from "../../components/Checkbox/Checkbox";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "../../contexts/authContext";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { useToastState } from "../../contexts/toastContext";
import EditPropertyForm from "./EditPropertyForm";
import PageHeader from "../../components/MainLayout/PageHeader";

const EditPropertyView = () => {
  const navigate = useNavigate();
  const {
    state: { item },
  } = useLocation();

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

  useEffect(() => {
    if (item) {
      setForm({
        photo: item?.photos,
        name: item?.customer_user_id?._id,
        ref_no: item?.ref_number,
        address: item?.address,
        town: item?.town,
        postcode: item?.postcode,
        type: item?.type,
        furnishing: item?.furnishing,
        bedrooms: item?.bedrooms,
        bathrooms: item?.bathrooms,
        amenity: item?.amenities,
      });
    }
  }, [item]);

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
      files.map(async (file) => {
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

  const updateProperty = useCallback(async () => {
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
      const response = await axios.put(
        `${API_URL}/account/property/${item._id}`,
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
      triggerToast("Property updated successfully!", "success");
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [
    form,
    token,
    triggerToast,
    getProperties,
    item,
    navigate,
    getPropertyList,
  ]);

  return (
    <div>
      <PageHeader title={"Edit Property"} />

      <EditPropertyForm
        form={form}
        handleChange={handleChange}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        handleDeletePhotoDialogOpen={handleDeletePhotoDialogOpen}
        handleDeletePhotoDialogClose={handleDeletePhotoDialogClose}
        deletePhotoDialogOpen={deletePhotoDialogOpen}
        deletePhoto={deletePhoto}
        customers={customers}
      />
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

      <div className="flex gap-4 flex-wrap">
        {amenityList.map((amenity) => (
          <Checkbox
            handleChange={handleAmenities}
            Lstyle={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "19px",
              color: "#151515",
            }}
            label={amenity}
            name={amenity}
            value={
              form.amenity.includes(amenity.toLowerCase()) ||
              form.amenity.includes(amenity)
            }
          />
        ))}
      </div>

      <div className="flex justify-center md:justify-end my-8">
        <button className="primary-button" onClick={updateProperty}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditPropertyView;
