import {
  Add,
  CheckOutlined,
  ChevronLeftRounded,
  ChevronRightOutlined,
  CopyAllOutlined,
  DeleteForeverOutlined,
  DeleteForeverRounded,
  DragIndicator,
  EditOutlined,
  EditRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { add__room, photo_bw, upload, upload_photo } from "../../../assets";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, useAutocomplete } from "@mui/material";
import Checkbox from "../../../components/Checkbox/Checkbox";
import {
  COLORS,
  CONDITIONS,
  LIABILITIES,
  MAINTENANCE_ISSUES,
  OVERVIEW_TYPES,
} from "../constants";
import MultiSelectComponent from "../../../components/MultiSelect";
import { useDropzone } from "react-dropzone";
import { useReportState } from "../../../contexts/reportContext";
import { useLocation } from "react-router-dom";
import TextFormatterInput from "../../../components/TextFormatterInput";
import { useToastState } from "../../../contexts/toastContext";
import AlertDialog from "../../../components/AlertDialog";
import { useAuthState } from "../../../contexts/authContext";
import { convertToTitleCase, handleSort } from "../../../utils/helper";
import { API_URL, X_API_KEY } from "../../../utils/constants";
import axios from "axios";
import { convert } from "html-to-text";

import SelectableTag from "../../../components/Button/SelectableTag";
import UploadPhoto from "../../../components/Upload/UploadPhoto";
import CustomModal from "../../../components/Modal/CustomModal";
import Input from "../../../components/Input/Input";
import DatePickerComponent from "../../../components/DatePicker";
import dayjs from "dayjs";
import AutoComplete from "../../../components/AutoComplete";
import { useTemplateState } from "../../../contexts/templateContext";

