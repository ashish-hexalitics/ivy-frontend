import * as React from 'react';
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

export default function DatePickerComponent({header, name, value, required, onChange, disabled = false}) {
    return (
        <div className='w-full'>
            <div className="header">
                {header} {required ? <span className="text-red-700 text-sm">*</span> :
                <span className="text-red-700 text-sm"></span>}
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    className={'custom-datepicker'}
                    name={name}
                    value={value ? dayjs(value) : null}
                    onChange={onChange}
                    format='DD/MM/YYYY'
                    autoFocus={false}
                    defaultValue={new Date()}
                    disabled={disabled}
                    sx={{
                        width: '100%',
                        height: '49px',
                        borderRadius: '7px',
                        ".css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root": {
                            height: '49px',
                            fontFamily: 'Inter',
                            fontSize: '14px',
                        },
                        "& .Mui-error": {
                            borderColor: '#dfe6e9'
                        },
                        "& .MuiFormHelperText-root": {
                            borderColor: '#dfe6e9'
                        },
                        '& .MuiOutlinedInput-root': {
                            'fieldset': {
                                border: '1px solid rgb(223, 230, 233)',
                                borderRadius: '8px'
                            },
                            '&.Mui-focused fieldset': {
                                border: '1px solid #532FD9', // Change border color on focus
                            },
                            ':hover fieldset': {
                                border: '1px solid rgb(223, 230, 233)', // Change border color on focus
                            },
                        },
                    }}
                />
            </LocalizationProvider>
        </div>
    );
}