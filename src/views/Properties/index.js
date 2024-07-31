import React, { useEffect, useState } from "react";
import Tbl from "../../components/Table/Tbl";
import { FilterAltOutlined } from "@mui/icons-material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useAllDataState } from "../../contexts/allDataContext";
import { columns } from "./constants";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import AccordionTable from "../../components/Accordion";
import { useAuthState } from "../../contexts/authContext";
import TitleButtons from "../../components/MainLayout/TitleButtons";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  useRadioGroup,
} from "@mui/material";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import axios from "axios";
import { API_URL } from "../../utils/constants";

const PropertiesView = () => {
  const navigate = useNavigate();

  const { user, token } = useAuthState();
  const { properties, getProperties } = useAllDataState();
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("");
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);

  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    if (propertyTypeFilter) {
      setFilteredProperties(
        properties.filter((p) => p.type === propertyTypeFilter)
      );
    } else setFilteredProperties(properties);
  }, [propertyTypeFilter, properties]);

  const StyledFormControlLabel = styled((props) => (
    <FormControlLabel {...props} />
  ))(({ theme, checked }) => ({
    ".MuiFormControlLabel-label": checked && {
      color: "#5131D7",
      fontWeight: "bold",
    },
    marginTop: "-10px",
  }));

  function CustomFormControlLabel(props) {
    // MUI UseRadio Group
    const radioGroup = useRadioGroup();

    let checked = false;

    if (radioGroup) {
      checked = radioGroup.value === props.value;
    }

    return <StyledFormControlLabel checked={checked} {...props} />;
  }

  useEffect(() => {
    (async () => {
      try {
        getProperties();
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

  const clearFilters = () => {
    setPropertyTypeFilter("");
  };

  return (
    <div className="pb-1">
      <TitleButtons
        data={properties}
        title={"properties"}
        addButton={"Property"}
        userRole={user.role}
      />

      <div className="w-full flex justify-end my-4 gap-3">
        {propertyTypeFilter && (
          <button
            className="text-coolBlue text-sm font-medium mr-2"
            onClick={clearFilters}
          >
            <CloseOutlinedIcon fontSize={"small"} /> Clear filters
          </button>
        )}
        <Popover placement="bottom-start">
          <PopoverHandler>
            <div className="cursor-pointer secondary-button flex items-center justify-center">
              <FilterAltOutlined
                fontSize={"small"}
                className={"text-coolBlue"}
              />
              <span className="text-sm font-semibold">Property Type</span>
            </div>
          </PopoverHandler>
          <PopoverContent>
            <div className="flex flex-col gap-4 w-fit pl-3">
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="reportTypeFilter"
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                >
                  {propertyTypeOptions.length > 0 &&
                    propertyTypeOptions.map((item) => (
                      <CustomFormControlLabel
                        className={"font-bold"}
                        key={item}
                        value={item}
                        control={
                          <Radio
                            className={"m-2"}
                            sx={{
                              marginY: 1,
                              "&.Mui-checked": {
                                color: "#532FD9",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: 20,
                              },
                            }}
                          />
                        }
                        label={
                          <span className="label-text hover:font-bold text-sm hover:text-coolBlue">
                            {item}
                          </span>
                        }
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="hidden md:block border border-[#eeeeee] rounded-lg shadow-md mb-20">
        <Tbl data={filteredProperties} columns={columns} type={"Properties"} />
      </div>

      <div className="block md:hidden mt-4 mb-20">
        <AccordionTable data={filteredProperties} type={"Properties"} />
      </div>
    </div>
  );
};

export default PropertiesView;
