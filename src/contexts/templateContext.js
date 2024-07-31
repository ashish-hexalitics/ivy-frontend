import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { API_URL, X_API_KEY } from "../utils/constants";
import { useAuthState } from "./authContext";
import { useToastState } from "./toastContext";

const TemplateContext = createContext({
  status: null,

  propertyList: [],
  clerkList: [],
  reportTypeList: [],

  reports: [],
  allReports: [],
  isLoading: true,
  getTemplates: () => {},

  meters: [],
  addMeter: (body) => {},
  getMeters: (id) => {},
  updateMeter: (body, id) => {},

  utilities: [],
  addUtility: (body) => {},
  getUtilities: (id) => {},
  updateUtility: (body, id) => {},

  fireAlarm: [],
  getFireAlarmResponse: () => {},

  sign: [],
  getSignature: () => {},

  notes: [],
  getNotes: () => {},

  getDocLink: (formData, type) => {},
  addReportDocument: (id, url) => {},

  addRoomItem: (body, message) => {},
  deleteItem: (id, type, report_id) => {},

  rooms: [],
  allRoomsData: [],
  getRooms: () => {},
  updateRoomItem: (body, id) => {},

  getPropertyList: () => {},
  getRoomItemDescription: () => {},
  roomItemDescription: [],

  checkInOverview: [],
  getCheckInOverviewResponse: () => {},
});

export const useTemplateState = () => useContext(TemplateContext);

