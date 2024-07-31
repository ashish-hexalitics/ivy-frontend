import {
  CheckOutlined,
  ChevronLeftRounded,
  ChevronRightRounded,
  CloseRounded,
  DeleteForeverOutlined,
  EditOutlined,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Modal } from "@mui/material";
import { useReportState } from "../../../contexts/reportContext";
import { useLocation } from "react-router-dom";
import Input from "../../../components/Input/Input";
import { useToastState } from "../../../contexts/toastContext";
import AlertDialog from "../../../components/AlertDialog";
import AutoComplete from "../../../components/AutoComplete";
import { useAllDataState } from "../../../contexts/allDataContext";
import { useAuthState } from "../../../contexts/authContext";
import { convertToTitleCase } from "../../../utils/helper";
import UploadPhoto from "../../../components/Upload/UploadPhoto";
import { useTemplateState } from "../../../contexts/templateContext";

const UtilitiesView = ({ handleUtilitiesClose, utilityTypes }) => {
  const {
    state: { item },
  } = useLocation();
  const { user } = useAuthState();
  const { utilities, addUtility, updateUtility, getDocLink, deleteItem } =
    useTemplateState();
  const { triggerToast } = useToastState();
  const { locationList } = useAllDataState();

  const [utilityForm, setUtilityForm] = useState({
    type: "",
    location: "",
    notes: "",
    check_out_comments: "",
  });
  const [utilityId, setUtilityId] = useState("");

  const [editUtilityOpen, setEditUtilityOpen] = useState(false);
  const handleEditUtilityOpen = () => setEditUtilityOpen(true);
  const handleEditUtilityClose = () => {
    setUtilityForm({
      type: "",
      location: "",
      notes: "",
      check_out_comments: "",
    });
    setEditUtilityOpen(false);
  };
  const [imageUploading, setImageUploading] = useState(false);
  // const { getRootProps, getInputProps } = useDropzone({
  //   multiple: true,
  //   accept: {
  //     "image/*": [],
  //   },
  //   onDropAccepted: (files) => {
  //     files.map(async (file) => {
  //       setImageUploading(true);
  //       const formData = new FormData();
  //       formData.append("photo", file);
  //       let secure_url = await getDocLink(formData, "photo");
  //       setUtilityForm((utilityForm) => ({
  //         ...utilityForm,
  //         photos: [...utilityForm.photos, secure_url],
  //       }));
  //       setImageUploading(false);
  //     });
  //   },
  // });

  // const deletePhoto = (url) => {
  //   setUtilityForm({
  //     ...utilityForm,
  //     photos: utilityForm.photos.filter((photo) => photo !== url),
  //   });
  //   triggerToast("Save form now to see changes!", "info");
  // };

  const [deletePhotoDialogOpen, setDeletePhotoDialogOpen] = useState(false);
  const handleDeletePhotoDialogOpen = () => setDeletePhotoDialogOpen(true);
  const handleDeletePhotoDialogClose = () => setDeletePhotoDialogOpen(false);

  const [deleteUtilityDialogOpen, setDeleteUtilityDialogOpen] = useState(false);
  const handleDeleteUtilityDialogOpen = () => setDeleteUtilityDialogOpen(true);
  const handleDeleteUtilityDialogClose = () =>
    setDeleteUtilityDialogOpen(false);

  const [deleteUtilityId, setDeleteUtilityId] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUtilityForm({ ...utilityForm, [name]: value });
  };

  const _addUtility = () => {
    if (utilityForm.type === "") {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    addUtility({
      template_id: item._id,
      entity_type: "utilities",
      item_type: utilityForm.type.toLowerCase().replace(/\s/g, "_"),
      metadata: utilityForm,
    });
    setUtilityForm({
      type: "",
      location: "",
      notes: "",
      check_out_comments: "",
    });
  };

  const [editUtilityDisplayName, setEditUtilityDisplayName] = useState("");
  const _editUtility = (idx) => {
    handleEditUtilityOpen();
    setUtilityId(utilities[idx]._id);
    setUtilityForm(utilities[idx].metadata);
    setEditUtilityDisplayName(utilities[idx].display_name);
  };
  const _editUtilitySave = () => {
    if (utilityForm.type === "") {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    updateUtility(
      {
        template_id: item._id,
        entity_type: "utilities",
        item_type: utilityForm.type.toLowerCase().replace(/\s/g, "_"),
        metadata: utilityForm,
        display_name: editUtilityDisplayName,
      },
      utilityId
    );
    setUtilityForm({
      type: "",
      location: "",
      notes: "",
    });
    setUtilityId("");
    setEditUtilityDisplayName("");
    handleEditUtilityClose();
  };

  const [section, setSection] = useState(1);

  return (
    <div className="flex justify-end mt-24 md:mt-0">
      <div className="flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] bg-[#fff] h-screen overflow-y-scroll md:px-4 pt-4 md:pt-10">
        <Modal open={editUtilityOpen} onClose={handleEditUtilityClose}>
          <div className="flex justify-end items-center h-screen">
            <div className="bg-white px-4 md:px-4 py-4 md:py-6 flex flex-col gap-4 w-full md:w-[767px] overflow-y-scroll h-screen">
              <div className="flex justify-between">
                <div></div>
                <span className="text-base md:text-xl font-medium text-[#010101]">
                  Edit {convertToTitleCase(editUtilityDisplayName)}
                </span>
                <button onClick={handleEditUtilityClose}>
                  <CloseRounded className={"text-coolBlue"} />
                </button>
              </div>

              <div className="flex flex-col gap-4 px-4 md:px-8">
                <AutoComplete
                  required={true}
                  header={"Utility Type"}
                  name="type"
                  value={utilityForm.type}
                  handleChange={(e, val) =>
                    setUtilityForm({ ...utilityForm, type: val })
                  }
                  data={utilityTypes}
                  placeholder={"Please select a utility type"}
                />

                <AutoComplete
                  header={"Location"}
                  name="location"
                  background="white"
                  freeSolo={true}
                  value={utilityForm.location}
                  handleChange={(e, val) =>
                    setUtilityForm({ ...utilityForm, location: val })
                  }
                  data={[...locationList, ""]}
                  placeholder={"Location"}
                />

                <Input
                  placeholder={"Enter notes"}
                  header={"Notes"}
                  name="notes"
                  value={utilityForm.notes}
                  onChange={handleChange}
                  type="textarea"
                  taHeight="110px"
                />

                {item?.report_type?.toLowerCase().replace(/\s/g, "") ===
                  "checkoutreport" &&
                item?.linked_inventory_report?.toLowerCase() !== "none" ? (
                  <Input
                    placeholder={"Enter checkout comments"}
                    header={"Check Out Comments"}
                    name="check_out_comments"
                    value={utilityForm.check_out_comments}
                    onChange={handleChange}
                    type="textarea"
                    taHeight="110px"
                  />
                ) : (
                  <></>
                )}

                {/* <UploadPhoto
                  form={utilityForm}
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                  handleDeletePhotoDialogOpen={handleDeletePhotoDialogOpen}
                  deletePhotoDialogOpen={deletePhotoDialogOpen}
                  handleDeletePhotoDialogClose={handleDeletePhotoDialogClose}
                  deletePhoto={deletePhoto}
                  itemName={"photos"}
                  userRole={["customer"]}
                  width={"w-full"}
                  isAllowMultiple={true}
                /> */}
                <div className="flex justify-end items-center w-full">
                  <button className="primary-button" onClick={_editUtilitySave}>
                    <CheckOutlined className="mr-1" /> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <div className="flex gap-4 items-center mx-4 md:mx-8">
          <button onClick={handleUtilitiesClose}>
            <ChevronLeftRounded className="text-coolBlue" fontSize="large" />
          </button>
          <span className="font-bold text-base md:text-xl text-[#212121]">
            Utilities Overview
          </span>
        </div>
        <div className="w-full flex md:hidden justify-center items-center gap-2 text-sm font-semibold">
          <span
            className={`${section === 1 ? "text-coolBlue" : "text-[#89939E]"}`}
            onClick={() => setSection(1)}
          >
            Utilities
          </span>
          <div className="text-coolBlue">
            <ChevronLeftRounded />
            <ChevronRightRounded />
          </div>
          <span
            className={`${section === 2 ? "text-coolBlue" : "text-[#89939E]"}`}
            onClick={() => setSection(2)}
          >
            Table of Utilities
          </span>
        </div>

        <div
          className={`${section === 1 ? "flex" : "hidden"} md:flex flex-col`}
        >
          <span className="ml-8 mb-8 text-lg font-semibold text-[#010101]">
            Add Utilities
          </span>

          <div className="flex flex-col md:flex-row gap-6 mx-8 mb-8 md:mb-20 ">
            <div className={`md:flex flex-col w-full md:w-fit md:basis-1/2`}>
              <div className={"mb-6 md:mb:0"}>
                <AutoComplete
                  required={true}
                  header={"Utility Type"}
                  name="type"
                  background="white"
                  freeSolo={true}
                  value={utilityForm.type}
                  handleChange={(e, val) =>
                    setUtilityForm({ ...utilityForm, type: val })
                  }
                  data={utilityTypes}
                  placeholder={"Please select a utility type"}
                />
              </div>

              <div className={"mb-6 md:mb:0"}>
                <AutoComplete
                  header={"Location"}
                  name="location"
                  background="white"
                  freeSolo={true}
                  value={utilityForm.location}
                  handleChange={(e, val) =>
                    setUtilityForm({ ...utilityForm, location: val })
                  }
                  data={[...locationList, ""]}
                  placeholder={"Location"}
                />
              </div>
              <div className={"mb-6 md:mb:0"}>
                <Input
                  placeholder={"Enter notes"}
                  header={"Notes"}
                  name="notes"
                  value={utilityForm.notes}
                  onChange={handleChange}
                  type="textarea"
                  taHeight="110px"
                />
              </div>

              {item?.report_type?.toLowerCase().replace(/\s/g, "") ===
                "checkoutreport" &&
              item?.linked_inventory_report?.toLowerCase() !== "none" ? (
                <Input
                  placeholder={"Enter checkout comments"}
                  header={"Check Out Comments"}
                  name="check_out_comments"
                  value={utilityForm.check_out_comments}
                  onChange={handleChange}
                  type="textarea"
                  taHeight="110px"
                />
              ) : (
                <></>
              )}
            </div>
            <div className={`md:flex flex-col w-full md:w-fit md:basis-1/2`}>
              {/* <UploadPhoto
                form={utilityForm}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                handleDeletePhotoDialogOpen={handleDeletePhotoDialogOpen}
                deletePhotoDialogOpen={deletePhotoDialogOpen}
                handleDeletePhotoDialogClose={handleDeletePhotoDialogClose}
                deletePhoto={deletePhoto}
                itemName={"photos"}
                userRole={["customer"]}
                width={"w-full"}
                isAllowMultiple={true}
              /> */}
            </div>
          </div>

          <div className="flex justify-center md:justify-end items-center mr-0 md:mr-8 mb-[200px] md:mb-10">
            <button className="primary-button" onClick={_addUtility}>
              <CheckOutlined className="mr-1" /> Save
            </button>
          </div>
        </div>
        <div
          className={`${
            section === 2 ? "flex" : "hidden"
          } md:flex mx-4 md:mx-8 flex-col gap-6 mb:300 md:mb-10`}
        >
          <span className="text-lg font-semibold text-[#010101]">
            Table of Utilities
          </span>
          <div className="flex flex-col gap-2 w-full">
            <AlertDialog
              open={deleteUtilityDialogOpen}
              handleClose={handleDeleteUtilityDialogClose}
              accept={() => deleteItem(deleteUtilityId, "utilities", item._id)}
              content={"Delete this utility?"}
            />
            {utilities &&
              utilities.map((utility, idx) => (
                <div className="flex justify-between items-center md:p-4 py-1 md:bg-white rounded-md border border-gray-100">
                  <span className="text-sm ml-2 font-medium text-[#2D3436]">
                    {convertToTitleCase(utility.display_name)}
                  </span>
                  <div className="flex items-center gap-2 md:gap-3">
                    <button onClick={() => _editUtility(idx)}>
                      <EditOutlined
                        className={"text-coolBlue"}
                        fontSize="small"
                      />
                    </button>
                    {user?.role !== "customer" && (
                      <button
                        onClick={() => {
                          setDeleteUtilityId(utility._id);
                          handleDeleteUtilityDialogOpen();
                        }}
                      >
                        <DeleteForeverOutlined
                          className={"text-coolBlue"}
                          fontSize="small"
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilitiesView;
