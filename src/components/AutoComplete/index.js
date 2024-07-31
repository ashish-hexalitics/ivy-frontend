import React, { useState } from "react";

import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AutoComplete = ({
  name,
  value,
  handleChange,
  data,
  onClose,
  onInputChange = () => {},
  header,
  placeholder,
  required = false,
  disabled = false,
  freeSolo = false,
  background = "transparent",
}) => {
  const [input, setInput] = useState("");
  const filter = createFilterOptions();

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm font-medium font-[Inter] leading-4">
        {header} {required && <span className="text-red-700 text-sm">*</span>}
      </span>
      <Autocomplete
        popupIcon={<KeyboardArrowDownIcon />}
        freeSolo={freeSolo}
        onClose={onClose}
        name={name}
        value={value}
        onChange={handleChange}
        inputValue={input}
        onInputChange={(event, newInputValue) => {
          setInput(newInputValue);
          onInputChange(event, newInputValue);
        }}
        options={data}
        displayEmpty
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          const isExisting = options.some(
            (option) => inputValue === option.title
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push(inputValue);
          }

          return filtered;
        }}
        onBlur={(e) => handleChange(e, input)}
        sx={{
          ".MuiOutlinedInput-notchedOutline": {
            padding: 0,
            borderColor: "#dfe6e9",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#dfe6e9",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#dfe6e9",
          },
          ".MuiSvgIcon-root ": {
            color: "#dfe6e9 !important",
          },
          ".MuiAutocomplete-inputRoot": {
            padding: "0 9px",
            height: "51px",
            borderRadius: "7px",
            color: "black",
            fontSize: "14px",
            background: background,
            cursor: disabled ? "not-allowed" : "pointer",
          },
        }}
        required={required}
        disabled={disabled}
        defaultValue={placeholder}
        renderInput={(params) => (
          <TextField {...params} sx={{ height: "51px" }} />
        )}
      />
    </div>
  );
};

export default AutoComplete;
