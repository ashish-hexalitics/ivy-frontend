import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useReportState } from "../../contexts/reportContext";
import Input from "../../components/Input/Input";
import MultiSelectComponent from "../../components/MultiSelect";
import Checkbox from "../../components/Checkbox/Checkbox";
import {
  CheckOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  CloseOutlined,
  DeleteForeverOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { MenuItem, Select, Stack, Switch, useMediaQuery, useTheme, } from "@mui/material";
import { API_URL, PROPERTY_TYPES } from "../../utils/constants";
import axios from "axios";
import { useToastState } from "../../contexts/toastContext";
import AlertDialog from "../../components/AlertDialog";
import { useAuthState } from "../../contexts/authContext";
import { useAllDataState } from "../../contexts/allDataContext";
import { v4 as uuidv4 } from "uuid";
import CheckIcon from "@mui/icons-material/Check";
import { convertToTitleCase, handleSort } from "../../utils/helper";
import UploadPhoto from "../../components/Upload/UploadPhoto";
import DraggingQuestions from "./DraggingQuestions";

const Tabs = ["Company", "Overview", "Report"];
const Overview_Tabs = ["inventory", "inspection", "checkout"];
// const REPORT_TEMPLATES = [
//   "Studio flat",
//   "3 bed semi-detached house",
//   "4 bed detached house",
// ];

const SettingsView = () => {
  const { getDocLink } = useReportState();
  const { triggerToast } = useToastState();
  const { token } = useAuthState();
  const { amenityList, locationList } = useAllDataState();

  const [allSettings, setAllSettings] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Company");
  const [selectedOverviewTab, setSelectedOverviewTab] = useState("inventory");
  const [overviewEntities_Inventory, setOverviewEntities_Inventory] = useState(
    []
  );
  const [overviewEntities_Checkout, setOverviewEntities_Checkout] = useState(
    []
  );
  const [overviewEntities_Inspection, setOverviewEntities_Inspection] =
    useState([]);
  const [inventoryId, setInventoryId] = useState("");
  const [checkoutId, setCheckoutId] = useState("");
  const [inspectionId, setInspectionId] = useState("");

  const [companyForm, setCompanyForm] = useState({
    logo: "",
    name: "",
    property_types: [],
    property_amenities: [],
    default_locations: [],
  });
  const [reportForm, setReportForm] = useState({
    declaration: "",
    disclaimer: "",
    show_disclaimer: false,
  });

  const handleCompanyFormChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm({ ...companyForm, [name]: value });
    if (settingsStatus[name] === 1)
      setSettingsStatus({ ...settingsStatus, [name]: 2 });
  };
  const handleReportFormChange = (e) => {
    const { name, value } = e.target;
    setReportForm({ ...reportForm, [name]: value });
    if (settingsStatus[name] === 1)
      setSettingsStatus({ ...settingsStatus, [name]: 2 });
  };

  const handlePropertyTypesChange = (event, value) => {
    setCompanyForm({ ...companyForm, property_types: value });
    if (settingsStatus.property_types === 1)
      setSettingsStatus({ ...settingsStatus, property_types: 2 });
  };
  const handlePropertyAmenitiesChange = (event, value) => {
    if (settingsStatus.property_amenities === 1)
      setSettingsStatus({ ...settingsStatus, property_amenities: 2 });
    setCompanyForm({ ...companyForm, property_amenities: value });
  };
  const handleDefaultLocationsChange = (event, value) => {
    if (settingsStatus.default_locations === 1)
      setSettingsStatus({ ...settingsStatus, default_locations: 2 });
    setCompanyForm({ ...companyForm, default_locations: value });
  };

  // 0--> doesnt Exist, 1--> exist, 2--> exist && updated
  const [settingsStatus, setSettingsStatus] = useState({
    logo: 0,
    name: 0,
    property_types: 0,
    property_amenities: 0,
    default_locations: 0,
    declaration: 0,
    disclaimer: 0,
    show_disclaimer: 0,
  });

  const getSettings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/account/settings`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = response.data.data;

      data.forEach((item) => {
        if (item.entity_type === "overview_inventory_questions") {
          setOverviewEntities_Inventory(item.entity_value);
          setInventoryId(item._id);
        } else if (item.entity_type === "overview_checkout_questions") {
          setOverviewEntities_Checkout(item.entity_value);
          setCheckoutId(item._id);
        } else if (item.entity_type === "overview_inspection_questions") {
          setOverviewEntities_Inspection(item.entity_value);
          setInspectionId(item._id);
        }
      });
      let obj = {};
      data.forEach((entity) => {
        if (entity.entity_type === "company_logo") {
          obj.logo_status = 1;
          obj.logo = entity.entity_value[0];
        }
        if (entity.entity_type === "company_name") {
          obj.name_status = 1;
          obj.name = entity.entity_value[0];
        }
        if (entity.entity_type === "property_types") {
          obj.property_types_status = 1;
          obj.property_types = entity.entity_value;
        }
        if (entity.entity_type === "property_amenities") {
          obj.property_amenities_status = 1;
          obj.property_amenities = entity.entity_value;
        }
        if (entity.entity_type === "default_locations") {
          obj.default_locations_status = 1;
          obj.default_locations = entity.entity_value;
        }
        if (entity.entity_type === "disclaimer") {
          obj.disclaimer_status = 1;
          obj.disclaimer = entity.entity_value[0];
        }
        if (entity.entity_type === "declaration") {
          obj.declaration_status = 1;
          obj.declaration = entity.entity_value[0];
        }
        if (entity.entity_type === "show_disclaimer") {
          obj.show_disclaimer_status = 1;
          obj.show_disclaimer = entity.entity_value[0];
        }
      });
      setCompanyForm({
        logo: obj.logo ? obj.logo : "",
        name: obj.name ? obj.name : "",
        property_amenities: obj.property_amenities
          ? obj.property_amenities
          : "",
        property_types: obj.property_types ? obj.property_types : "",
        default_locations: obj.default_locations ? obj.default_locations : "",
      });
      setReportForm({
        declaration: obj.declaration ? obj.declaration : "",
        disclaimer: obj.disclaimer ? obj.disclaimer : "",
        show_disclaimer: obj.show_disclaimer ? obj.show_disclaimer : false,
      });
      setSettingsStatus({
        logo: obj.logo_status ? obj.logo_status : 0,
        name: obj.name_status ? obj.name_status : 0,
        property_amenities: obj.property_amenities_status
          ? obj.property_amenities_status
          : 0,
        property_types: obj.property_types_status
          ? obj.property_types_status
          : 0,
        default_locations: obj.default_locations_status
          ? obj.default_locations_status
          : 0,
        declaration: obj.declaration_status ? obj.declaration_status : 0,
        disclaimer: obj.disclaimer_status ? obj.disclaimer_status : 0,
        show_disclaimer: obj.show_disclaimer_status
          ? obj.show_disclaimer_status
          : 0,
      });
      setAllSettings(data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    getSettings();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: {
      "image/*": [],
    },
    onDropAccepted: (file) => {
      const formData = new FormData();
      formData.append("document", file[0]);
      let secure_url = getDocLink(formData, "document");
      secure_url.then((res) => {
        setCompanyForm({ ...companyForm, logo: res });
        if (settingsStatus.logo === 1)
          setSettingsStatus({ ...settingsStatus, logo: 2 });
      });
    },
  });

  const nextTab = () => {
    if (Tabs.indexOf(selectedTab) === Tabs.length - 1) {
      return;
    } else {
      setSelectedTab(Tabs[Tabs.indexOf(selectedTab) + 1]);
    }
  };
  const prevTab = () => {
    if (Tabs.indexOf(selectedTab) === 0) {
      return;
    } else {
      setSelectedTab(Tabs[Tabs.indexOf(selectedTab) - 1]);
    }
  };

  const saveCompanyForm = useCallback(async () => {
    const {
      logo,
      name,
      property_amenities,
      property_types,
      default_locations,
    } = companyForm;
    if (settingsStatus.logo === 0) {
      if (logo !== "") {
        try {
          const response = await axios.post(
            `${API_URL}/account/settings`,
            {
              entity_type: "company_logo",
              entity_value: [logo],
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Settings created", "success");
        } catch (error) {
          triggerToast(
            "Settings could not be updated! Please try again!",
            "error"
          );
        }
      } else {
        triggerToast("Upload a logo before saving!", "error");
      }
    } else if (settingsStatus.logo === 2) {
      const id = allSettings.find(
        (item) => item.entity_type === "company_logo"
      )?._id;
      try {
        const response = await axios.put(
          `${API_URL}/account/settings/${id}`,
          {
            entity_type: "company_logo",
            entity_value: [logo],
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Settings updated", "success");
      } catch (error) {
        triggerToast(
          "Settings could not be updated! Please try again!",
          "error"
        );
      }
    }
    if (settingsStatus.name === 0) {
      if (name !== "") {
        try {
          const response = await axios.post(
            `${API_URL}/account/settings`,
            {
              entity_type: "company_name",
              entity_value: [name],
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Settings created", "success");
        } catch (error) {
          triggerToast(
            "Settings could not be updated! Please try again!",
            "error"
          );
        }
      } else {
        triggerToast("Set a company name before saving!", "error");
      }
    } else if (settingsStatus.name === 2) {
      try {
        const id = allSettings.find(
          (item) => item.entity_type === "company_name"
        )?._id;
        const response = await axios.put(
          `${API_URL}/account/settings/${id}`,
          {
            entity_type: "company_name",
            entity_value: [name],
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Settings updated", "success");
      } catch (error) {
        triggerToast(
          "Settings could not be updated! Please try again!",
          "error"
        );
      }
    }
    if (settingsStatus.property_types === 0) {
      if (property_types.length !== 0) {
        try {
          const response = await axios.post(
            `${API_URL}/account/settings`,
            {
              entity_type: "property_types",
              entity_value: property_types,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Settings created", "success");
        } catch (error) {
          triggerToast(
            "Settings could not be updated! Please try again!",
            "error"
          );
        }
      } else {
        triggerToast("Set property types before saving!", "error");
      }
    } else if (settingsStatus.property_types === 2) {
      try {
        const id = allSettings.find(
          (item) => item.entity_type === "property_types"
        )?._id;
        const response = await axios.put(
          `${API_URL}/account/settings/${id}`,
          {
            entity_type: "property_types",
            entity_value: property_types,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Settings updated", "success");
      } catch (error) {
        triggerToast(
          "Settings could not be updated! Please try again!",
          "error"
        );
      }
    }
    if (settingsStatus.property_amenities === 0) {
      if (property_amenities.length !== 0) {
        try {
          const response = await axios.post(
            `${API_URL}/account/settings`,
            {
              entity_type: "property_amenities",
              entity_value: property_amenities,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Settings created", "success");
        } catch (error) {
          triggerToast(
            "Settings could not be updated! Please try again!",
            "error"
          );
        }
      } else {
        triggerToast("Set property amenities before saving!", "error");
      }
    } else if (settingsStatus.property_amenities === 2) {
      try {
        const id = allSettings.find(
          (item) => item.entity_type === "property_amenities"
        )?._id;
        const response = await axios.put(
          `${API_URL}/account/settings/${id}`,
          {
            entity_type: "property_amenities",
            entity_value: property_amenities,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Settings updated", "success");
      } catch (error) {
        triggerToast(
          "Settings could not be updated! Please try again!",
          "error"
        );
      }
    }
    if (settingsStatus.default_locations === 0) {
      if (default_locations.length !== 0) {
        try {
          const response = await axios.post(
            `${API_URL}/account/settings`,
            {
              entity_type: "default_locations",
              entity_value: default_locations,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Settings created", "success");
        } catch (error) {
          triggerToast(
            "Settings could not be updated! Please try again!",
            "error"
          );
        }
      } else {
        triggerToast("Set default locations before saving!", "error");
      }
    } else if (settingsStatus.default_locations === 2) {
      try {
        const id = allSettings.find(
          (item) => item.entity_type === "default_locations"
        )?._id;
        const response = await axios.put(
          `${API_URL}/account/settings/${id}`,
          {
            entity_type: "default_locations",
            entity_value: default_locations,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Settings updated", "success");
      } catch (error) {
        triggerToast(
          "Settings could not be updated! Please try again!",
          "error"
        );
      }
    }
    getSettings();
  }, [
    companyForm,
    token,
    allSettings,
    settingsStatus,
    triggerToast,
    getSettings,
  ]);

  const saveReportForm = useCallback(async () => {
    const { disclaimer, declaration, show_disclaimer } = reportForm;
    if (settingsStatus.disclaimer === 0) {
      if (disclaimer !== "") {
        try {
          const response = await axios.post(
            `${API_URL}/account/settings`,
            {
              entity_type: "disclaimer",
              entity_value: [disclaimer],
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Settings created", "success");
        } catch (error) {
          triggerToast(
            "Settings could not be updated! Please try again!",
            "error"
          );
        }
      } else {
        triggerToast("Set disclaimer before saving!", "error");
      }
    } else if (settingsStatus.disclaimer === 2) {
      const id = allSettings.find(
        (item) => item.entity_type === "disclaimer"
      )?._id;
      try {
        const response = await axios.put(
          `${API_URL}/account/settings/${id}`,
          {
            entity_type: "disclaimer",
            entity_value: [disclaimer],
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Settings updated", "success");
      } catch (error) {
        triggerToast(
          "Settings could not be updated! Please try again!",
          "error"
        );
      }
    }
    if (settingsStatus.declaration === 0) {
      if (declaration !== "") {
        try {
          const response = await axios.post(
            `${API_URL}/account/settings`,
            {
              entity_type: "declaration",
              entity_value: [declaration],
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Settings created", "success");
        } catch (error) {
          triggerToast(
            "Settings could not be updated! Please try again!",
            "error"
          );
        }
      } else {
        triggerToast("Set disclaimer before saving!", "error");
      }
    } else if (settingsStatus.declaration === 2) {
      const id = allSettings.find(
        (item) => item.entity_type === "declaration"
      )?._id;
      try {
        const response = await axios.put(
          `${API_URL}/account/settings/${id}`,
          {
            entity_type: "declaration",
            entity_value: [declaration],
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Settings updated", "success");
      } catch (error) {
        triggerToast(
          "Settings could not be updated! Please try again!",
          "error"
        );
      }
    }
    if (settingsStatus.show_disclaimer === 0) {
      try {
        const response = await axios.post(
          `${API_URL}/account/settings`,
          {
            entity_type: "show_disclaimer",
            entity_value: [show_disclaimer],
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Settings created", "success");
      } catch (error) {
        triggerToast(
          "Settings could not be updated! Please try again!",
          "error"
        );
      }
    } else if (settingsStatus.show_disclaimer === 2) {
      const id = allSettings.find(
        (item) => item.entity_type === "show_disclaimer"
      )?._id;
      try {
        const response = await axios.put(
          `${API_URL}/account/settings/${id}`,
          {
            entity_type: "show_disclaimer",
            entity_value: [show_disclaimer],
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Settings updated", "success");
      } catch (error) {
        triggerToast(
          "Settings could not be updated! Please try again!",
          "error"
        );
      }
    }
    getSettings();
  }, [
    reportForm,
    allSettings,
    token,
    triggerToast,
    settingsStatus,
    getSettings,
  ]);

  const theme = useTheme();
  const lessThanSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [deletePhotoDialogOpen, setDeletePhotoDialogOpen] = useState(false);
  const handleDeletePhotoDialogOpen = () => setDeletePhotoDialogOpen(true);
  const handleDeletePhotoDialogClose = () => setDeletePhotoDialogOpen(false);

  const deletePhoto = () => {
    setCompanyForm({ ...companyForm, logo: "" });
    setSettingsStatus({ ...settingsStatus, logo: 2 });
    triggerToast("Save form now to see changes!", "info");
  };

  // OVERVIEW TAB
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(false);
  const [itemId, setItemId] = useState("");
  const [actionType, setActionType] = useState("");
  const saveOverviewForm = useCallback(async () => {
    if (question === "") {
      triggerToast(
        "Please type in a question & answer before saving!",
        "warning"
      );
      return;
    }
    if (selectedOverviewTab === "inventory") {
      if (inventoryId.length === 0) {
        try {
          const response = await axios.post(
            `${API_URL}/account/settings`,
            {
              entity_type: `overview_${selectedOverviewTab}_questions`,
              entity_value: [{ id: uuidv4(), question, answer }],
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Question & answer saved!", "success");
          getSettings();
        } catch (error) {
          triggerToast(
            "Question could not be saved! Please try again!",
            "error"
          );
        }
      } else {
        try {
          const response = await axios.put(
            `${API_URL}/account/settings/${inventoryId}`,
            {
              entity_type: `overview_${selectedOverviewTab}_questions`,
              entity_value: [
                ...overviewEntities_Inventory,
                { id: uuidv4(), question, answer },
              ],
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Question & answer saved!", "success");
          getSettings();
        } catch (error) {
          triggerToast(
            "Question could not be saved! Please try again!",
            "error"
          );
        }
      }
    } else if (selectedOverviewTab === "checkout") {
      if (checkoutId.length === 0) {
        try {
          const response = await axios.post(
            `${API_URL}/account/settings`,
            {
              entity_type: `overview_${selectedOverviewTab}_questions`,
              entity_value: [{ id: uuidv4(), question, answer }],
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Question & answer saved!", "success");
          getSettings();
        } catch (error) {
          triggerToast(
            "Question could not be saved! Please try again!",
            "error"
          );
        }
      } else {
        try {
          const response = await axios.put(
            `${API_URL}/account/settings/${checkoutId}`,
            {
              entity_type: `overview_${selectedOverviewTab}_questions`,
              entity_value: [
                ...overviewEntities_Checkout,
                { id: uuidv4(), question, answer },
              ],
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Question & answer saved!", "success");
          getSettings();
        } catch (error) {
          triggerToast(
            "Question could not be saved! Please try again!",
            "error"
          );
        }
      }
    } else if (selectedOverviewTab === "inspection") {
      if (inspectionId.length === 0) {
        try {
          const response = await axios.post(
            `${API_URL}/account/settings`,
            {
              entity_type: `overview_${selectedOverviewTab}_questions`,
              entity_value: [{ id: uuidv4(), question, answer }],
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Question & answer saved!", "success");
          getSettings();
        } catch (error) {
          triggerToast(
            "Question could not be saved! Please try again!",
            "error"
          );
        }
      } else {
        try {
          const response = await axios.put(
            `${API_URL}/account/settings/${inspectionId}`,
            {
              entity_type: `overview_${selectedOverviewTab}_questions`,
              entity_value: [
                ...overviewEntities_Inspection,
                { id: uuidv4(), question, answer },
              ],
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = response.data;
          triggerToast("Question & answer saved!", "success");
          getSettings();
        } catch (error) {
          triggerToast(
            "Question could not be saved! Please try again!",
            "error"
          );
        }
      }
    }
    setQuestion("");
    setAnswer(false);
    setActionType("");
    setItemId("");
  }, [
    question,
    answer,
    triggerToast,
    token,
    selectedOverviewTab,
    getSettings,
    overviewEntities_Inventory,
    inventoryId,
    checkoutId,
    inspectionId,
    overviewEntities_Checkout,
    overviewEntities_Inspection,
  ]);

  const handleQuestionsSort = async () => {
    let id = ""
    let elems = [];

    switch (selectedOverviewTab) {
      case "inventory":
        id = inventoryId;
        elems = handleSort(overviewEntities_Inventory, dragItem, draggedOverItem);
        await setOverviewEntities_Inventory(elems);

        break;
      case "checkout":
        id = checkoutId
        elems = handleSort(overviewEntities_Checkout, dragItem, draggedOverItem);
        await setOverviewEntities_Checkout(elems);

        break;
      case "inspection":
        id = inspectionId
        elems = handleSort(overviewEntities_Inspection, dragItem, draggedOverItem);
        await setOverviewEntities_Inspection(elems);

        break;
    }

    await updateSettings(id, selectedOverviewTab, elems);
    setActionType("");
    setItemId("");
  }

  const updateSettings = async (settingsId, selectedOverviewTab, elems) => {
    try {
      await axios.put(
        `${API_URL}/account/settings/${settingsId}`,
        {
          entity_type: `overview_${selectedOverviewTab}_questions`,
          entity_value: elems,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      triggerToast("Question sorted successfully!", "success");
    } catch (error) {
      triggerToast(
        "Question could not be sorted! Please try again!",
        "error"
      );
    } finally {
      getSettings();
    }
  }

  const editOverviewForm = useCallback(async () => {
    if (question === "") {
      triggerToast(
        "Please type in a question & answer before saving!",
        "warning"
      );
      return;
    }
    if (selectedOverviewTab === "inventory") {
      let items = overviewEntities_Inventory.map((item) =>
        item.id !== itemId ? item : { id: itemId, question, answer }
      );
      try {
        const response = await axios.put(
          `${API_URL}/account/settings/${inventoryId}`,
          {
            entity_type: `overview_${selectedOverviewTab}_questions`,
            entity_value: items,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Question & answer saved!", "success");
        getSettings();
      } catch (error) {
        triggerToast("Question could not be saved! Please try again!", "error");
      }
    } else if (selectedOverviewTab === "checkout") {
      let items = overviewEntities_Checkout.map((item) =>
        item.id !== itemId ? item : { id: itemId, question, answer }
      );
      try {
        const response = await axios.put(
          `${API_URL}/account/settings/${checkoutId}`,
          {
            entity_type: `overview_${selectedOverviewTab}_questions`,
            entity_value: items,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Question & answer saved!", "success");
        getSettings();
      } catch (error) {
        triggerToast("Question could not be saved! Please try again!", "error");
      }
    } else if (selectedOverviewTab === "inspection") {
      let items = overviewEntities_Inspection.map((item) =>
        item.id !== itemId ? item : { id: itemId, question, answer }
      );
      try {
        const response = await axios.put(
          `${API_URL}/account/settings/${inspectionId}`,
          {
            entity_type: `overview_${selectedOverviewTab}_questions`,
            entity_value: items,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Question & answer saved!", "success");
        getSettings();
      } catch (error) {
        triggerToast("Question could not be saved! Please try again!", "error");
      }
    }
    setItemId("");
    setActionType("");
    setQuestion("");
    setAnswer(false);
  }, [
    question,
    answer,
    itemId,
    triggerToast,
    inspectionId,
    inventoryId,
    checkoutId,
    getSettings,
    overviewEntities_Checkout,
    overviewEntities_Inspection,
    overviewEntities_Inventory,
    selectedOverviewTab,
    token,
  ]);

  const handleEditDelete = (item, type) => {
    let question = {};
    if (selectedOverviewTab === "inventory") {
      question = overviewEntities_Inventory.filter(
        (ques) => ques.id === item
      )[0];
    } else if (selectedOverviewTab === "checkout") {
      question = overviewEntities_Checkout.filter(
        (ques) => ques.id === item
      )[0];
    } else if (selectedOverviewTab === "inspection") {
      question = overviewEntities_Inspection.filter(
        (ques) => ques.id === item
      )[0];
    }
    setItemId(item);
    if (type === "edit") {
      setActionType("edit");
      setQuestion(question.question);
      setAnswer(question.answer);
    } else if (type === "delete") {
      setActionType("delete");
      handleDeleteItemDialogOpen();
    }
  };

  const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false);
  const handleDeleteItemDialogOpen = () => setDeleteItemDialogOpen(true);
  const handleDeleteItemDialogClose = () => setDeleteItemDialogOpen(false);

  const deleteItem = useCallback(async () => {
    if (selectedOverviewTab === "inventory") {
      let items = overviewEntities_Inventory.filter(
        (item) => item.id !== itemId
      );
      try {
        const response = await axios.put(
          `${API_URL}/account/settings/${inventoryId}`,
          {
            entity_type: `overview_${selectedOverviewTab}_questions`,
            entity_value: items,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Question & answer deleted!", "success");
        getSettings();
      } catch (error) {
        triggerToast(
          "Question could not be deleted! Please try again!",
          "error"
        );
      }
    } else if (selectedOverviewTab === "checkout") {
      let items = overviewEntities_Checkout.filter(
        (item) => item.id !== itemId
      );
      try {
        const response = await axios.put(
          `${API_URL}/account/settings/${checkoutId}`,
          {
            entity_type: `overview_${selectedOverviewTab}_questions`,
            entity_value: items,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Question & answer deleted!", "success");
        getSettings();
      } catch (error) {
        triggerToast(
          "Question could not be deleted! Please try again!",
          "error"
        );
      }
    } else if (selectedOverviewTab === "inspection") {
      let items = overviewEntities_Inspection.filter(
        (item) => item.id !== itemId
      );
      try {
        const response = await axios.put(
          `${API_URL}/account/settings/${inspectionId}`,
          {
            entity_type: `overview_${selectedOverviewTab}_questions`,
            entity_value: items,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        triggerToast("Question & answer deleted!", "success");
        getSettings();
      } catch (error) {
        triggerToast(
          "Question could not be deleted! Please try again!",
          "error"
        );
      }
    }
    setActionType("");
    setItemId("");
  }, [
    getSettings,
    inspectionId,
    inventoryId,
    checkoutId,
    overviewEntities_Checkout,
    overviewEntities_Inspection,
    overviewEntities_Inventory,
    token,
    triggerToast,
    itemId,
    selectedOverviewTab,
  ]);


  const dragItem = useRef(0);
  const draggedOverItem = useRef(0);


  const noStyle = {
    color: '#f58686',
    backgroundColor: '#f6d8d8',
    padding: '3px 8px',
    borderRadius: 8
  };
  const yesStyle = {
    color: '#93cb93',
    backgroundColor: '#ddf8dd',
    padding: '3px 8px',
    borderRadius: 8
  };

  return (
    <div className='pb-1'>
      <div className='flex justify-between items-start'>
        <div className='flex gap-4 items-center mt-6'>
          <span className='flex mx-auto text-xl md:text-2xl  font-bold'>Settings</span>
        </div>
      </div>
      <div className='flex justify-between items-end mt-8'>
        <div className='hidden md:flex gap-12'>
          {Tabs.map(tab =>
            <span onClick={() => setSelectedTab(tab)} className={`text-sm md:text-md pb-2
                 ${selectedTab === tab ? 'text-[#502FD8] border-[#502FD8] border-b-2 font-bold' : 'hover:text-coolBlue font-bold'}  cursor-pointer`}>{tab === 'Overview' ? 'Overviews' : tab === 'Report' ? 'Report Text' : tab}</span>)}
        </div>
        <div className='block w-[100px]'></div>
      </div>

      <div className='flex md:hidden justify-between items-center px-4'>
        <ChevronLeftOutlined
          className={`${Tabs.indexOf(selectedTab) === 0 ? 'text-gray-400' : 'text-coolBlue'}`}
          fontSize='large' onClick={() => prevTab()} />
        <span className='text-coolBlue text-lg font-semibold'>{selectedTab}</span>
        <ChevronRightOutlined
          className={`${Tabs.indexOf(selectedTab) === Tabs.length - 1 ? 'text-gray-400' : 'text-coolBlue'}`}
          fontSize='large' onClick={() => nextTab()} />
      </div>

      {selectedTab === 'Company' && <div
        className='mx-0 mt-4 flex flex-col justify-center md:justify-start items-center px-4 md:px-0 py-4 md:py-8 gap-6'>
        <div className='flex flex-col gap-4 w-full mt-8'>
          <UploadPhoto form={companyForm} getRootProps={getRootProps} getInputProps={getInputProps}
            handleDeletePhotoDialogOpen={handleDeletePhotoDialogOpen}
            deletePhotoDialogOpen={deletePhotoDialogOpen}
            handleDeletePhotoDialogClose={handleDeletePhotoDialogClose} deletePhoto={deletePhoto}
            itemName={'logo'} isAllowMultiple={false} title={'Company Logo'} />
        </div>

        <div className='flex flex-col w-full gap-4'>
          <Input
            header={"Company name"}
            type={"text"}
            placeholder={"Company name"}
            name="name"
            value={companyForm.name}
            onChange={handleCompanyFormChange}
          />
          <div className='flex flex-col gap-2'>
            <span className='font-medium text-[#282828] text-sm'>Property types</span>
            <MultiSelectComponent
              getOptionLabel={(options) => options}
              value={companyForm.property_types}
              options={PROPERTY_TYPES}
              onChange={handlePropertyTypesChange}
              getLimitTagsText={(count) => `+${count}`} // modify the limit tag text, useful for translation too
            />
          </div>
          <div className='flex flex-col gap-2'>
            <span className='font-medium text-[#282828] text-sm'>Property amenities</span>
            <MultiSelectComponent
              getOptionLabel={(options) => options}
              value={companyForm.property_amenities}
              options={amenityList}
              onChange={handlePropertyAmenitiesChange}
              getLimitTagsText={(count) => `+${count}`} // modify the limit tag text, useful for translation too
            />
          </div>
          <div className='flex flex-col gap-2'>
            <span className='font-medium text-[#282828] text-sm'>Default locations</span>
            <MultiSelectComponent
              getOptionLabel={(options) => options}
              value={companyForm.default_locations}
              options={locationList}
              onChange={handleDefaultLocationsChange}
              getLimitTagsText={(count) => `+${count}`} // modify the limit tag text, useful for translation too
            />
          </div>
        </div>
        <div className='flex justify-center md:justify-end mt-6 w-full'>
          <button className='primary-button'
            onClick={saveCompanyForm}>
            <CheckIcon fontSize={'small'} /> Save
          </button>
        </div>
      </div>
      }

      {selectedTab === 'Report' && <div
        className='mx-0 flex flex-col justify-center items-center px-4 md:px-0 py-4 md:py-8 gap-6'>
        <div className='flex flex-col w-full   gap-4'>
          <Input
            header={"Declaration"}
            type={"textarea"}
            placeholder={"Declaration"}
            name="declaration"
            value={reportForm.declaration}
            onChange={handleReportFormChange}
            taHeight={`${lessThanSmall ? '140px' : '220px'}`}
            bg={'#fcfcfc'}
          />
          <Input
            header={"Disclaimer"}
            type={"textarea"}
            placeholder={"Disclaimer"}
            name="disclaimer"
            value={reportForm.disclaimer}
            onChange={handleReportFormChange}
            taHeight={`${lessThanSmall ? '140px' : '220px'}`}
            bg={'#fcfcfc'}
          />
          <Checkbox
            Lstyle={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontSize: "14px"
            }}
            label={"Show disclaimer at the end of reports"}
            name="show_disclaimer"
            value={reportForm.show_disclaimer}
            handleChange={(e) => {
              setReportForm({ ...reportForm, show_disclaimer: e.target.checked })
              if (settingsStatus.show_disclaimer === 1)
                setSettingsStatus({ ...settingsStatus, show_disclaimer: 2 })
            }}
          />
          <div className={'flex justify-end'}>
            <button
              className='primary-button mt-8'
              onClick={saveReportForm}><CheckOutlined className='mr-1' /> Save
            </button>
          </div>
        </div>
      </div>}

      {/* {selectedTab === 'Templates' && <div
                className='mx-0 flex flex-col justify-center items-center py-4 md:py-8 px-4 md:px-0 gap-6'>
                <div
                    className='flex flex-col w-full gap-4'>
                    <span className='font-bold text-[#282828] text-base md:text-lg my-2'>Report Name</span>
                    <div className='flex flex-col gap-4'>
                        {REPORT_TEMPLATES.map(item => <div
                            className='flex justify-between items-center md:py-4 px-6 py-2 md:bg-white rounded-md border border-gray-100'>
                            <span className='text-sm font-medium text-[#2D3436]'>{convertToTitleCase(item)}</span>
                            <div className='flex items-center gap-2 md:gap-3'>
                                <EditOutlined className={'text-coolBlue'} fontSize='small'/>
                                <DeleteForeverOutlined className={'text-coolBlue'} fontSize='small'/>
                            </div>
                        </div>)}
                    </div>

                    <div className='flex justify-end items-center'>
                        <button
                            className='primary-button mt-8'><CheckOutlined className='mr-1' /> Save
                        </button>
                    </div>
                </div>

            </div>} */}

      {selectedTab === 'Overview' &&
        <div className='mx-0 mt-4 items-center flex flex-col gap-12 mb-12'>
          <div className='flex flex-col py-4 md:py-8 px-4 md:px-0 w-full'>
            <div
              className='hidden md:flex gap-2 items-center py-1 px-1.5 rounded-md bg-gray-100 w-full'>
              {Overview_Tabs.map(tab => <span className={`font-semibold capitalize text-sm py-2 px-8 rounded-md cursor-pointer
                        ${selectedOverviewTab === tab ? 'bg-coolBlue text-white' : 'bg-transparent hover:text-coolBlue'}`}
                onClick={() => setSelectedOverviewTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>)}
            </div>
            <div className='block md:hidden w-full'>
              <Select value={selectedOverviewTab} className='w-full'>
                {Overview_Tabs.map(tab => <MenuItem value={tab}
                  onClick={() => setSelectedOverviewTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</MenuItem>)}
              </Select>
            </div>
            <div className='flex  flex-col gap-4 w-full md:w-full mt-8'>
              <Input type={'textarea'}
                header='Question'
                taHeight='80px'
                placeholder="Enter your question here"
                name="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <Stack direction="row" spacing={1} alignItems="center">
                <span className='text-sm mr-2'>Is yes in Green</span>
                <span style={!answer ? noStyle : { padding: '3px 8px', borderRadius: 8 }}
                  className='text-sm'>No</span>
                <Switch
                  sx={{
                    '& .MuiSwitch-switchBase': {
                      '&.Mui-checked': {
                        color: '#5131D7',
                        '& + .MuiSwitch-track': {
                          backgroundColor: 'rgb(186,180,204)',
                        },
                      }
                    }
                  }}
                  inputProps={{ 'aria-label': 'ant design' }}
                  name="answer"
                  value={answer}
                  checked={answer}
                  onChange={(e) => setAnswer(e.target.checked)}
                />
                <span style={answer ? yesStyle : { padding: '3px 8px', borderRadius: 8 }}
                  className='text-sm'>Yes</span>
              </Stack>

              <div className='flex gap-4 w-full justify-end'>
                {actionType === 'edit' &&
                  <button
                    className='secondary-button'
                    onClick={() => {
                      setQuestion('')
                      setAnswer(false)
                      setActionType('')
                    }}><CloseOutlined /> Cancel</button>
                }
                {actionType === 'edit' ?
                  <button
                    className='primary-button'
                    onClick={editOverviewForm}><CheckIcon fontSize={'small'} /> Save</button>
                  :
                  <button
                    className='primary-button'
                    onClick={saveOverviewForm}><CheckIcon fontSize={'small'} /> Save</button>
                }
              </div>

            </div>
          </div>

          {selectedOverviewTab === 'inventory' && <DraggingQuestions items={overviewEntities_Inventory}
            dragItem={dragItem}
            draggedOverItem={draggedOverItem}
            handleQuestionsSort={handleQuestionsSort}
            handleEditDelete={handleEditDelete}
            yesStyle={yesStyle} noStyle={noStyle} />
          }

          {selectedOverviewTab === 'checkout' && <DraggingQuestions items={overviewEntities_Checkout}
            dragItem={dragItem}
            draggedOverItem={draggedOverItem}
            handleQuestionsSort={handleQuestionsSort}
            handleEditDelete={handleEditDelete}
            yesStyle={yesStyle} noStyle={noStyle} />
          }

          {selectedOverviewTab === 'inspection' &&
            <DraggingQuestions items={overviewEntities_Inspection}
              dragItem={dragItem}
              draggedOverItem={draggedOverItem}
              handleQuestionsSort={handleQuestionsSort}
              handleEditDelete={handleEditDelete}
              yesStyle={yesStyle} noStyle={noStyle} />
          }
        </div>}

      <AlertDialog open={deleteItemDialogOpen} handleClose={handleDeleteItemDialogClose}
        accept={() => deleteItem()} content={"Delete this question?"} />
    </div>
  )
}

export default SettingsView;
