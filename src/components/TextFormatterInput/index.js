import {
    BorderColorRounded, FormatBoldRounded, FormatClearRounded,
    FormatItalicRounded, FormatSizeRounded, FormatUnderlinedRounded
} from '@mui/icons-material'
import React, { useState } from 'react'

const TextFormatterInput = ({ type, name, value, handleChange, disabled }) => {
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderlined, setIsUnderlined] = useState(false)
    const [fontSize, setFontSize] = useState(14)
    const [isHighlighted, setIsHighlighted] = useState(false)

    const clearFormat = () => {
        setIsBold(false)
        setIsItalic(false)
        setIsUnderlined(false)
        setIsHighlighted(false)
        setFontSize(14)
    }

    return (
        <div className='flex flex-col border rounded-lg border-[#dfe6e9] bg-[#FEFEFF]'>
            {!disabled && <div className='flex items-center border-b border-[#dfe6e9] px-4 py-2 gap-0.5'>
                <button onClick={() => setIsBold(!isBold)}>
                    <FormatBoldRounded fontSize='large' className={`p-2 hover:bg-[#b5b5b5] ${isBold ? 'bg-[#cdcbcb]' : ''}`} />
                </button>
                <button onClick={() => setIsItalic(!isItalic)}>
                    <FormatItalicRounded fontSize='large' className={`p-2 hover:bg-[#b5b5b5] ${isItalic ? 'bg-[#cdcbcb]' : ''}`} />
                </button>
                <button onClick={() => setIsUnderlined(!isUnderlined)}>
                    <FormatUnderlinedRounded fontSize='large' className={`p-2 hover:bg-[#b5b5b5] ${isUnderlined ? 'bg-[#cdcbcb]' : ''}`} />
                </button>
                <button onClick={() => setFontSize(fontSize === 18 ? 12 : fontSize + 2)}>
                    <FormatSizeRounded fontSize='large' className={`p-2 hover:bg-[#b5b5b5] ${fontSize !== 14 ? 'bg-[#cdcbcb]' : ''}`} />
                </button>

                <span className='h-3/5 w-[1.5px] mx-2 bg-black'></span>

                <button onClick={() => setIsHighlighted(!isHighlighted)}>
                    <BorderColorRounded color='warning' fontSize='large' className={`p-2 hover:bg-[#b5b5b5] ${isHighlighted ? 'bg-[#cdcbcb]' : ''}`} />
                </button>
                <button onClick={clearFormat}>
                    <FormatClearRounded fontSize='large' className={`p-2 hover:bg-[#b5b5b5]`} />
                </button>
            </div>}

            <textarea type={type} name={name} value={value} onChange={handleChange} disabled={disabled} className='px-4 py-3 focus:outline-none h-[110px]'
                style={{
                    fontSize: `${fontSize}px`,
                    fontWeight: isBold ? 'bolder' : 'normal',
                    textDecoration: isUnderlined ? 'underline' : 'none',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textShadow: isHighlighted ? '1px 1px yellow' : 'none',
                    fontFamily: 'Inter'
                }}
            />
        </div>
    )
}

export default TextFormatterInput