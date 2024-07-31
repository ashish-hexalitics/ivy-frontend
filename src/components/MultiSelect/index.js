import React from 'react';
import {Autocomplete, Chip, CircularProgress, createFilterOptions, TextField} from '@mui/material';
import {CloseOutlined} from "@mui/icons-material";

export default function MultiSelectComponent(props) {
    const {
        options,
        noOptionsText,
        onInputChange,
        MSCdisabled = false,
        errorText,
        disabled,
        InputProps,
        ...restProps
    } = props;
    const filter = createFilterOptions()
    return (
        <Autocomplete
            options={options}
            multiple={true}
            noOptionsText={noOptionsText}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        key={option}
                        label={option}
                        size='large'
                        deleteIcon={<CloseOutlined />}
                        sx={{
                            fontSize: '12px',
                            borderRadius: 1,
                            fontFamily: 'Inter',
                            color: '#502FD8',
                            backgroundColor: '#EFEAFE',
                            '& .MuiChip-deleteIcon': {
                                color: '#502FD8',
                                fontSize: '16px'
                            },
                        }}
                        onDelete={() => console.log("test")}
                        {...getTagProps({index})}
                    />
                ))
            }
            style={{
                background: 'white',
                borderRadius: 1.4
            }}
            disabled={MSCdisabled}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: 1.4,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid rgb(223 230 233)"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #eee"
                    }
                },
            }}
            renderInput={params => {
                return (
                    <TextField
                        className={'multiselect-custom'}
                        {...params}
                        label={props.label}
                        disabled={disabled}
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {props.loading ? (
                                        <CircularProgress color="primary" size={20}/>
                                    ) : null}
                                    {disabled ? '' : params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                            ...InputProps
                        }}
                    />
                );
            }}
            disableCloseOnSelect
            onInputChange={onInputChange}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const {inputValue} = params;
                const isExisting = options.some((option) => inputValue === option.title);
                if (inputValue !== '' && !isExisting) {
                    filtered.push(inputValue);
                }

                return filtered;
            }}
            {...restProps}
            freeSolo
        />
    );
}
