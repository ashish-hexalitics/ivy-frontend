import {DeleteForeverOutlined, DragIndicator, EditOutlined} from "@mui/icons-material";
import React from "react";

const DraggingQuestions = ({items, dragItem, draggedOverItem, handleQuestionsSort, handleEditDelete, yesStyle, noStyle}) => {

    return <div
        className='flex flex-col gap-3 w-full items-center px-4 md:px-0'>
        {items.map((item, idx) => <>
            <div
                className={`hover:bg-[#EFEAFE] w-full border border-gray-100 flex justify-between items-center px-3 md:px-6 py-3 md:py-4 rounded-md cursor-grabbing`}
                draggable
                onDragStart={(e) => e.dataTransfer.effectAllowed = 'move'}
                onDrag={() => dragItem.current = idx}
                onDragEnter={() => draggedOverItem.current = idx}
                onDragEnd={() => {
                    handleQuestionsSort();
                }}
                onDragOver={(e) => {
                    e.preventDefault()
                }}
            >
                <div className={'flex items-center'}>
                    <div className={'mr-3 hidden md:flex'}>
                        <DragIndicator fontSize={'small'} className={'text-gray-400'}/>
                    </div>
                    <span className={'text-sm font-medium flex-1'}>{item.question}</span>
                </div>
                <div className='flex gap-2 md:gap-2 items-center'>
                                            <span className={'text-xs mx-2 md:mx-20'}
                                                  style={item.answer ? yesStyle : noStyle}>{item.answer ? 'Yes' : 'No'}</span>
                    <button onClick={() => {
                        handleEditDelete(item.id, 'edit')
                    }} className={'cursor-pointer'}>
                        <EditOutlined className={'text-coolBlue'}
                                      fontSize={'small'}/>
                    </button>
                    <button className={'cursor-pointer'} onClick={() => {
                        handleEditDelete(item.id, 'delete')
                    }}>
                        <DeleteForeverOutlined className={'text-coolBlue'}
                                               fontSize={'small'}/>
                    </button>
                </div>
            </div>
        </>)}
    </div>
}

export default DraggingQuestions;