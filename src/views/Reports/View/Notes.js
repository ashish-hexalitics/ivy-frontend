import { ChevronLeftRounded } from '@mui/icons-material'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { API_URL } from '../../../utils/constants'
import { useAuthState } from '../../../contexts/authContext'
import { useReportState } from '../../../contexts/reportContext'
import { useToastState } from '../../../contexts/toastContext'
import Tbl from '../../../components/Table/Tbl'
import { NotesColumns } from '../constants'
import AccordionTable from '../../../components/Accordion'

const NotesView = ({ handleReportNotesClose }) => {
    const { state: { item } } = useLocation()
    const { token } = useAuthState()
    const { notes, getNotes, getCurrentReportStatus } = useReportState()
    const { triggerToast } = useToastState()

    const [note, setNote] = useState({
        date: '', time: '', note: ''
    })

    const [id, setId] = useState('')

    const addNote = (value) => {
        setNote({
            date: (new Date()).toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[0],
            time: (new Date()).toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[1],
            note: value
        })
    }

    const clearNote = () => {
        setNote({
            date: '', time: '', note: ''
        })
        setId('')
    }

    const submitNote = useCallback(async () => {
        try {
            const response = await axios.post(`${API_URL}/account/report_response`, {
                report_id: item._id,
                entity_type: "notes",
                metadata: note
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            const data = await response.data
            triggerToast('Note added successfully!', 'success')
            getNotes(item._id)
            getCurrentReportStatus(item._id)
            clearNote()
        } catch (error) {
            triggerToast(error.response.data.message, 'error')
        }
    }, [item, note, token, triggerToast, getNotes, getCurrentReportStatus])

    const updateNote = useCallback(async (body) => {
        try {
            const response = await axios.put(`${API_URL}/account/report_response/${id}`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            const data = await response.data
            getNotes(item._id)
            triggerToast('Note updated successfully!', 'success')
            clearNote()
        } catch (error) {
            triggerToast(error.response.data.message, 'error')
        }
    }, [token, triggerToast, id, getNotes, item])

    const _updateNote = () => {
        updateNote({
            report_id: item._id,
            entity_type: "notes",
            metadata: note
        })
        clearNote()
    }

    const editNote = (_item) => {
        setNote({
            date: (new Date(_item?.metadata?.date)).toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[0],
            time: (new Date(_item?.metadata?.date)).toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[1],
            note: _item?.metadata?.note
        })
        setId(_item?._id)
    }

    return (
        <div className='flex justify-end mt-24 md:mt-0'>
            <div className='flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] bg-[#fff] md:px-4 h-screen overflow-y-scroll pt-4 md:pt-10'>
                <div className='flex gap-4 items-center mx-4 md:mx-5'>
                    <button onClick={handleReportNotesClose}>
                        <ChevronLeftRounded className='text-coolBlue' fontSize='large' />                    </button>
                    <span className='font-bold text-base md:text-xl text-[#212121]'>Main Overview</span>
                </div>

                <div className='flex flex-col gap-4 mx-4 md:mx-8 p-4'>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm text-[#282828] font-semibold'>Notes</span>
                        <button className='w-fit px-4 md:w-[200px] h-[30px] md:h-[40px] border border-coolBlue text-coolBlue rounded-lg shadow-lg text-sm' onClick={clearNote}>Clear</button>
                    </div>
                    <textarea name="note" value={note.note} onChange={(e) => addNote(e.target.value)} placeholder='Enter notes'
                        className='bg-[#FEFEFF] border border-[#DFE6E9] rounded-md shadow-md p-4 h-[110px]'
                    />
                    <div className='w-full flex justify-center'>
                        {id === '' ?
                            <button className='bg-coolBlue w-full text-sm md:w-[269px] h-[40px] text-white rounded-lg shadow-md' onClick={submitNote}>Save</button>
                            :
                            <button className='bg-coolBlue w-full text-sm md:w-[269px] h-[40px] text-white rounded-lg shadow-md' onClick={_updateNote}>Save</button>
                        }
                    </div>
                    {notes && notes.length > 0 &&
                        <>
                            <div className='hidden md:block w-full bg-white rounded-md shadow-md p-4 h-[400px]'>
                                <Tbl data={notes.map(item => {
                                    return {
                                        date: item?.metadata?.date,
                                        time: item?.metadata?.time,
                                        note: item.metadata?.note,
                                        editNote: {
                                            func: editNote,
                                            item: item
                                        },
                                    }
                                })} columns={NotesColumns} type="Report Notes" />
                            </div>
                            <div className='block md:hidden my-4'>
                                <AccordionTable data={notes.map(item => {
                                    return {
                                        date: item?.metadata?.date,
                                        time: item?.metadata?.time,
                                        note: item.metadata?.note,
                                        editNote: {
                                            func: editNote,
                                            item: item
                                        },
                                    }
                                })} type={"Edit Notes"} />
                            </div>
                        </>
                    }
                </div>

            </div>
        </div>
    )
}

export default NotesView