export const TemplateStateProvider = ({ children }) => {
  const { token, logoutUser, getStats } = useAuthState();
  const { triggerToast } = useToastState();
  const [templates, setTemplates] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [meters, setMeters] = useState([]);
  const [utilities, setUtilities] = useState([]);
  const [fireAlarm, setFireAlarm] = useState([]);
  const [sign, setSign] = useState([]);
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState(null);
  const [checkInOverview, setCheckInOverview] = useState([]);

  // TYPES DATA
  const [propertyList, setPropertyList] = useState([]);
  const [reportTypeList, setReportTypeList] = useState([]);
  const [clerkList, setClerkList] = useState([]);
  const [roomItemDescription, setRoomItemDescription] = useState([]);

  const getPropertyList = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/account/property`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.data;
      setPropertyList(data.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const getReportTypeList = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/console/account/settings?entity_type=report_type`,
        {
          headers: {
            "x-api-key": X_API_KEY,
          },
        }
      );
      const data = await response.data;
      setReportTypeList(data?.data[0].entity_value);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getClerkList = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/account/users?type=clerk`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.data;
      setClerkList(data.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    if (token !== "") {
      getPropertyList();
      getReportTypeList();
      getClerkList();
    }
  }, [getPropertyList, getReportTypeList, getClerkList, token]);

  // ROOM ITEM DESCRIPTION
  const getRoomItemDescription = useCallback(
    async (item) => {
      console.log(item);
      setRoomItemDescription([]);
      try {
        const response = await axios.post(
          `${API_URL}/console/account/item/description?item=${
            item === "general_overview" ? "General Overview" : item
            // .toLowerCase()
            // .replace(/[0-9\s]/g, "_")
          }`,
          {},
          {
            headers: {
              "x-api-key": "1234567891",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        const res = data.data.entity_value;
        let keys = Object.keys(res);
        const finalData = [];
        let count = 0;
        keys.map((k) => {
          res[k].map((r) =>
            finalData.push({ heading: k, value: r, ind: count++ })
          );
        });
        setRoomItemDescription(finalData);
      } catch (error) {
        console.log(error);
        setRoomItemDescription([]);
      }
    },
    [token]
  );

  // REPORTS FETCH
  const getTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/account/template`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.data;
      setAllTemplates(data?.data);
      setTemplates(
        data?.data.map((item) => {
          return {
            templateType: item?.template_type,
            templateName: item?.template_name,
            dateCreated: item?.date_created,
            noOfRooms: item?.no_of_rooms,
            addedBy: item?.added_by?.name,
            viewTemplate: {
              route: "/templates/response",
              item,
            },
          };
        })
      );
      setIsLoading(false);
      // getStats();
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        logoutUser();
      }
    }
  }, [token, logoutUser, getStats]);

  // METERS
  const getMeters = useCallback(
    async (id) => {
      try {
        const response = await axios.get(
          `${API_URL}/account/template_response?template_id=${id}&entity_type=meters`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        setMeters(data.data);
      } catch (error) {
        console.log(error);
      }
    },
    [token]
  );

  const addMeter = useCallback(
    async (body) => {
      try {
        const response = await axios.post(
          `${API_URL}/account/template_response`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        triggerToast("Meter added successfully!", "success");
        getMeters(body.template_id);
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, triggerToast, getMeters]
  );

  const updateMeter = useCallback(
    async (body, id) => {
      try {
        const response = await axios.put(
          `${API_URL}/account/template_response/${id}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        triggerToast("Meter updated successfully!", "success");
        getMeters(body.template_id);
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, triggerToast, getMeters]
  );

  // UTILITIES
  const getUtilities = useCallback(
    async (id) => {
      try {
        const response = await axios.get(
          `${API_URL}/account/template_response?template_id=${id}&entity_type=utilities`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        setUtilities(data.data);
      } catch (error) {
        console.log(error);
      }
    },
    [token]
  );

  const addUtility = useCallback(
    async (body) => {
      try {
        const response = await axios.post(
          `${API_URL}/account/template_response`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        triggerToast("Utility added successfully!", "success");
        getUtilities(body.template_id);
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, triggerToast, getUtilities]
  );

  const updateUtility = useCallback(
    async (body, id) => {
      try {
        const response = await axios.put(
          `${API_URL}/account/template_response/${id}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        triggerToast("Utility updated successfully", "success");
        getUtilities(body.template_id);
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, triggerToast, getUtilities]
  );

  // GET DOCUMENT CLOUDINARY LINK
  const getDocLink = useCallback(
    async (formData, type) => {
      if (type === "photo") {
        try {
          setIsLoading(true);
          const response = await axios.post(
            `${API_URL}/console/account/image_upload`,
            formData,
            {
              headers: {
                "x-api-key": X_API_KEY,
              },
            }
          );
          const data = await response.data;
          triggerToast("Photo upload successful!", "success");
          return data?.data?.secure_url;
        } catch (error) {
          triggerToast(error.response.data.message, "error");
        } finally {
          setIsLoading(false);
        }
      } else if (type === "document") {
        try {
          setIsLoading(true);
          const response = await axios.post(
            `${API_URL}/console/account/document_upload`,
            formData,
            {
              headers: {
                "x-api-key": X_API_KEY,
              },
            }
          );
          const data = await response.data;
          triggerToast("Document upload successful!", "success");
          return data?.data?.secure_url;
        } catch (error) {
          triggerToast("Could not upload file! Network error!", "error");
        } finally {
          setIsLoading(false);
        }
      } else if (type === "report") {
        try {
          setIsLoading(true);
          const response = await axios.post(
            `${API_URL}/console/account/document_upload?type=report`,
            formData,
            {
              headers: {
                "x-api-key": X_API_KEY,
              },
            }
          );
          const data = await response.data;
          triggerToast("Document upload successful!", "success");
          return data?.data?.secure_url;
        } catch (error) {
          triggerToast("Could not upload file! Network error!", "error");
        } finally {
          setIsLoading(false);
        }
      }
    },
    [triggerToast]
  );

  // ADD REPORT DOCUMENT
  const addReportDocument = useCallback(
    async (id, url) => {
      try {
        const response = await axios.post(
          `${API_URL}/account/report/${id}/add_document`,
          {
            url,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        triggerToast("Document added successfully!", "success");
        getTemplates();
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, getTemplates, triggerToast]
  );

  // ROOMS
  const [rooms, setRooms] = useState([]);
  const [allRoomsData, setAllRoomsData] = useState([]);
  const getRooms = useCallback(
    async (id) => {
      try {
        const response = await axios.get(
          `${API_URL}/account/template_response?template_id=${id}&entity_type=rooms_and_areas`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data.data;
        const mappedData = data.map((room) => {
          return {
            object_type: room.object_type,
            display_name: room.display_name,
            room_rank: room.room_rank,
            status: room.metadata.status,
            entity_type: room.entity_type,
            item_type: room.item_type,
          };
        });
        let _rooms = [
          ...mappedData.filter(
            (entity) =>
              entity.item_type === "general_overview" ||
              entity.item_type === "general overview"
          ),
        ];
        console.log(data);
        setRooms(
          _rooms.sort((a, b) => Number(a.room_rank) - Number(b.room_rank))
        );
        setAllRoomsData(data);
      } catch (error) {
        console.log(error);
      }
    },
    [token]
  );

  const updateRoomItem = useCallback(
    async (body, id) => {
      try {
        const response = await axios.put(
          `${API_URL}/account/template_response/${id}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        triggerToast("Item updated successfully!", "success");
        getRooms(body.template_id);
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, triggerToast, getRooms]
  );

  // ADD ROOM ITEM
  const addRoomItem = useCallback(
    async (body, message) => {
      try {
        const response = await axios.post(
          `${API_URL}/account/template_response`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        triggerToast(message, "success");
        getRooms(body.template_id);
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, triggerToast, getRooms]
  );

  // GET FIRE ALARM COMPLIANCE
  const getFireAlarmResponse = useCallback(
    async (id) => {
      try {
        const response = await axios.get(
          `${API_URL}/account/template_response?template_id=${id}&entity_type=h_s_compliance`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        setFireAlarm(data.data);
      } catch (error) {
        console.log(error);
      }
    },
    [token]
  );

  // GET CHECK IN OVERVIEW RESPONSE
  const getCheckInOverviewResponse = useCallback(
    async (id, reportType) => {
      let entity_type = "";
      if (reportType?.toLowerCase().replace(/\s/g, "") === "inspectionreport")
        entity_type = "inspection_overview";
      if (reportType?.toLowerCase().replace(/\s/g, "") === "checkoutreport")
        entity_type = "check_out_overview";
      if (reportType?.toLowerCase().replace(/\s/g, "") === "inventoryreport")
        entity_type = "check_in_overview";
      try {
        const response = await axios.get(
          `${API_URL}/account/template_response?template_id=${id}&entity_type=${entity_type}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.data;
        setCheckInOverview(data.data);
      } catch (error) {
        console.log(error);
      }
    },
    [token]
  );

  // DELETE ITEM
  const deleteItem = useCallback(
    async (id, type, template_id) => {
      try {
        const response = await axios.delete(
          `${API_URL}/account/template_response/${id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (type === "rooms") {
          triggerToast("Item deleted successfully!", "success");
          getRooms(template_id);
        } else if (type === "meters") {
          triggerToast("Meter deleted successfully!", "success");
          getMeters(template_id);
        } else if (type === "utilities") {
          triggerToast("Utility deleted successfully!", "success");
          getUtilities(template_id);
        } else {
          triggerToast("Item deleted successfully!", "success");
        }
      } catch (error) {
        triggerToast(error.response.data.message, "error");
      }
    },
    [token, getRooms, getMeters, getUtilities, triggerToast]
  );

  useEffect(() => {
    if (token !== "") {
      getTemplates();
    }
  }, [getTemplates, token]);

  return (
    <TemplateContext.Provider
      value={{
        isLoading,
        templates,
        allTemplates,
        getTemplates,
        meters,
        getMeters,
        addMeter,
        updateMeter,
        utilities,
        getUtilities,
        addUtility,
        updateUtility,
        getDocLink,
        addReportDocument,
        addRoomItem,
        deleteItem,
        rooms,
        allRoomsData,
        getRooms,
        updateRoomItem,
        setRooms,
        getFireAlarmResponse,
        fireAlarm,
        sign,
        propertyList,
        clerkList,
        reportTypeList,
        status,
        getPropertyList,
        getRoomItemDescription,
        roomItemDescription,
        getCheckInOverviewResponse,
        checkInOverview,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
