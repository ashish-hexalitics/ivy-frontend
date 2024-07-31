import { photo_bw, upload, upload_photo } from "../../assets";
import { DeleteForeverRounded } from "@mui/icons-material";
import AlertDialog from "../../components/AlertDialog";
import CustomSelect from "../../components/CustomSelect";
import Input from "../../components/Input/Input";
import { API_URL, PROPERTY_TYPES } from "../../utils/constants";
import { makeStyles, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuthState } from "../../contexts/authContext";
import UploadPhoto from "../../components/Upload/UploadPhoto";
import axios from "axios";

const EditPropertyForm = ({
  form,
  handleChange,
  getRootProps,
  getInputProps,
  handleDeletePhotoDialogOpen,
  handleDeletePhotoDialogClose,
  deletePhotoDialogOpen,
  deletePhoto,
  customers,
}) => {
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  const { token } = useAuthState();
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

  return (
    <div className="flex flex-col gap-4">
      <UploadPhoto
        form={form}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        handleDeletePhotoDialogOpen={handleDeletePhotoDialogOpen}
        deletePhotoDialogOpen={deletePhotoDialogOpen}
        handleDeletePhotoDialogClose={handleDeletePhotoDialogClose}
        deletePhoto={deletePhoto}
        userRole={["customer"]}
        itemName={"photo"}
      />

      <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
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
    </div>
  );
};

export default EditPropertyForm;
