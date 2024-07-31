import React from "react";

const SelectableTag = ({handleChange, itemName, itemForm, item, isDisabled}) => {
    return <button
        key={item}
        disabled={isDisabled}
        className={`hover:bg-[#EFEAFE] hover:text-gray-900 text-sm font-medium px-4 rounded-md py-1 ${itemForm[itemName].includes(item) ? 'bg-coolBlue text-white' : 'bg-gray-100'}`}
        onClick={(e) => handleChange && handleChange(e, item)}>{item}</button>
}

export default SelectableTag