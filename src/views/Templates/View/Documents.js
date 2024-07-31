import { ChevronLeftRounded, DeleteForeverRounded } from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {docs, docs_bw, upload_photo} from '../../../assets'
import { useToastState } from '../../../contexts/toastContext'
import { useReportState } from '../../../contexts/reportContext'
import AlertDialog from '../../../components/AlertDialog'
import { useAuthState } from '../../../contexts/authContext'
import axios from 'axios'
import { API_URL } from '../../../utils/constants'
import LoadingAnimation from '../../../components/LoadingAnimation'
import Checkbox from '../../../components/Checkbox/Checkbox'
import UploadPhoto from "../../../components/Upload/UploadPhoto";

const DocumentsView = ({ handleDocumentsClose, report }) => {
    const { triggerToast } = useToastState()
    const { getDocLink, addReportDocument, getReports, isLoading, getCurrentReportStatus } = useReportState()
    const { user, token } = useAuthState()
    const [confirmationCheckbox, setConfirmationCheckbox] = useState(false);

    useEffect(() => {
      setConfirmationCheckbox(report?.document_status === "completed")
    }, [report?.document_status])
    
    const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        accept: {
            'application/pdf': [],
            'image/png': [],
            'image/jpeg': ['.jpeg', '.jpg']
        },
        onDropAccepted: (file) => {
            const formData = new FormData()
            formData.append('document', file[0])
            console.log(file[0])
            let secure_url = getDocLink(formData, 'report')
            secure_url.then((res) => addReportDocument(report._id, res))
        }
    })

    const deleteDocument = useCallback(async (url) => {
        try {
            const response = await axios.delete(`${API_URL}/account/report/${report._id}/delete_document/${url._id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            triggerToast('Document deleted successfully', 'success')
            setConfirmationCheckbox(false)
            getReports()
        } catch (error) {
            triggerToast('Document deletion failed! Please try again!', 'error')
        }

    }, [triggerToast, getReports, token, report])

    const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] = useState(false);
    const handleDeleteDocumentDialogOpen = () => setDeleteDocumentDialogOpen(true)
    const handleDeleteDocumentDialogClose = () => setDeleteDocumentDialogOpen(false)

    const handleCheckboxClick = async () => {
        try {
            const response = await axios.put(`${API_URL}/account/report/${report._id}`, {
                document_status: "completed"
            }, {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            })
            triggerToast("Documents updated successfully!", 'success')                                 
            getReports()
            getCurrentReportStatus(report._id)
            handleDocumentsClose()
        } catch (error) {
            triggerToast(error.message, "error")
        }
    }

    return (
        <div className='flex justify-end mt-24 md:mt-0'>
            <div className='flex flex-col gap-6 w-full md:w-[calc(100%_-_245px)] bg-[#fff] md:px-2 h-screen overflow-y-scroll pt-4 md:pt-10'>                <div className='flex gap-4 items-center mx-4 md:mx-8'>
                    <button onClick={handleDocumentsClose}>
                        <ChevronLeftRounded className='text-coolBlue' fontSize='large' />                    </button>
                    <span className='font-bold text-base md:text-xl text-[#212121]'>Documents</span>
                </div>

                {isLoading ? <LoadingAnimation /> : <div className='flex flex-col gap-8 mx-4 md:mx-5 md:p-4 mb-40 md:mb-0'>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <div className='flex flex-col w-full md:w-fit md:basis-1/2 gap-4'>
                            <span className='font-medium text-sm text-[#282828]'>Upload Documents</span>
                            <div
                                className='w-full h-[200px] border-2 border-dashed bg-white flex flex-col justify-center items-center gap-4 cursor-pointer' {...getRootProps()}>
                                <input {...getInputProps()} />
                                <img src={upload_photo} alt="docs"/>
                                <span className='text-sm text-[#686868] font-medium'>Click or drag a file to this area to upload.</span>
                            </div>
                        </div>

                        <div className='flex flex-col w-full md:w-fit md:basis-1/2 gap-4'>
                            <span className='font-medium text-sm text-[#282828]'>Documents list</span>
                            <div className='flex items-center justify-between md:justify-start gap-4 flex-wrap'>
                            {report?.documents?.length > 0 ? report?.documents?.map(doc => { 
                                    const splitUrlArray = doc.url.split("/");
                                    const documentName = splitUrlArray[splitUrlArray.length - 1];
                                    return (<div className='flex h-[200px] bg-white items-center justify-between'>
                                    <div className='flex flex-col items-end p-1 w-full rounded-lg bg-gray-100 p-5'>
                                        {user?.role !== 'customer' && <button onClick={handleDeleteDocumentDialogOpen} className='flex flex-row-reverse'>
                                            <DeleteForeverRounded className={'text-coolBlue'} />
                                        </button>}
                                        <div className={'flex justify-center'}>
                                            <img src={doc.url.length > 0 ? doc.url.replace('.pdf', '.png') : docs_bw} alt="photo_bw" className='h-[140px] w-[140px] object-cover' />
                                        </div>
                                        <AlertDialog open={deleteDocumentDialogOpen} handleClose={handleDeleteDocumentDialogClose} accept={() => deleteDocument(doc)} content={"Delete this document?"} />
                                        </div>
{/*
                                        <p className='text-center mb-2'>{documentName.length > 24 ? documentName.substring(0, 20) + '....' : documentName}</p>
*/}
                                       </div>
                                )}) :
                                    <div className='p-4 bg-gray-100 w-full rounded-md h-[200px] flex justify-center items-center'>
                                        <span className='text-sm text-gray-500'>No documents uploaded</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>}
                <div className={`${report?.documents?.length > 0 && 'pointer-events-none'} mt-4 md:mt-10 mx-4 md:mx-12 ${report?.documents?.length > 0 ? "text-[#d3d3d3]" : "text-[#282828]"}`} onClick={handleCheckboxClick}>
                            <Checkbox
                                Lstyle={{
                                    fontFamily: "Inter",
                                    fontStyle: "normal",
                                    fontSize: "14px",
                                    lineHeight: "24px",
                                }}
                                label={"Confirm you do not want to upload any documents in this report"}
                                value={report?.documents?.length === 0 && confirmationCheckbox}
                            />
                        </div>
            </div>
        </div>
    )
}

export default DocumentsView