const RoomsView = ({ handleRoomsAndAreasClose, roomTypes }) => {
  const { user, token } = useAuthState();
  const [deleteMultipleRoomsPopupOpen, setDeleteMultipleRoomsPopupOpen] =
    useState(false);
  const [selectedRoomsForDelete, setSelctedRoomsForDelete] = useState([]);
  const [deleteMultipleRooms, setDeleteMultipleRooms] = useState(false);
  const {
    templates,
    addRoomItem,
    rooms,
    allRoomsData,
    getDocLink,
    updateRoomItem,
    deleteItem,
    getRoomItemDescription,
    roomItemDescription,
    getRooms,
    setRooms,
  } = useTemplateState();
  const {
    state: {
      item: { _id, report_type, linked_inventory_report },
    },
  } = useLocation();
  const { triggerToast } = useToastState();

  const [itemForm, setItemForm] = useState({
    type: "",
    name: "",
    description: [],
    body: "",
    condition: "Good",
    cleanliness: "Good",
    old_description: [],
    old_body: "",
    old_condition: "",
    old_cleanliness: "",
    fire_alarm_compliance: false,
    view: [],
    date_tested: "",
    expiry_date: "",
    maintenance: false,
    maintenance_issue: [],
    liability: [],
    remedial_cost: "",
    comments: "",
    check_out_comments: "",
  });

  const handleChange = (e) => {
    if (
      e.target.name === "fire_alarm_compliance" ||
      e.target.name === "maintenance"
    ) {
      setItemForm({ ...itemForm, [e.target.name]: e.target.checked });
      return;
    }
    const { name, value } = e.target;
    if (name === "type") {
      setItemForm({ ...itemForm, name: value, type: value });
      return;
    }
    setItemForm({ ...itemForm, [name]: value });
  };

  const handleGetItemDescriptionOnTypeInput = (e) => {
    getRoomItemDescription(e.target.value);
  };

  const handleDescriptionChange = (event, value) => {
    let ranking = {};
    roomItemDescription.map((desc) => {
      ranking = { ...ranking, [desc.value]: desc.ind };
    });
    const values = value
      .map((v) => v?.value || v)
      .sort((a, b) => ranking[a] - ranking[b]);
    setItemForm({
      ...itemForm,
      description: values,
    });
  };
  const handleConditionChange = (event, value) =>
    setItemForm({ ...itemForm, condition: value });
  const handleCleanlinessChange = (event, value) =>
    setItemForm({ ...itemForm, cleanliness: value });
  const handleMaintenanceChange = (event, value) =>
    setItemForm({
      ...itemForm,
      maintenance_issue:
        itemForm.maintenance_issue.filter((item) => item === value).length > 0
          ? itemForm.maintenance_issue.filter((item) => item !== value)
          : [...itemForm.maintenance_issue, value],
    });
  const handleLiabilityChange = (event, value) =>
    setItemForm({
      ...itemForm,
      liability:
        itemForm.liability.filter((item) => item === value).length > 0
          ? itemForm.liability.filter((item) => item !== value)
          : [...itemForm.liability, value],
    });

  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const handleAddRoomOpen = () => setAddRoomOpen(true);
  const handleAddRoomClose = () => setAddRoomOpen(false);

  const [editRoomOpen, setEditRoomOpen] = useState(false);
  const handleEditRoomOpen = () => setEditRoomOpen(true);
  const handleEditRoomClose = () => {
    setEditRoomOpen(false);
    setEditRoomType("");
    setEditRoomObjectType("");
    handleAddItemClose();
  };

  const [addItemOpen, setAddItemOpen] = useState(false);
  const handleAddItemOpen = () => {
    setAddItemOpen(true);
    setItemForm({
      type: "",
      name: "",
      description: [],
      body: "",
      condition: "Good",
      cleanliness: "Good",
      old_description: "",
      old_body: "",
      old_condition: "",
      old_cleanliness: "",
      fire_alarm_compliance: false,
      view: [],
      date_tested: "",
      expiry_date: "",
      maintenance: false,
      maintenance_issue: [],
      liability: [],
      remedial_cost: "",
      comments: "",
      check_out_comments: "",
    });
  };
  const handleAddItemClose = () => {
    setAddItemOpen(false);
    setClassType("");
    setIsEdit(false);
  };

  const [addRoomType, setAddRoomType] = useState("");
  const [editRoomType, setEditRoomType] = useState("");
  const [editRoomObjectType, setEditRoomObjectType] = useState("");
  const [classType, setClassType] = useState("");
  const [accordion, setAccordion] = useState([]);
  const [items, setItems] = useState([]);
  const [generalOverview, setGeneralOverview] = useState({});

  const [searchInput, setSearchInput] = useState("");
  const { getInputProps: getSearchInputProps } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: roomTypes,
    getOptionLabel: (option) => option,
  });

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
  //       const secure_url = await getDocLink(formData, "photo");
  //       setItemForm((item) => ({
  //         ...item,
  //         photos: [...item.photos, secure_url],
  //       }));
  //       setImageLoading(false);
  //     });
  //   },
  // });

  // const deletePhoto = (url) => {
  //   setItemForm({
  //     ...itemForm,
  //     photos: itemForm.photos.filter((photo) => photo !== url),
  //   });
  //   triggerToast("Save form now to see changes!", "info");
  // };

  const [deletePhotoDialogOpen, setDeletePhotoDialogOpen] = useState(false);
  const handleDeletePhotoDialogOpen = () => setDeletePhotoDialogOpen(true);
  const handleDeletePhotoDialogClose = () => setDeletePhotoDialogOpen(false);

  // const { getRootProps: getRootProps360, getInputProps: getInputProps360 } =
  //   useDropzone({
  //     multiple: true,
  //     accept: {
  //       "image/*": [],
  //     },
  //     onDropAccepted: (files) => {
  //       files.map((file) => {
  //         const formData = new FormData();
  //         formData.append("photo", file);
  //         let secure_url = getDocLink(formData, "photo");
  //         secure_url.then((res) =>
  //           setItemForm((item) => ({
  //             ...item,
  //             photos_360: [...item.photos_360, res],
  //           }))
  //         );
  //       });
  //     },
  //   });

  // const delete360Photo = (url) => {
  //   setItemForm({
  //     ...itemForm,
  //     photos_360: itemForm.photos_360.filter((photo) => photo !== url),
  //   });
  //   triggerToast("Save form now to see changes!", "info");
  // };

  const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false);
  const handleDeleteItemDialogOpen = () => setDeleteItemDialogOpen(true);
  const handleDeleteItemDialogClose = () => setDeleteItemDialogOpen(false);

  const [deleteRoomDialogOpen, setDeleteRoomDialogOpen] = useState(false);
  const handleDeleteRoomDialogOpen = () => setDeleteRoomDialogOpen(true);
  const handleDeleteRoomDialogClose = () => setDeleteRoomDialogOpen(false);

  const [deleteRoomQueue, setDeleteRoomQueue] = useState(null);

  const _addRoom = () => {
    if (searchInput === "") return;
    addGeneralOverview(searchInput);
    setAddRoomType("");
    setSearchInput("");
    handleAddRoomClose();
  };

  const _editRoom = (val) => {
    handleEditRoomOpen();
    setItems(
      allRoomsData.filter(
        (room) =>
          room?.display_name.toLowerCase() === val.display_name.toLowerCase()
      )
    );
    const _items = allRoomsData.filter(
      (room) =>
        room?.display_name.toLowerCase() === val.display_name.toLowerCase()
    );
    setItems(_items);
    filterItemsByClass(_items);
    setEditRoomType(val.display_name);
    setEditRoomObjectType(val.object_type);
  };

  const addGeneralOverview = useCallback(
    (val) => {
      const display_names = rooms.filter((room) =>
        room?.display_name.includes(val.toLowerCase())
      );
      addRoomItem(
        {
          template_id: _id,
          entity_type: "rooms_and_areas",
          object_type: val.toLowerCase(),
          class_type: "general_overview",
          item_type: "general_overview",
          display_name: `${val.toLowerCase()} ${display_names.length + 1}`,
          metadata: {
            type: "general_overview",
            name: "",
            description: [],
            body: "",
            condition: "",
            cleanliness: "",
            old_description: "",
            old_body: "",
            old_condition: "",
            old_cleanliness: "",
            fire_alarm_compliance: false,
            view: [],
            date_tested: "",
            expiry_date: "",
            maintenance: false,
            maintenance_issue: [],
            liability: [],
            remedial_cost: "",
            comments: "",
            status: "pending",
          },
        },
        "Room added!"
      );
    },
    [_id, addRoomItem, rooms]
  );

  useEffect(() => {
    if (editRoomType !== "") {
      setItems(
        allRoomsData.filter(
          (room) =>
            room.display_name.toLowerCase() === editRoomType.toLowerCase()
        )
      );
      if (
        allRoomsData.filter(
          (room) =>
            room.display_name.toLowerCase() === editRoomType.toLowerCase() &&
            room.class_type === "general_overview"
        ).length > 0
      ) {
        setGeneralOverview(
          allRoomsData.filter(
            (room) =>
              room.display_name === editRoomType.toLowerCase() &&
              room.class_type === "general_overview"
          )[0]
        );
      }
    }
  }, [allRoomsData, editRoomType]);

  useEffect(() => {
    fetchItemTypeOptions();
    const initArray = [];
    for (let i = 0; i < OVERVIEW_TYPES.length; i++)
      initArray.push(OVERVIEW_TYPES[i].toLowerCase());
    setAccordion(initArray);
  }, []);

  const [item, setItem] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [sortedDecorItems, setSortedDecorItems] = useState([]);
  const [sortedFixtureItems, setSortedFixturesItems] = useState([]);
  const [sortedFurnishingItems, setSortedFurnishingItems] = useState([]);
  const dragItem = useRef(0);
  const draggedOverItem = useRef(0);
  const dragRoom = useRef(0);
  const draggedOverRoom = useRef(0);

  const [itemTypeValues, setItemTypeValues] = useState([]);

  const fetchItemTypeOptions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/console/account/settings?entity_type=item_type`,
        {
          headers: {
            "x-api-key": X_API_KEY,
          },
        }
      );
      const data = await response.data;
      setItemTypeValues(data.data[0].entity_value);
    } catch (error) {
      console.log(error);
    }
  };

  const filterItemsByClass = (items) => {
    if (items) {
      setSortedDecorItems(
        items
          .filter((it) => it.class_type.toLowerCase() === "decor")
          .sort((a, b) => a.item_rank - b.item_rank)
      );
      setSortedFixturesItems(
        items
          .filter((it) => it.class_type.toLowerCase() === "fixtures")
          .sort((a, b) => a.item_rank - b.item_rank)
      );
      setSortedFurnishingItems(
        items
          .filter(
            (it) => it.class_type.toLowerCase() === "furnishings & effects"
          )
          .sort((a, b) => a.item_rank - b.item_rank)
      );
    }
  };
  useEffect(() => {
    filterItemsByClass(items);
  }, [items.length, itemForm]);

  const handleRoomSort = async (elems) => {
    const displayNames = [];
    elems.forEach((room) => displayNames.push(room?.display_name));
    try {
      const res = await axios.post(
        `${API_URL}/account/template/${_id}/rooms_order`,
        {
          display_names: displayNames,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      triggerToast("Items sorted successfully", "success");
    } catch (error) {
      triggerToast(error.message, "error");
    }
  };

  useEffect(() => {
    let confirmedRooms = 0;
    rooms.forEach((room) => room.status === "completed" && confirmedRooms++);
    setNoOfConfirmedRooms(confirmedRooms);
    // handleRoomSort();
  }, [rooms]);

  const [dragItemType, setDragItemType] = useState("");

  const handleItemSort = async (elems) => {
    const itemIds = [];
    elems.forEach((item) => itemIds.push(item._id));
    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/account/template/${_id}/items_order`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({ item_ids: itemIds }),
      };
      await axios.request(config);
      getRooms(_id);
      triggerToast("Items sorted successfully", "success");
    } catch (error) {
      triggerToast(error?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    // handleItemSort();
  }, [sortedDecorItems, sortedFixtureItems, sortedFurnishingItems]);

  const [deleteRoomId, setDeleteRoomId] = useState();
  const _openAddItemForm = (val) => {
    handleAddItemOpen();
    setClassType(val);
    setItem({});
  };

  const _addItem = useCallback(() => {
    if (!itemForm?.type) {
      triggerToast("Item Type cannot be empty", "error");
      return;
    }
    handleAddItemClose();
    addRoomItem(
      {
        template_id: _id,
        entity_type: "rooms_and_areas",
        object_type: editRoomObjectType.toLowerCase(),
        class_type: classType.toLowerCase(),
        item_type: itemForm?.type.toLowerCase(),
        display_name: editRoomType.toLowerCase(),
        metadata: {
          ...itemForm,
          body: `${itemForm.body}`,
        },
      },
      "Item added successfully!"
    );
    setItemForm({
      type: "",
      name: "",
      description: [],
      body: "",
      condition: "Good",
      cleanliness: "Good",
      old_description: [],
      old_body: "",
      old_condition: "",
      old_cleanliness: "",
      fire_alarm_compliance: false,
      view: [],
      date_tested: "",
      expiry_date: "",
      maintenance: false,
      maintenance_issue: [],
      liability: [],
      remedial_cost: "",
      comments: "",
      check_out_comments: "",
    });
  }, [_id, addRoomItem, itemForm, editRoomType, classType, editRoomObjectType]);

  const _editItem = (id) => {
    const _item = allRoomsData.filter((it) => it._id === id)[0];
    handleAddItemOpen();
    setItemForm({
      ..._item?.metadata,
      body: convert(_item?.metadata.body, {
        wordwrap: 130,
      }),
    });
    // (report_type === "Checkout Report" && linked_inventory_report !== "0") ? setItemForm({..._item.metadata, description : '', body : '', condition : '', cleanliness : ''}) : setItemForm(_item.metadata)
    setItem(_item);
    setIsEdit(true);
    getRoomItemDescription(_item?.metadata?.type);
  };

  const _editItemSave = useCallback(() => {
    if (!itemForm?.type) {
      triggerToast("Item Type cannot be empty", "error");
      return;
    }
    handleAddItemClose();
    updateRoomItem(
      {
        template_id: _id,
        entity_type: "rooms_and_areas",
        object_type: item.object_type,
        display_name: item.display_name,
        class_type: item.class_type,
        item_type:
          itemForm?.type.toLowerCase() === "general overview"
            ? "general_overview"
            : itemForm?.type.toLowerCase(),
        metadata: {
          ...itemForm,
          body: !itemForm.body.includes("div")
            ? `<div>${itemForm.body}</div>`
            : itemForm.body,
        },
      },
      item._id
    );
    setItem({});
    setItemForm({
      type: "",
      name: "",
      description: [],
      body: "",
      condition: "Good",
      cleanliness: "Good",
      old_description: [],
      old_body: "",
      old_condition: "",
      old_cleanliness: "",
      fire_alarm_compliance: false,
      view: [],
      date_tested: "",
      expiry_date: "",
      maintenance: false,
      maintenance_issue: [],
      liability: [],
      remedial_cost: "",
      comments: "",
      check_out_comments: "",
    });
    setIsEdit(false);
  }, [_id, updateRoomItem, item, itemForm]);

  const [noOfConfirmedRooms, setNoOfConfirmedRooms] = useState(0);

  const handleConfirmRoomInspection = () => {
    const generalOverviewItem = items.filter(
      (item) => item.class_type === "general_overview"
    )[0];
    updateRoomItem(
      {
        template_id: _id,
        entity_type: "rooms_and_areas",
        object_type: generalOverviewItem?.object_type,
        display_name: generalOverviewItem?.display_name,
        class_type: generalOverviewItem?.class_type,
        item_type: generalOverview?.metadata?.type.toLowerCase(),
        metadata: {
          ...generalOverview?.metadata,
          status:
            generalOverview?.metadata?.status === "completed"
              ? "pending"
              : "completed",
        },
      },
      generalOverviewItem?._id
    );
    handleEditRoomClose();
  };

  const getRoomStatus = (displayName) => {
    return allRoomsData.filter(
      (room) =>
        room.display_name.toLowerCase() === displayName?.toLowerCase() &&
        room.class_type === "general_overview"
    )[0]?.metadata?.status;
  };

  const duplicateRoom = async (room) => {
    console.log(room);
    try {
      const res = await axios.post(
        `${API_URL}/account/template/${_id}/duplicate`,
        {
          display_name: room.display_name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      getRooms(_id);
      triggerToast("Room Cloned Successfully", "success");
    } catch (error) {
      triggerToast(error.message, "error");
    }
    // addGeneralOverview(room.object_type);
  };

  const duplicateItem = (_item) => {
    addRoomItem(
      {
        template_id: _id,
        entity_type: "rooms_and_areas",
        object_type: _item.object_type,
        display_name: _item.display_name,
        class_type: _item.class_type,
        item_type: _item.item_type,
        metadata: _item.metadata,
      },
      "Item duplicated successfully!"
    );
  };

  const handleAccordionOpen = (type) => {
    if (accordion.includes(type))
      setAccordion((acc) => acc.filter((it) => it !== type));
    else setAccordion((acc) => [...acc, type]);
  };

  const [totalItemsNavigated, setTotalItemsNavigated] = useState(1);

  const handleNextItemNavigate = () => {
    const sameDisplayNameRooms = allRoomsData
      .filter((it) => it.display_name === item.display_name)
      .filter((it) => it.class_type !== "general_overview")
      .map((it) => it.item_type);
    updateRoomItem(
      {
        template_id: _id,
        entity_type: "rooms_and_areas",
        object_type: item.object_type,
        display_name: item.display_name,
        class_type: item.class_type,
        item_type: itemForm?.type.toLowerCase(),
        metadata: {
          ...itemForm,
          body: convert(itemForm.body, {
            wordwrap: 130,
          }),
        },
      },
      item._id
    );
    // if (totalItemsNavigated >= sameDisplayNameRooms.length) {
    //   setTotalItemsNavigated(1);
    //   handleAddItemClose();
    //   return;
    // }
    const newIndex =
      (sameDisplayNameRooms.indexOf(item?.item_type) + 1) %
      sameDisplayNameRooms.length;
    setItem(
      allRoomsData.filter(
        (it) => it.item_type === sameDisplayNameRooms[newIndex]
      )[0]
    );
    setItemForm({
      ...allRoomsData.filter(
        (it) => it.item_type === sameDisplayNameRooms[newIndex]
      )[0]?.metadata,
      body: convert(
        allRoomsData.filter(
          (it) => it.item_type === sameDisplayNameRooms[newIndex]
        )[0]?.metadata.body
      ),
    });
    setTotalItemsNavigated(totalItemsNavigated + 1);
    triggerToast("Next Item Loaded Successfully", "success");
  };

  const handlePrevItemNavigate = () => {
    const sameDisplayNameRooms = allRoomsData
      .filter((it) => it.display_name === item.display_name)
      .filter((it) => it.class_type !== "general_overview")
      .map((it) => it.item_type);
    updateRoomItem(
      {
        template_id: _id,
        entity_type: "rooms_and_areas",
        object_type: item.object_type,
        display_name: item.display_name,
        class_type: item.class_type,
        item_type: itemForm?.type.toLowerCase(),
        metadata: {
          ...itemForm,
          body: convert(itemForm.body, {
            wordwrap: 130,
          }),
        },
      },
      item._id
    );
    // if (totalItemsNavigated >= sameDisplayNameRooms.length) {
    //   setTotalItemsNavigated(1);
    //   handleAddItemClose();
    //   return;
    // }
    const newIndex =
      sameDisplayNameRooms.indexOf(item?.item_type) - 1 >= 0
        ? sameDisplayNameRooms.indexOf(item?.item_type) - 1
        : sameDisplayNameRooms.length - 1;
    setItem(
      allRoomsData.filter(
        (it) => it.item_type === sameDisplayNameRooms[newIndex]
      )[0]
    );
    setItemForm({
      ...allRoomsData.filter(
        (it) => it.item_type === sameDisplayNameRooms[newIndex]
      )[0]?.metadata,
      body: convert(
        allRoomsData.filter(
          (it) => it.item_type === sameDisplayNameRooms[newIndex]
        )[0]?.metadata.body
      ),
    });
    setTotalItemsNavigated(totalItemsNavigated + 1);
    triggerToast("Prev Item Loaded Successfully", "success");
  };

  const handleMultipleRoomsDelete = async (rooms) => {
    try {
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${API_URL}/account/template/${_id}/room_delete`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({ display_names: rooms }),
      };
      await axios.request(config);
      triggerToast("Rooms deleted successfully!", "success");
      getRooms(_id);
    } catch (error) {
      triggerToast(error.message, "error");
    }
  };
  const handleRoomDelete = async (room) => {
    try {
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${API_URL}/account/template/${_id}/room_delete`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({ display_name: room.display_name }),
      };
      await axios.request(config);
      triggerToast("Room deleted successfully!", "success");
      getRooms(_id);
    } catch (error) {
      triggerToast(error.message, "error");
    }
  };

  const [itemsDisplayNames, setItemsDisplayNames] = useState({});
  useEffect(() => {
    let displayNames = {};
    items.forEach((item) => {
      if (item.class_type === "general_overview") return;
      displayNames = { ...displayNames, [item._id]: item.item_type };
    });
    setItemsDisplayNames(displayNames);
  }, [items]);

  const [renameRoomOpen, setRenameRoomOpen] = useState(false);
  const handleRenameModalOpen = () => setRenameRoomOpen(true);
  const handleRenameModalClose = () => {
    setRenameSearchInput("");
    setRenameRoomOpen(false);
  };
  const [renameRoomQueue, setRenameRoomQueue] = useState(null);
  const [renameSearchInput, setRenameSearchInput] = useState("");

  const handleRoomRename = async () => {
    try {
      const config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API_URL}/account/template/${_id}/room_rename`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({
          display_name: renameRoomQueue.display_name,
          new_display_name: renameSearchInput.toLowerCase(),
        }),
      };
      await axios.request(config);
      triggerToast("Room renamed successfully!", "success");
      getRooms(_id);
      handleRenameModalClose();
    } catch (error) {
      triggerToast(error?.response?.data?.message, "error");
    }
  };

  const initialData = {
    tasks: [
      { id: "task-1", content: "Task 1" },
      { id: "task-2", content: "Task 2" },
      // More tasks...
    ],
  };

  return (
    <div className="flex justify-end mt-24 md:mt-0 h-screen">
      <CustomModal
        open={addRoomOpen}
        setIsOpen={handleAddRoomClose}
        title={"New Room"}
        content={
          <div className="bg-[#F9F9F9] w-full border border-[#f2f4f5] p-3 rounded-sm flex flex-col gap-4 h-[300px]">
            <span className="text-sm text-[#5F5F5F] p-2">
              Start typing and choose from the list, or simply type your own
            </span>
            <input
              className="border border-gray-200 px-4 py-2 rounded-md mx-2 text-sm md:text-base"
              {...getSearchInputProps()}
              type="text"
              name="searchInput"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <div className="flex flex-col text-[#282828] overflow-y-auto">
              {roomTypes.length > 0 &&
                roomTypes
                  .filter((type) =>
                    type.toLowerCase().includes(searchInput.toLowerCase())
                  )
                  .map((type) => (
                    <span
                      onClick={() => {
                        setAddRoomType(type);
                        setSearchInput(type);
                      }}
                      className={`font-medium text-sm cursor-pointer rounded-md hover:bg-[#EFEAFE] hover:text-coolBlue px-4 md:px-6 py-2 ${
                        type === addRoomType && "bg-[#EFEAFE] text-coolBlue"
                      }`}
                    >
                      {type}
                    </span>
                  ))}
            </div>
          </div>
        }
        actions={
          <div className="flex w-full md:justify-end">
            <button onClick={_addRoom} className="primary-button">
              + Add
            </button>
          </div>
        }
      />

      {/* <Modal
        open={deleteMultipleRoomsPopupOpen}
        onClose={() => {
          setDeleteMultipleRoomsPopupOpen(false);
          setSelctedRoomsForDelete([]);
        }}
        className="w-screen h-screen flex items-center justify-center"
      >
        <div className="w-[600px] h-fit bg-white flex flex-col gap-8 p-10 py-4 rounded-md">
          <span className="text-xl font-semibold text-black">
            Select rooms to delete
          </span>
          <div className="w-full flex gap-5 flex-wrap">
            {rooms.map((room) => (
              <Checkbox
                checked={selectedRoomsForDelete.includes(room?.display_name)}
                label={convertToTitleCase(room?.display_name)}
                handleChange={(e) => {
                  setSelctedRoomsForDelete(
                    selectedRoomsForDelete?.includes(room?.display_name)
                      ? selectedRoomsForDelete.filter(
                          (r) => r !== room?.display_name
                        )
                      : [...selectedRoomsForDelete, room?.display_name]
                  );
                }}
              />
            ))}
          </div>

          <button
            className="primary-button !bg-red-600 mx-auto"
            onClick={() => handleMultipleRoomsDelete(selectedRoomsForDelete)}
          >
            Delete
          </button>
        </div>
      </Modal> */}

      <CustomModal
        open={renameRoomOpen}
        setIsOpen={handleAddRoomClose}
        handleClose={handleRenameModalClose}
        title={`Rename Room - ${
          renameRoomQueue?.display_name &&
          convertToTitleCase(renameRoomQueue?.display_name)
        }`}
        content={
          <div className="rounded-md w-full flex flex-col gap-1 min-h-fit">
            <span className="text-sm text-[#5F5F5F]">
              Type a new name for the room
            </span>
            <input
              className="border border-gray-200 px-4 py-2 rounded-md text-sm"
              type="text"
              name="searchInput"
              value={renameSearchInput}
              onChange={(e) => setRenameSearchInput(e.target.value)}
            />
          </div>
        }
        actions={
          <div className="md:justify-end w-full flex">
            <button onClick={handleRoomRename} className="primary-button">
              Rename
            </button>
          </div>
        }
      />

      <Modal
        open={editRoomOpen}
        onClose={handleEditRoomClose}
        hideBackdrop={true}
        onEnter={() => {
          const initArray = [];
          OVERVIEW_TYPES.forEach((type) => initArray.push(type.toLowerCase()));
          setAccordion(initArray);
        }}
      >
        <div className="flex justify-end mt-24 md:mt-0">
          <div className="flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] bg-[#fff] md:px-4 h-screen overflow-scroll no-scrollbar pt-4 md:pt-10">
            <div className="flex gap-4 items-center mx-4 md:mx-8">
              <button onClick={handleEditRoomClose}>
                <ChevronLeftRounded
                  className={"text-coolBlue"}
                  fontSize="large"
                />
              </button>
              <span className="font-bold text-base md:text-xl text-[#212121]">
                Edit{" "}
                {editRoomType.length > 0 && convertToTitleCase(editRoomType)}
              </span>
            </div>
            <div className="flex items-center justify-between mx-4 md:mx-8  font-medium text-sm text-[#7C7C7C]">
              <div className="flex gap-2">
                <span
                  className="text-coolBlue cursor-pointer"
                  onClick={handleRoomsAndAreasClose}
                >
                  Overview
                </span>
                <span> / </span>
                <span
                  className="text-coolBlue cursor-pointer"
                  onClick={handleEditRoomClose}
                >
                  Rooms & Areas
                </span>
                <span> / </span>
                <span>
                  {editRoomType.length > 0 && convertToTitleCase(editRoomType)}
                </span>
              </div>
            </div>
            <div className="flex flex-col mx-4 md:mx-8 gap-2">
              <div className="flex justify-between items-center p-3 md:px-6 md:py-4 bg-[#EFEAFE] rounded-md">
                <span className="text-sm  font-medium">
                  {editRoomType.length > 0 && convertToTitleCase(editRoomType)}
                </span>
              </div>
              <div className="flex flex-col gap-2 ">
                <div
                  className="flex justify-between p-2 md:px-6 md:py-3 rounded-md bg-gray-100 hover:bg-[#EFEAFE] items-center cursor-pointer"
                  onClick={() => _editItem(generalOverview?._id)}
                >
                  <span className="text-sm  font-medium">General Overview</span>
                  <button onClick={() => _editItem(generalOverview?._id)}>
                    <EditRounded className={"text-coolBlue"} fontSize="small" />
                  </button>
                </div>
                <AlertDialog
                  open={deleteItemDialogOpen}
                  handleClose={handleDeleteItemDialogClose}
                  accept={() => deleteItem(deleteRoomId, "rooms", _id)}
                  content={"Delete this item?"}
                />
                {OVERVIEW_TYPES.map((type, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`${
                        report_type?.toLowerCase().replace(/\s/, "") ===
                          "inspectionreport" && type.toLowerCase() != "decor"
                          ? "hidden"
                          : ""
                      } cursor-pointer`}
                    >
                      <div className="flex justify-between p-2 md:px-4 md:py-3 rounded-md bg-gray-100 hover:bg-[#EFEAFE] items-center">
                        <div
                          className="flex gap-2 items-center flex-1"
                          onClick={() =>
                            handleAccordionOpen(type.toLowerCase())
                          }
                        >
                          <button>
                            {accordion.includes(type.toLowerCase()) ? (
                              <KeyboardArrowUpRounded
                                className={"text-coolBlue"}
                                fontSize="small"
                              />
                            ) : (
                              <KeyboardArrowDownRounded
                                className={"text-coolBlue"}
                                fontSize="small"
                              />
                            )}
                          </button>
                          <span className="text-sm  font-medium">
                            {report_type?.toLowerCase().replace(/\s/g, "") ===
                            "inspectionreport"
                              ? "Defects"
                              : type}
                          </span>
                        </div>
                        <button onClick={() => _openAddItemForm(type)}>
                          <Add
                            className={"text-coolBlue mr-2"}
                            fontSize="medium"
                          />
                        </button>
                      </div>
                      <div
                        className={`${
                          accordion.includes(type.toLowerCase())
                            ? "flex"
                            : "hidden"
                        } bg-white px-2 md:px-4 py-2 flex-col`}
                      >
                        {" "}
                        {(type.toLowerCase() === "decor"
                          ? sortedDecorItems
                          : type.toLowerCase() === "fixtures"
                          ? sortedFixtureItems
                          : sortedFurnishingItems
                        ).map((item, index) => (
                          <div
                            draggable
                            onDragStart={(e) => {
                              dragItem.current = index;
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onDragEnter={() =>
                              (draggedOverItem.current = index)
                            }
                            onDragEnd={() => {
                              setDragItemType(type.toLowerCase());
                              const elems = handleSort(
                                type.toLowerCase() === "decor"
                                  ? sortedDecorItems
                                  : type.toLowerCase() === "fixtures"
                                  ? sortedFixtureItems
                                  : sortedFurnishingItems,
                                dragItem,
                                draggedOverItem
                              );
                              type.toLowerCase() === "decor"
                                ? setSortedDecorItems(elems)
                                : type.toLowerCase() === "fixtures"
                                ? setSortedFixturesItems(elems)
                                : setSortedFurnishingItems(elems);
                              handleItemSort(elems);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center cursor-grabbing border border-gray-100 rounded-md justify-between pl-7 md:pl-8 md:pr-2 m-2 py-2 hover:bg-[#EFEAFE]"
                          >
                            <DragIndicator
                              className={"text-gray-400 mr-2"}
                              fontSize={"small"}
                            />
                            <span
                              className="text-sm font-medium flex-1 capitalize"
                              onClick={() => _editItem(item._id)}
                            >
                              {itemsDisplayNames[item?._id] &&
                                itemsDisplayNames[item?._id]}
                            </span>
                            <div className="flex gap-2 md:gap-4 items-center">
                              <button
                                className={"cursor-pointer"}
                                onClick={() => duplicateItem(item)}
                              >
                                <CopyAllOutlined
                                  className={"text-coolBlue"}
                                  fontSize={"small"}
                                />
                              </button>
                              <button
                                className={"cursor-pointer"}
                                onClick={() => _editItem(item._id)}
                              >
                                <EditOutlined
                                  className={"text-coolBlue"}
                                  fontSize={"small"}
                                />
                              </button>
                              {user?.role !== "customer" && (
                                <button
                                  className={"cursor-pointer"}
                                  onClick={() => {
                                    setDeleteRoomId(item._id);
                                    handleDeleteItemDialogOpen();
                                  }}
                                >
                                  <DeleteForeverOutlined
                                    className={"text-coolBlue"}
                                    fontSize={"small"}
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <AlertDialog
        open={deleteRoomDialogOpen}
        handleClose={handleDeleteRoomDialogClose}
        accept={() => handleRoomDelete(deleteRoomQueue)}
        content={"Delete this room?"}
      />
      <AlertDialog
        open={deleteMultipleRoomsPopupOpen}
        handleClose={() => setDeleteMultipleRoomsPopupOpen(false)}
        accept={() => {
          handleMultipleRoomsDelete(selectedRoomsForDelete);
          setSelctedRoomsForDelete([]);
          setDeleteMultipleRoomsPopupOpen(false);
          setDeleteMultipleRooms(false);
        }}
        content={"Delete the selected rooms?"}
      />
      <div className="flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] bg-[#fff] md:px-4 h-screen overflow-scroll no-scrollbar pt-4 md:pt-10">
        <div className="flex gap-4 items-center mx-4 md:mx-5">
          <button onClick={handleRoomsAndAreasClose}>
            <ChevronLeftRounded className={"text-coolBlue"} fontSize="large" />
          </button>
          <span className="font-bold text-base md:text-xl text-[#212121]">
            Rooms & Areas Overview
          </span>
        </div>
        <div className="flex items-center justify-between mx-4 md:mx-8  font-medium text-sm text-[#7C7C7C]">
          <div className="flex gap-2">
            <span
              className="text-coolBlue cursor-pointer"
              onClick={handleRoomsAndAreasClose}
            >
              Overview
            </span>
            <span> / </span>
            <span>Rooms & Areas</span>
          </div>
          {rooms.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                className="hidden md:block !bg-red-600 primary-button"
                onClick={
                  deleteMultipleRooms
                    ? () => setDeleteMultipleRoomsPopupOpen(true)
                    : () => setDeleteMultipleRooms(true)
                }
              >
                {deleteMultipleRooms
                  ? `Delete (${selectedRoomsForDelete.length})`
                  : "Delete Rooms"}
              </button>
              <button
                className="hidden md:block primary-button"
                onClick={handleAddRoomOpen}
              >
                + Add Room
              </button>
            </div>
          )}
        </div>

        {rooms.length === 0 && (
          <div className="flex flex-col justify-center items-center gap-12 md:bg-white mx-4 md:mx-8 py-16 ">
            <img src={add__room} alt="Add room" />
            <button className="primary-button" onClick={handleAddRoomOpen}>
              + Add Room
            </button>
          </div>
        )}
        {rooms.length > 0 && (
          <div className="flex flex-col gap-2 mx-4 md:mx-8">
            {rooms.map((room, idx) => (
              <>
                <div
                  className={`hover:bg-[#EFEAFE] border border-gray-100 flex justify-between items-center px-3 md:px-6 py-3 md:py-4 rounded-md cursor-grabbing`}
                  draggable
                  onDragStart={(e) => (e.dataTransfer.effectAllowed = "move")}
                  onDrag={() => (dragRoom.current = idx)}
                  onDragEnter={() => (draggedOverRoom.current = idx)}
                  onDragEnd={() => {
                    const elems = handleSort(rooms, dragRoom, draggedOverRoom);
                    setRooms(elems);
                    handleRoomSort(elems);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DragIndicator
                    fontSize={"small"}
                    className={"text-gray-400 mr-3"}
                  />
                  <span
                    onClick={() => _editRoom(room)}
                    className="text-sm font-medium w-full"
                  >
                    {room?.display_name &&
                      convertToTitleCase(room?.display_name)}
                  </span>
                  <div className="flex items-center gap-2 md:gap-4">
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        setRenameRoomQueue(room);
                        handleRenameModalOpen();
                      }}
                    >
                      <DriveFileRenameOutlineIcon
                        fontSize={"small"}
                        className={"text-coolBlue"}
                      />
                    </button>
                    <button
                      className="cursor-pointer"
                      onClick={() => duplicateRoom(room)}
                    >
                      <CopyAllOutlined
                        fontSize={"small"}
                        className={"text-coolBlue"}
                      />
                    </button>
                    <button
                      className="cursor-pointer"
                      onClick={() => _editRoom(room)}
                    >
                      <EditOutlined
                        fontSize={"small"}
                        className={"text-coolBlue"}
                      />
                    </button>
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        setDeleteRoomQueue(room);
                        handleDeleteRoomDialogOpen();
                      }}
                    >
                      <DeleteForeverOutlined
                        fontSize={"small"}
                        className={"text-coolBlue"}
                      />
                    </button>
                    {deleteMultipleRooms && (
                      <Checkbox
                        checked={selectedRoomsForDelete.includes(
                          room?.display_name
                        )}
                        handleChange={(e) => {
                          setSelctedRoomsForDelete(
                            selectedRoomsForDelete?.includes(room?.display_name)
                              ? selectedRoomsForDelete.filter(
                                  (r) => r !== room?.display_name
                                )
                              : [...selectedRoomsForDelete, room?.display_name]
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
              </>
            ))}
          </div>
        )}
        {rooms.length > 0 && (
          <button
            className="block md:hidden mx-4 h-[40px] bg-coolBlue text-white rounded-lg shadow-lg text-sm mt-20"
            onClick={handleAddRoomOpen}
          >
            Add Room
          </button>
        )}
      </div>

      <Modal
        open={addItemOpen}
        onClose={handleAddItemClose}
        hideBackdrop={true}
      >
        <div className="flex justify-end mt-24 md:mt-0">
          <div className="flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] md:px-4 bg-[#fff] h-screen overflow-y-scroll pt-4 md:pt-10">
            <div className="flex gap-4 items-center mx-4 md:mx-8">
              <button onClick={handleAddItemClose}>
                <ChevronLeftRounded
                  className={"text-coolBlue"}
                  fontSize="large"
                />
              </button>
              <span className="font-bold text-base md:text-xl text-[#212121]">
                {item?.class_type === "general_overview"
                  ? "General Overview"
                  : editRoomType.length > 0 &&
                    convertToTitleCase(editRoomType) + " item"}
              </span>
            </div>
            <div className="flex items-center justify-between mx-4 md:mx-8  font-medium text-sm text-[#7C7C7C]">
              <div className="flex gap-2 flex-wrap">
                <span
                  className="text-coolBlue cursor-pointer"
                  onClick={handleRoomsAndAreasClose}
                >
                  Overview
                </span>
                <span> / </span>
                <span
                  className="text-coolBlue cursor-pointer"
                  onClick={handleEditRoomClose}
                >
                  Rooms & Areas
                </span>
                <span> / </span>
                <span
                  className="text-coolBlue cursor-pointer"
                  onClick={handleAddItemClose}
                >
                  {editRoomType.length > 0 && convertToTitleCase(editRoomType)}
                </span>
                <span> / </span>
                {itemForm?.type && (
                  <span>
                    {itemForm?.type && convertToTitleCase(itemForm?.type)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-8 mx-4 md:mx-8 md:px-32 py-2 md:py-8 mb-20">
              <div className="flex flex-col gap-2">
                <AutoComplete
                  header={"Item Type"}
                  placeholder={"Item Type"}
                  name="type"
                  value={
                    itemForm?.type === "general_overview"
                      ? itemForm?.type && convertToTitleCase(itemForm?.type)
                      : itemForm?.type
                  }
                  onInputChange={(e, val) => {
                    setItemForm({ ...itemForm, type: val });
                    console.log(val.length);
                  }}
                  handleChange={(e, val) => {
                    setItemForm({ ...itemForm, type: val });
                    getRoomItemDescription(val);
                  }}
                  disabled={item?.class_type === "general_overview"}
                  data={itemTypeValues}
                />
              </div>
              {report_type === "Checkout Report" &&
                linked_inventory_report !== "0" &&
                linked_inventory_report && (
                  <>
                    <div className="flex flex-col gap-2 pointer-events-none">
                      <label
                        htmlFor="name"
                        className="text-sm text-[#282828]  font-medium"
                      >
                        Old Description
                      </label>
                      <MultiSelectComponent
                        MSCdisabled={true}
                        value={itemForm.old_description}
                      />
                    </div>

                    <TextFormatterInput
                      type="text"
                      name="body"
                      value={itemForm.old_body}
                      disabled={true}
                    />

                    {itemForm?.type?.toLowerCase() !== "general overview" && (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-[#282828]  font-medium">
                          Old Condition
                        </span>
                        <div className="flex gap-4 flex-wrap">
                          {CONDITIONS.map((item) => (
                            <button
                              disabled
                              className="bg-gray-200 text-sm  font-medium text-white px-4 rounded-md py-1"
                              style={{
                                background:
                                  itemForm.old_condition === item
                                    ? COLORS[item].bg
                                    : "",
                                borderColor:
                                  itemForm.old_condition === item
                                    ? COLORS[item].border
                                    : "",
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {itemForm?.type?.toLowerCase() !== "general overview" && (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-[#282828]  font-medium">
                          Old Cleanliness
                        </span>
                        <div className="flex gap-4 flex-wrap">
                          {CONDITIONS.map((item) => (
                            <button
                              disbaled
                              className="bg-gray-300 text-sm  font-medium text-white px-4 rounded-md py-1 cursor-default"
                              style={{
                                background:
                                  itemForm.old_cleanliness === item
                                    ? COLORS[item].bg
                                    : "",
                                borderColor:
                                  itemForm.old_cleanliness === item
                                    ? COLORS[item].border
                                    : "",
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm text-[#282828]  font-medium"
                >
                  {report_type !== "Checkout Report"
                    ? "Description"
                    : "New Description"}
                </label>
                {/* {console.log(roomItemDescription)} */}
                <MultiSelectComponent
                  MSCdisabled={itemForm?.type === ""}
                  getOptionLabel={(option) => option.value}
                  value={itemForm.description}
                  options={roomItemDescription}
                  groupBy={(option) => option.heading}
                  onChange={handleDescriptionChange}
                  getLimitTagsText={(count) => `+${count}`} // modify the limit tag text, useful for translation too
                />
              </div>

              <TextFormatterInput
                type="text"
                name="body"
                value={itemForm.body}
                handleChange={handleChange}
              />

              {itemForm?.type?.toLowerCase() !== "general overview" && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-[#282828]  font-medium">
                    Condition
                  </span>
                  <div className="flex gap-4 flex-wrap">
                    {CONDITIONS.map((item) => (
                      <button
                        className="bg-gray-300 text-sm  font-medium text-white px-4 rounded-md py-1"
                        onClick={(e) => handleConditionChange(e, item)}
                        style={{
                          background:
                            itemForm.condition === item ? COLORS[item].bg : "",
                          borderColor:
                            itemForm.condition === item
                              ? COLORS[item].border
                              : "",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {itemForm?.type?.toLowerCase() !== "general overview" && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-[#282828]  font-medium">
                    Cleanliness
                  </span>
                  <div className="flex gap-4 flex-wrap">
                    {CONDITIONS.map((item) => (
                      <button
                        className="bg-gray-300 text-sm  font-medium text-white px-4 rounded-md py-1"
                        onClick={(e) => handleCleanlinessChange(e, item)}
                        style={{
                          background:
                            itemForm.cleanliness === item
                              ? COLORS[item].bg
                              : "",
                          borderColor:
                            itemForm.cleanliness === item
                              ? COLORS[item].border
                              : "",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {itemForm?.type?.toLowerCase() !== "general overview" && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-[#282828]  font-medium">
                    H&S Compliance
                  </span>
                  <Checkbox
                    Lstyle={{
                      fontFamily: "Inter",
                      fontStyle: "normal",
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: "26px",
                      color: "#282828",
                    }}
                    label={"Show in report"}
                    name="fire_alarm_compliance"
                    value={itemForm.fire_alarm_compliance}
                    handleChange={handleChange}
                    required={true}
                  />
                </div>
              )}

              {itemForm.fire_alarm_compliance && (
                <div className="flex justify-between flex-col gap-2 md:flex-row">
                  <div className="flex flex-col gap-1 w-full">
                    <DatePickerComponent
                      header={"Date Tested"}
                      name="date_tested"
                      value={itemForm.date_tested}
                      onChange={(date) => {
                        handleChange({
                          target: {
                            name: "date_tested",
                            value: dayjs(date).startOf("day").toISOString(),
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <DatePickerComponent
                      header={"Expiry Date"}
                      name="expiry_date"
                      value={itemForm.expiry_date}
                      onChange={(date) => {
                        handleChange({
                          target: {
                            name: "expiry_date",
                            value: dayjs(date).startOf("day").toISOString(),
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <span className="text-sm text-[#282828]  font-medium">
                  Maintenance
                </span>
                <Checkbox
                  Lstyle={{
                    fontFamily: "Inter",
                    fontStyle: "normal",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "26px",
                    color: "#282828",
                  }}
                  label={"Show in report"}
                  name="maintenance"
                  value={itemForm.maintenance}
                  handleChange={handleChange}
                  required={true}
                />
              </div>

              {itemForm.maintenance && (
                <>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-[#282828]  font-medium">
                      Maintenance issue
                    </span>
                    <div className="flex flex-wrap gap-4">
                      {MAINTENANCE_ISSUES.map((item) => (
                        <SelectableTag
                          item={item}
                          itemName={"maintenance_issue"}
                          itemForm={itemForm}
                          handleChange={handleMaintenanceChange}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-[#282828]  font-medium">
                      Liability
                    </span>
                    <div className="flex flex-wrap gap-4">
                      {LIABILITIES.map((item) => (
                        <SelectableTag
                          item={item}
                          itemName={"liability"}
                          itemForm={itemForm}
                          handleChange={handleLiabilityChange}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm text-[#282828]  font-medium"
                      htmlFor="name"
                    >
                      Remedial Cost
                    </label>
                    <input
                      className="bg-[#FEFEFF] border border-[#DFE6E9] px-4 py-2"
                      type="number"
                      step="0.1"
                      name="remedial_cost"
                      value={itemForm.remedial_cost}
                      onChange={handleChange}
                      placeholder="£"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm text-[#282828]  font-medium"
                      htmlFor="name"
                    >
                      Maintenance Comments
                    </label>
                    <textarea
                      rows="6"
                      name="comments"
                      value={itemForm.comments}
                      onChange={handleChange}
                      className="bg-[#FEFEFF] border border-[#DFE6E9] px-4 py-2"
                    />
                  </div>
                </>
              )}

              {/* {report_type?.toLowerCase()?.replace(/\s/g, "") === 'checkoutreport' && linked_inventory_report?.toLowerCase() !== 'none' ?  <Input
                                    placeholder={"Enter checkout comments"}
                                    header={"Check Out Comments"}
                                    name="check_out_comments"
                                    value={itemForm.check_out_comments}
                                    onChange={handleChange}
                                    type="textarea"
                                    taHeight='110px'
                                /> : <></>} */}

              {/* <UploadPhoto
                form={itemForm}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                handleDeletePhotoDialogOpen={handleDeletePhotoDialogOpen}
                deletePhotoDialogOpen={deletePhotoDialogOpen}
                handleDeletePhotoDialogClose={handleDeletePhotoDialogClose}
                deletePhoto={deletePhoto}
                itemName={"photos"}
                userRole={["customer"]}
                isAllowMultiple={true}
                width={"w-full"}
              /> */}

              {/* {itemForm?.type === "general_overview" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <label
                      className="text-sm text-[#282828]  font-medium"
                      htmlFor="photos"
                    >
                      Add 360° View
                    </label>
                    {itemForm?.photos_360?.length > 0 && (
                      <div {...getRootProps360()}>
                        <input {...getInputProps360()} />
                        <img
                          src={upload}
                          alt="upload"
                          className="bg-white p-1 shadow-lg rounded-sm cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  {itemForm?.photos_360?.length === 0 && (
                    <div
                      className="h-[220px] border-2 border-dashed bg-white flex flex-col justify-center items-center gap-4 cursor-pointer"
                      {...getRootProps360()}
                    >
                      <input {...getInputProps360()} />
                      <img src={upload_photo} alt="upload_photo" />
                      <span className="text-sm text-[#686868] font-medium">
                        Click or drag a file to this area to upload.
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {itemForm?.photos_360.map((item) => (
                      <div className="flex bg-white items-center justify-between border-2 border-[#eeeeee] rounded-md shadow-lg">
                        <div className="flex flex-col items-end p-1 w-full">
                          {user?.role !== "customer" && (
                            <button onClick={handleDelete360PhotoDialogOpen}>
                              <DeleteForeverRounded color="error" />
                            </button>
                          )}
                          <img
                            src={item.length > 0 ? item : photo_bw}
                            alt="photo_bw"
                            className="max-h-[100px]"
                          />
                        </div>
                        <AlertDialog
                          open={delete360PhotoDialogOpen}
                          handleClose={handleDelete360PhotoDialogClose}
                          accept={() => delete360Photo(item)}
                          content={"Delete this 360 photo?"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              <div className="flex justify-end gap-2">
                <button
                  className="secondary-button"
                  onClick={handlePrevItemNavigate}
                >
                  <ChevronRightOutlined
                    fontSize={"small"}
                    className="rotate-180"
                  />
                  Prev Item{" "}
                </button>
                {isEdit ? (
                  <button className="primary-button" onClick={_editItemSave}>
                    <CheckOutlined fontSize={"small"} /> Save
                  </button>
                ) : (
                  <button className="primary-button" onClick={_addItem}>
                    <CheckOutlined fontSize={"small"} /> Save
                  </button>
                )}
                {isEdit && (
                  <button
                    className="secondary-button"
                    onClick={handleNextItemNavigate}
                  >
                    Next Item <ChevronRightOutlined fontSize={"small"} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoomsView;
