import React, { useEffect, useState } from "react";
import { key, eye, sms } from "../../assets";
import "./Input.css";

const Input = ({ header, type, placeholder, subHeader, name, value, onChange, required = false, disabled = false, bg = "#ffffff", taHeight = '220px' }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [passwordType, setPasswordType] = useState('password')

    useEffect(() => {
        if (isPasswordVisible) {
            setPasswordType('text')
        } else {
            setPasswordType('password')
        }
    }, [isPasswordVisible])

    return (
        <div className="containerI">
            <div className="header">
                {header} {required ? <span className="text-red-700 text-sm">*</span> : <span className="text-red-700 text-sm"></span>}
            </div>
            {subHeader ? <div className="subHeader">{subHeader}</div> : null}
            <div className="input">
                {type === "password" ? (
                    <div>
                        <i className="input-icon-right cursor-pointer" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <img src={eye} alt="eye" />
                        </i>
                        <i className="input-icon-left">
                            <img src={key} alt="key" />
                        </i>
                    </div>
                ) : type === "email" ? (
                    <div>
                        <i className="input-icon-left">
                            <img src={sms} alt="sms" />
                        </i>
                    </div>
                ) : null}
                {type === 'textarea' ?
                    <textarea type={type}
                        placeholder={placeholder}
                        className="styledInput"
                        name={name}
                        value={value}
                        disabled={disabled}
                        onChange={onChange}
                        required={required}
                        style={{
                            padding: '0.8rem 1rem',
                            width: '100%',
                            height: taHeight,
                            color: disabled ? '#717173' : '#282828',
                            fontSize: '14px',
                            cursor: disabled ? 'not-allowed' : 'auto',
                            backgroundColor: bg
                        }} />
                    :
                    <input
                        type={type === 'password' ? passwordType : type}
                        placeholder={placeholder}
                        className="styledInput"
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        style={{
                            padding: type === 'password' || type === 'email' ? '24px 36px' : '24px 12px',
                            width: '100%',
                            color: disabled ? '#717173' : '#282828',
                            fontSize: '14px',
                            cursor: disabled ? 'not-allowed' : 'auto',
                            backgroundColor: bg
                        }}
                    />
                }
            </div>
        </div>
    );
};

export default Input;
