import {
  CheckOutlined,
  ChevronLeftRounded,
  ChevronRightRounded,
  CloseRounded,
  DeleteForeverOutlined,
  EditOutlined,
} from "@mui/icons-material";
import React, { useState } from "react";
import CustomSelect from "../../../components/CustomSelect";
import { useDropzone } from "react-dropzone";
import Input from "../../../components/Input/Input";
import { Modal } from "@mui/material";
import { useReportState } from "../../../contexts/reportContext";
import { useLocation } from "react-router-dom";
import { useToastState } from "../../../contexts/toastContext";
import AlertDialog from "../../../components/AlertDialog";
import AutoComplete from "../../../components/AutoComplete";
import { useAllDataState } from "../../../contexts/allDataContext";
import { useAuthState } from "../../../contexts/authContext";
import UploadPhoto from "../../../components/Upload/UploadPhoto";
import DatePickerComponent from "../../../components/DatePicker";
import dayjs from "dayjs";
import { useTemplateState } from "../../../contexts/templateContext";

const MetersView = ({ handleMetersClose, meterTypes }) => {
  const {
    state: { item },
  } = useLocation();
  const { user } = useAuthState();
  const { meters, addMeter, updateMeter, deleteItem } = useTemplateState();
  const { getDocLink } = useTemplateState();
  const { triggerToast } = useToastState();
  const { locationList } = useAllDataState();

  const [meterForm, setMeterForm] = useState({
    type: "",
    serial_no: "",
    meter_reading_in: "",
    meter_reading_out: "",
    check_in_date: null,
    check_out_date: null,
    location: "",
    notes: "",
    check_out_comments: "",
  });

  const [meterId, setMeterId] = useState("");
  const [deleteMeterId, setDeleteMeterId] = useState();

  const [editMetersOpen, setEditMetersOpen] = useState(false);
  const handleEditMetersOpen = () => {
    setEditMetersOpen(true);
  };
  const handleEditMetersClose = () => {
    setMeterForm({
      type: "",
      serial_no: "",
      meter_reading_in: "",
      meter_reading_out: "",
      check_in_date: "",
      check_out_date: "",
      location: "",
      notes: "",
      check_out_comments: "",
    });
    setEditMetersOpen(false);
  };
  const [imageLoading, setImageLoading] = useState(false);
  // const { getRootProps, getInputProps } = useDropzone({
  //   multiple: true,
  //   accept: {
  //     "image/*": [],
  //   },
  //   onDropAccepted: async (files) => {
  //     files.map(async (file) => {
  //       setImageLoading(true);
  //       const formData = new FormData();
  //       formData.append("photo", file);
  //       console.log(file, formData);
  //       let secure_url = await getDocLink(formData, "photo");
  //       setMeterForm((meterForm) => ({
  //         ...meterForm,
  //         photos: [...meterForm.photos, secure_url],
  //       }));
  //       setImageLoading(false);
  //     });
  //   },
  // });

  // const deletePhoto = (url) => {
  //   setMeterForm({
  //     ...meterForm,
  //     photos: meterForm.photos.filter((photo) => photo !== url),
  //   });
  //   triggerToast("Save form now to see changes!", "info");
  // };

  const [deletePhotoDialogOpen, setDeletePhotoDialogOpen] = useState(false);
  const handleDeletePhotoDialogOpen = () => setDeletePhotoDialogOpen(true);
  const handleDeletePhotoDialogClose = () => setDeletePhotoDialogOpen(false);

  const [deleteMeterDialogOpen, setDeleteMeterDialogOpen] = useState(false);
  const handleDeleteMeterDialogOpen = () => setDeleteMeterDialogOpen(true);
  const handleDeleteMeterDialogClose = () => setDeleteMeterDialogOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeterForm({ ...meterForm, [name]: value });
  };

  const _addMeter = () => {
    if (
      meterForm.type === "" ||
      meterForm.serial_no === "" ||
      meterForm.meter_reading_in === "" ||
      meterForm.check_in_date === null
    ) {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    addMeter({
      template_id: item._id,
      entity_type: "meters",
      item_type: meterForm.type,
      metadata: meterForm,
    });
    setMeterForm({
      type: "",
      serial_no: "",
      meter_reading_in: "",
      meter_reading_out: "",
      check_in_date: "",
      check_out_date: "",
      location: "",
      notes: "",
      check_out_comments: "",
    });
  };

  const [editMeterDisplayName, setEditMeterDisplayName] = useState("");
  const editMeter = (idx) => {
    handleEditMetersOpen();
    setMeterId(meters[idx]._id);
    setMeterForm({
      ...meters[idx].metadata,
    });
    setEditMeterDisplayName(meters[idx].display_name);
  };
  const _editMeterSave = () => {
    if (
      meterForm.type === "" ||
      meterForm.serial_no === "" ||
      meterForm.meter_reading_in === "" ||
      meterForm.check_in_date === ""
    ) {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    updateMeter(
      {
        template_id: item._id,
        entity_type: "meters",
        item_type: meterForm.type,
        display_name: editMeterDisplayName,
        metadata: meterForm,
      },
      meterId
    );
    setMeterForm({
      type: "",
      serial_no: "",
      meter_reading_in: "",
      meter_reading_out: "",
      check_in_date: "",
      check_out_date: "",
      location: "",
      notes: "",
    });
    setMeterId("");
    setEditMeterDisplayName("");
    handleEditMetersClose();
  };

  const [section, setSection] = useState(1);

  return (
    <div className="flex justify-end mt-24 md:mt-0">
      <div className="flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] bg-[#fff] h-screen overflow-y-scroll md:px-4 pt-4 md:pt-10">
        <Modal open={editMetersOpen} onClose={handleEditMetersClose}>
          <div className="flex justify-end items-center h-screen">
            <div className="bg-white px-4 md:px-4 py-4 md:py-6 flex flex-col gap-4 w-full md:w-[767px] overflow-y-scroll h-screen">
              <div className="flex justify-between">
                <div></div>
                <span className="text-base md:text-xl font-medium text-[#010101]">
                  Edit {editMeterDisplayName}
                </span>
                <button onClick={handleEditMetersClose}>
                  <CloseRounded className={"text-coolBlue"} />
                </button>
              </div>

              <div className="flex flex-col gap-4 px-4 md:px-8">
                <CustomSelect
                  required={true}
                  header={"Meter Type"}
                  name="type"
                  value={meterForm.type}
                  handleChange={handleChange}
                  data={meterTypes.map(item => item === 'Oil Meter' ? 'Oil' : item)}
                  placeholder={"Please select a meter type"}
                />

                <Input
                  header={"Serial Number"}
                  type={"text"}
                  placeholder={"Enter serial number"}
                  name="serial_no"
                  value={meterForm.serial_no}
                  onChange={handleChange}
                  required={true}
                />
                <AutoComplete
                  header={"Location"}
                  name="location"
                  background="white"
                  freeSolo={true}
                  value={meterForm.location}
                  handleChange={(e, val) =>
                    setMeterForm({ ...meterForm, location: val })
                  }
                  data={[...locationList, ""]}
                  placeholder={"Location"}
                />

                <DatePickerComponent
                  header={"Check In Date"}
                  placeholder={"Enter check in date"}
                  name="check_in_date"
                  value={meterForm.check_in_date}
                  onChange={(date) => {
                    handleChange({
                      target: {
                        name: "check_in_date",
                        value: dayjs(date).startOf("day").toISOString(),
                      },
                    });
                  }}
                  required={true}
                />
                <Input
                  header={"Check In Reading"}
                  type={"number"}
                  placeholder={"Enter check in reading"}
                  name="meter_reading_in"
                  value={meterForm.meter_reading_in}
                  onChange={handleChange}
                  required={true}
                />
                <DatePickerComponent
                  header={"Check Out Date"}
                  placeholder={"Enter check out date"}
                  name="check_out_date"
                  value={meterForm.check_out_date}
                  onChange={(date) => {
                    handleChange({
                      target: {
                        name: "check_out_date",
                        value: dayjs(date).startOf("day").toISOString(),
                      },
                    });
                  }}
                  required={true}
                />
                <Input
                  header={"Check Out Reading"}
                  placeholder={"Enter check out reading"}
                  name="meter_reading_out"
                  value={meterForm.meter_reading_out}
                  onChange={handleChange}
                // required={true}
                />
                <Input
                  placeholder={"Enter notes"}
                  header={"Notes"}
                  name="notes"
                  value={meterForm.notes}
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
                    value={meterForm.check_out_comments}
                    onChange={handleChange}
                    type="textarea"
                    taHeight="110px"
                  />
                ) : (
                  <></>
                )}

                <div className="flex justify-end items-center w-full">
                  <button className="primary-button" onClick={_editMeterSave}>
                    <CheckOutlined className="mr-1" /> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <div className="flex gap-4 items-center mx-4 md:mx-5">
          <button onClick={handleMetersClose}>
            <ChevronLeftRounded className={"text-coolBlue"} fontSize="large" />
          </button>
          <span className="font-bold text-base md:text-xl text-[#212121]">
            Meters Overview
          </span>
        </div>

        <div className="w-full flex md:hidden justify-center items-center gap-2 text-sm font-semibold">
          <span
            className={`${section === 1 ? "text-coolBlue" : "text-[#89939E]"}`}
            onClick={() => setSection(1)}
          >
            Meters
          </span>
          <div className="text-coolBlue">
            <ChevronLeftRounded />
            <ChevronRightRounded />
          </div>
          <span
            className={`${section === 2 ? "text-coolBlue" : "text-[#89939E]"}`}
            onClick={() => setSection(2)}
          >
            Table of Meters
          </span>
        </div>

        <div
          className={`${section === 1 ? "flex" : "hidden"} md:flex flex-col`}
        >
          <span className="ml-8 mb-8 text-lg font-semibold text-[#010101]">
            Add Meters
          </span>

          <div className="flex flex-col md:flex-row gap-6 mx-8 mb-10">
            <div className={`md:flex flex-col w-full md:w-fit md:basis-1/2`}>
              <div className={"mb-6 md:mb:0"}>
                <CustomSelect
                  required={true}
                  header={"Meter Type"}
                  name="type"
                  value={meterForm.type}
                  handleChange={handleChange}
                  data={meterTypes.map(item => item === 'Oil Meter' ? 'Oil' : item)}
                  placeholder={"Please select a meter type"}
                />
              </div>

              <div className={"mb-6 md:mb:0"}>
                <Input
                  header={"Serial Number"}
                  type={"text"}
                  placeholder={"Enter serial number"}
                  name="serial_no"
                  value={meterForm.serial_no}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className={"mb-6 md:mb:0"}>
                <AutoComplete
                  header={"Location"}
                  name="location"
                  background="white"
                  freeSolo={true}
                  value={meterForm.location}
                  handleChange={(e, val) =>
                    setMeterForm({ ...meterForm, location: val })
                  }
                  data={[...locationList, ""]}
                  placeholder={"Location"}
                />
              </div>
              <div className={"mb-6 md:mb:0"}>
                <DatePickerComponent
                  header={"Check In Date"}
                  placeholder={"Enter check in date"}
                  name="check_in_date"
                  value={meterForm.check_in_date}
                  onChange={(date) => {
                    handleChange({
                      target: {
                        name: "check_in_date",
                        value: dayjs(date).startOf("day").toISOString(),
                      },
                    });
                  }}
                  required={true}
                />
              </div>
              <div className={"mb-6 md:mb:0"}>
                <Input
                  header={"Check In Reading"}
                  placeholder={"Enter check in reading"}
                  name="meter_reading_in"
                  value={meterForm.meter_reading_in}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className={"mb-6 md:mb:0"}>
                <DatePickerComponent
                  header={"Check Out Date"}
                  placeholder={"Enter check out date"}
                  name="check_out_date"
                  value={meterForm.check_out_date}
                  onChange={(date) => {
                    handleChange({
                      target: {
                        name: "check_out_date",
                        value: dayjs(date).startOf("day").toISOString(),
                      },
                    });
                  }}
                  required={false}
                />
              </div>
              <div className={"mb-6 md:mb:0"}>
                <Input
                  header={"Check Out Reading"}
                  placeholder={"Enter check out reading"}
                  name="meter_reading_out"
                  value={meterForm.meter_reading_out}
                  onChange={handleChange}
                // required={true}
                />
              </div>
            </div>
            <div className={`md:flex flex-col w-full md:w-fit md:basis-1/2`}>
              <div className={"mb-6 md:mb:0"}>
                <Input
                  placeholder={"Enter notes"}
                  header={"Notes"}
                  name="notes"
                  value={meterForm.notes}
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
                  value={meterForm.check_out_comments}
                  onChange={handleChange}
                  type="textarea"
                  taHeight="110px"
                />
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="flex justify-center md:justify-end items-center mr-0 md:mr-8 mb-[200px] md:mb-10 wrap">
            <button className="primary-button" onClick={_addMeter}>
              <CheckOutlined className="mr-1" /> Save
            </button>
          </div>
        </div>

        <div
          className={`${section === 2 ? "flex" : "hidden"
            } md:flex mx-4 md:mx-8 flex-col gap-6 mb:300 md:mb-10`}
        >
          <span className="text-lg font-semibold text-[#010101]">
            Table of Meters
          </span>
          <div className="flex flex-col gap-2">
            <AlertDialog
              open={deleteMeterDialogOpen}
              handleClose={handleDeleteMeterDialogClose}
              accept={() => {
                deleteItem(deleteMeterId, "meters", item._id);
              }}
              content={"Delete this meter?"}
            />

            {meters &&
              meters.map((meter, idx) => (
                <div className="flex justify-between items-center md:p-4 py-1 md:bg-white rounded-lg border border-gray-100">
                  <span className="text-sm ml-2 font-medium text-[#2D3436] capitalize">
                    {meter.display_name}
                  </span>
                  <div className="flex items-center gap-2 md:gap-3">
                    <button onClick={() => editMeter(idx)}>
                      <EditOutlined
                        className={"text-coolBlue"}
                        fontSize="small"
                      />
                    </button>
                    {user?.role !== "customer" && (
                      <button
                        onClick={() => {
                          setDeleteMeterId(meter._id);
                          handleDeleteMeterDialogOpen();
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

export default MetersView;
