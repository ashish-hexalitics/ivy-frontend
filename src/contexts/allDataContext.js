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
import { convertToTitleCase } from "../utils/helper";

const AllDataContext = createContext({
  customers: [],
  properties: [],
  tenancies: [],
  users: [],
  getCustomers: () => { },
  getProperties: () => { },
  getTenancies: () => { },
  getUsers: () => { },
  locationList: [],
  amenityList: [],
});

export const useAllDataState = () => useContext(AllDataContext);

export const AllDataStateProvider = ({ children }) => {
  const { token, getStats } = useAuthState();
  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenancies, setTenancies] = useState([]);
  const [users, setUsers] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [amenityList, setAmenityList] = useState([]);

  const getCustomers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/account/customer`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.data;

      setCustomers(
        data?.data.map((item) => {
          return {
            customerName: item.name,
            email: item.email,
            website: item.website_url,
            telephoneNo: item.contact_number,
            noOfProperties: item.properties_count,
            noOfReports: item?.reports_count,
            address: item?.address,
            postcode: item?.postcode,
            town: item?.town,
            viewCustomer: {
              route: "/customers/edit",
              item: item,
            },
          };
        })
      );
      getStats();
    } catch (error) {
      console.log(error);
    }
  }, [token, getStats]);

  const getProperties = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/account/property`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.data;
      setProperties(
        data?.data.map((item) => {
          return {
            property: item?.photos.length > 0 ? item?.photos[0] : "",
            address: item.address,
            postcode: item.postcode,
            town: item?.town,
            type: item.type,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            customerName: item.customer_user_id?.name || "",
            tenancies: item.tenancies_count,
            reports: item.reports_count,
            viewProperty: {
              route: "/properties/view",
              item: item,
            },
            property_id: item._id
          };
        })
      );
      getStats();
    } catch (error) {
      console.log(error);
    }
  }, [token, getStats]);

  const getTenancies = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/account/tenancy`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.data;
      setTenancies(
        data?.data.map((item) => {
          const tenantNames = item?.tenants.map((tenant, ind) => ({
            name: tenant?.name,
            status: tenant?.status,
          }));
          return {
            refNo: item?.report_id?.ref_number
              ? item?.report_id?.ref_number
              : "-",
            tenancyStartDate: new Date(item?.start_date)
              .toLocaleString("en-GB", { timeZone: "UTC" })
              .split(",")[0],
            property: item?.property_id?.address,
            town: item?.property_id?.town,
            postcode: item?.property_id?.postcode,
            tenancyType: item?.type || "SINGLE",
            tenantNames: tenantNames,
            tenants: item?.tenants.length,
            reports: 1,
            viewTenancy: {
              route: "/tenants/edit",
              item: item,
            },
          };
        })
      );
      getStats();
    } catch (error) {
      console.log(error);
    }
  }, [token, getStats]);

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/account/users`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.data;
      setUsers(
        data?.data.map((item) => {
          return {
            name: item?.name,
            email: item?.email,
            role: convertToTitleCase(item?.type),
            dateAdded: item?.createdAt,
            viewUser: {
              route: "/users/edit",
              item: item,
            },
          };
        })
      );
      getStats();
    } catch (error) {
      console.log(error);
    }
  }, [token, getStats]);

  const getLocationList = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/console/account/settings?entity_type=location`,
        {
          headers: {
            "x-api-key": X_API_KEY,
          },
        }
      );
      const data = await response.data;
      setLocationList(data?.data[0].entity_value);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getAmenityList = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/console/account/settings?entity_type=aminities`,
        {
          headers: {
            "x-api-key": X_API_KEY,
          },
        }
      );
      const data = await response.data;
      setAmenityList(data?.data[0].entity_value);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getCustomers();
      getProperties();
      getTenancies();
      getUsers();
      getLocationList();
      getAmenityList();
    }
  }, [
    token,
    getCustomers,
    getProperties,
    getTenancies,
    getLocationList,
    getAmenityList,
    getUsers,
  ]);

  return (
    <AllDataContext.Provider
      value={{
        customers,
        getCustomers,
        getProperties,
        properties,
        tenancies,
        getTenancies,
        locationList,
        amenityList,
        users,
        getUsers,
      }}
    >
      {children}
    </AllDataContext.Provider>
  );
};
