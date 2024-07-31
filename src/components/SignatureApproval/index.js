import { Modal } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import ReactSignatureCanvas from 'react-signature-canvas';
import { logo } from '../../assets';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useToastState } from '../../contexts/toastContext';
import { useReportState } from '../../contexts/reportContext';
import { API_URL } from '../../utils/constants';

const SignatureApproval = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reportId, setReportId] = useState(id)
  const [searchParams, setSearchParams] = useSearchParams()
  const sigCanvas = useRef({});
  const [signature, setSignature] = useState()
  const [statusResponse, setStatusResponse] = useState({ status: 'pending' });
  const { triggerToast } = useToastState()
  const { getDocLink } = useReportState()
  const handleSignChange = (url) => {
    const file = new File([url], `signature${Math.floor((Math.random() * 10000) + 1)}`);
    setSignature(file)
  }
  const formatIntoPng = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      return dataURL;
    }
  };
  const clearSignPad = () => {
    setSignature('')
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  }

  const getSignatureStatus = async () => {
    try {
      const config = {
        method: 'get',
        url: `${API_URL}/console/account/report/${reportId}/tenant/${searchParams.get('id')}`
      }
      const res = await axios.request(config);
      setStatusResponse({ status: res.data.status })
    }
    catch (error) {
      triggerToast(error?.response?.data?.message, 'error')
    }
  }

  useEffect(() => {
    getSignatureStatus()
  }, [])

  const handleSignatureSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append('photo', signature)
      let secure_url = await getDocLink(formData, 'photo')
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_URL}/console/account/report_response`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "report_id": reportId,
          "entity_type": "tenant_signature",
          "metadata": {
            "url": secure_url,
            "id": searchParams.get('id')
          }
        })
      }

      const res = await axios.request(config);
      triggerToast("Signature submitted successfully", "success")
      navigate(`/show-report-pdf/${id}/?id=${searchParams.get('id')}`)
    }
    catch (error) {
      triggerToast(error?.response?.data?.message, 'error')
    }
  }

  const handleViewPdf = () => {
    navigate(`/show-report-pdf/${id}/?id=${searchParams.get('id')}`)
  }
  return (
    statusResponse.status !== 'signed' ? (<div className='w-screen h-fit bg-[#f6f6f6]'>
      <Modal
        open={true}
        hideBackdrop={true}
        className="flex justify-center items-center overflow-y-auto"
      >
        <div className="flex flex-col w-screen h-full md:h-fit md:w-fit gap-6">
          <div className='w-full justify-center hidden md:flex'><img src={logo} alt="logo" className='w-[300px]' /></div>
          <div className='w-screen flex justify-between items-center px-6 py-4 md:hidden bg-white'>
            <img src={logo} className='w-[123px]' alt="" />
          </div>
          <div className='flex flex-col items-start md:bg-white bg-[#F3F3F3] md:w-[767px] md:h-fit p-8 pt-6 gap-8 md:rounded-md shadow-lg shadow-gray-400 overflow-auto'>
            <div className="flex w-full">
              <span className="flex-1 text-[#010101 md:text-[22px] text-[15px] font-semibold">I can confirm safe receipt of the Inventory report email sent to me on {(new Date(Date.now())).toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[0]} : </span>
            </div>
            <span className="font-medium md:text-lg text-sm text-[#3F3F3F]">Please sign below:</span>
            <div className="flex flex-col md:gap-2 gap-6 justify-center w-full md:w-fit">
              <div className="w-full flex justify-end"><button className='w-full md:w-[200px] tex-sm h-[30px] md:h-[40px] border border-coolBlue text-coolBlue rounded-lg shadow-lg text-sm' onClick={clearSignPad}>Clear Sign Pad</button></div>
              {window.screen.width > 768 ? <ReactSignatureCanvas
                onEnd={() => handleSignChange(formatIntoPng())}
                ref={sigCanvas}
                penColor='black' canvasProps={{ width: 675, height: 282, className: 'sigCanvas border-[1px] border-[#DFE6E9] rounded-md', }}
              /> :
                <ReactSignatureCanvas
                  onEnd={() => handleSignChange(formatIntoPng())}
                  ref={sigCanvas}
                  penColor='black' canvasProps={{ width: 342, height: 457, className: 'sigCanvas border-[1px] border-[#DFE6E9] rounded-lg bg-white', }}
                />}
            </div>
            <div className="w-full flex justify-center">
              <button className='text-sm font-medium border bg-coolBlue text-white px-4 rounded-lg shadow-md md:w-[190px] w-full md:py-4 py-3' onClick={handleSignatureSubmit}>I confirm</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
    ) : (<div className='w-screen h-fit bg-[#f6f6f6]'>
      <Modal
        open={true}
        hideBackdrop={true}
        className="flex justify-center items-center overflow-y-auto"
      >
        <div className="flex flex-col w-screen h-full md:h-fit md:w-fit gap-6">
          <div className='w-full justify-center hidden md:flex'><img src={logo} alt="logo" className='w-[300px]' /></div>
          <div className='w-screen flex justify-between items-center px-6 py-4 md:hidden bg-white'>
            <img src={logo} className='w-[123px]' alt="" />
          </div>
          <div className='flex flex-col items-start md:bg-white bg-[#F3F3F3] md:w-[767px] md:h-fit p-8 pt-6 gap-8 md:rounded-md shadow-lg shadow-gray-400 overflow-auto'>

            <div className='flex flex-col gap-2 justify-center items-center w-full'>
              <span className='text-base font-medium'>This report is already signed!</span>
              <span className='text-base text-slate-500 font-medium'>Click below to view the signed report.</span>
            </div>
            <div className="w-full flex justify-center">
              <button className='text-sm font-medium border bg-coolBlue text-white px-4 rounded-lg shadow-md md:w-[190px] w-full md:py-4 py-3' onClick={handleViewPdf}>View Signed Report</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>))
}

export default SignatureApproval