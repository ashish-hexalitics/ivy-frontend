import React from 'react'
import {MenuItem, Select} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const CustomSelect = ({
                          name,
                          value,
                          subheader,
                          handleChange,
                          data,
                          header,
                          placeholder,
                          type,
                          required = false,
                          disabled = false,
                          DataType = "1"
                      }) => {

    if (type === '2') {
        return (
            <div className="flex flex-col gap-2 w-full custom-select">
                <span className="text-sm font-medium font-[Inter] leading-4">
                    {header} {required && <span className="text-red-700 text-sm">*</span>}
                </span>
                {subheader && <span className="text-xs leading-2">{subheader}</span>}
                <Select
                    IconComponent={KeyboardArrowDownIcon}
                    name={name}
                    value={value}
                    displayEmpty
                    required={required}
                    disabled={disabled}
                    renderValue={value !== "" ? undefined : () =>
                        <span style={{
                            color: '#BDBDBD',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: '12px',
                            lineHeight: '15px',
                        }}>
                            {placeholder}
                        </span>
                    }
                    onChange={(e) => handleChange(name, e.target.value)}
                    sx={{
                        width: '100%',
                        height: '51px',
                        borderRadius: '7px',
                        background: '#f9f9f9',
                        color: "black",
                        fontSize: '14px',
                        cursor: disabled ? 'not-allowed' : 'auto',
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#dfe6e9',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#dfe6e9',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#dfe6e9',
                        },
                        '.MuiSvgIcon-root ': {
                            color: "#dfe6e9 !important",
                        }
                    }}
                >
                    {data && data.length > 0 && data.map(item =>
                        <MenuItem style={{
                            background: '#f9f9f9',
                            fontSize: '12px',
                            borderRadius: '7px',
                        }} value={item}>
                            {item}
                        </MenuItem>)}
                </Select>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col gap-2 w-full custom-select">
                <span className="text-sm font-medium font-[Inter] leading-4">
                    {header} {required && <span className="text-red-700 text-sm">*</span>}
                </span>
                <Select
                    name={name}
                    IconComponent={KeyboardArrowDownIcon}
                    value={value}
                    displayEmpty
                    renderValue={value !== "" ? undefined : () =>
                        <span style={{
                            color: '#BDBDBD',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: '12px',
                            lineHeight: '15px',
                        }}>
                            {placeholder}
                        </span>}
                    onChange={handleChange}
                    required={required}
                    disabled={disabled}
                    sx={{
                        width: '100%',
                        height: '51px',
                        borderRadius: '8px',
                        background: '#fff',
                        fontSize: '14px',
                        cursor: disabled ? 'not-allowed' : 'auto',
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#dfe6e9',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#dfe6e9',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#dfe6e9',
                        },
                        '.MuiSvgIcon-root ': {
                            color: "#dfe6e9 !important",
                        },

                    }}
                    MenuProps={{    sx: {
                            "&& .Mui-selected": {
                                backgroundColor: "#EFEAFE"
                            }
                        }}}
                >

                    {data.map(item => {
                        if (DataType === '2') {
                            return <MenuItem style={{
                                fontSize: '12px',
                                borderRadius: '8px',
                            }} value={item?.value}>
                                {item?.label}
                            </MenuItem>
                        }
                        return <MenuItem style={{
                            fontSize: '12px',
                            borderRadius: '8px',
                            margin: 8,
                        }} value={item}>
                            {item}
                        </MenuItem>
                    })}
                </Select>
            </div>
        )
    }
}

export default CustomSelect