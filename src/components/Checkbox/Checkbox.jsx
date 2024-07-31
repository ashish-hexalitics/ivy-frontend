import React from "react";
import "./Checkbox.css";

const Checkbox = ({ style, Lstyle, label, name, value, handleChange }) => {
  return (
    <div style={style}>
      <label
        className="container flex flex-nowrap gap-0.5 md:gap-2 items-center h-fit"
        style={Lstyle}
      >
        <input
          type="checkbox"
          name={name}
          checked={value}
          onChange={handleChange}
        />
        <span className="checkmark"></span>
        {label && (
          <span className="label-text h-[24px] flex items-center w-fit">
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

export default Checkbox;
