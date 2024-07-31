import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Chip, Divider} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {CreateRounded, DeleteForever, EditRounded} from '@mui/icons-material';
import {COLOR_SCHEMES} from "../../utils/constants";

export default function AccordionTable({data, type}) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    if (type === 'Reports') {
        return (
            <div>
                {data.map((item, idx) => <Accordion key={idx} expanded={expanded === idx} onChange={handleChange(idx)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        sx={{
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 2,
                            marginBottom: 2
                        }}
                    >
                        <span className='font-medium text-sm text-[#2D3436]'>{item.address}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='flex flex-col gap-3'>
                            <div className='flex justify-between'>
                                <span className='font-bold text-sm text-[#2D3436]'>Postcode</span>
                                <span className='text-sm text-[#2D3436]'>{item.postcode}</span>
                            </div>
                            <Divider/>
                            <div className='flex justify-between'>
                                <span className='font-bold text-sm text-[#2D3436]'>Customer Name</span>
                                <span className='text-sm text-[#2D3436]'>{item.customerName}</span>
                            </div>
                            <Divider/>
                            <div className='flex justify-between'>
                                <span className='font-bold text-sm text-[#2D3436]'>Report Type</span>
                                <span className='text-sm text-[#2D3436]'>{item.reportType}</span>
                            </div>
                            <Divider/>
                            <div className='flex justify-between'>
                                <span className='font-bold text-sm text-[#2D3436]'>Date of Report</span>
                                <span
                                    className='text-sm text-[#2D3436]'>{(new Date(item?.dateOfReport)).toLocaleString('en-GB', {timeZone: 'UTC'}).split(',')[0]}</span>
                            </div>
                            <Divider/>
                            <div className='flex justify-between'>
                                <span className='font-bold text-sm text-[#2D3436]'>Status</span>
                                <Chip style={{
                                    background: COLOR_SCHEMES[item.status] && COLOR_SCHEMES[item.status].bg,
                                    padding: "2px",
                                    fontSize: "10px",
                                    textTransform: 'capitalize'
                                }} label={item.status === 'waiting_to_be_signed' ? 'Waiting' : item.status}
                                />
                            </div>
                            <Divider/>
                            <div className='flex justify-between'>
                                <span className='font-bold text-sm text-[#2D3436]'>Completed By</span>
                                <span className='text-sm text-[#2D3436]'>{item.completedBy}</span>
                            </div>
                            <Divider/>
                            <div className='flex justify-center'>
                                <button className='secondary-button w-full'
                                        onClick={() => {
                                            navigate(item.viewReport.route, {state: {item: item.viewReport.item}})
                                        }}
                                >View Report
                                </button>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>)}
            </div>
        );
    } else if (type === 'ViewReports') {
        return (
            <div>
                {data.map((item, idx) => <Accordion key={idx} expanded={expanded === idx} onChange={handleChange(idx)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        sx={{
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 2,
                            marginBottom: 2                        }}
                    >
                        <span className='font-medium text-sm text-[#2D3436]'>{item.refNo}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='flex flex-col gap-3'>
                            <div className='flex justify-between'>
                                <span className='font-bold text-sm text-[#2D3436]'>Date</span>
                                <span className='text-sm text-[#2D3436]'>{item.date}</span>
                            </div>
                            <Divider/>
                            <div className='flex justify-between'>
                                <span className='font-bold text-sm text-[#2D3436]'>Report Type</span>
                                <span className='text-sm text-[#2D3436]'>{item.type}</span>
                            </div>
                            <Divider/>
                            <div className='flex justify-between'>
                                <span className='font-bold text-sm text-[#2D3436]'>Completed By</span>
                                <span className='text-sm text-[#2D3436]'>{item.completedBy}</span>
                            </div>
                            <Divider/>
                            <div className='flex justify-between'>
                                <span className='font-bold text-sm text-[#2D3436]'>Status</span>
                                <Chip style={{
                                    background: COLOR_SCHEMES[item.status] && COLOR_SCHEMES[item.status].bg,
                                    padding: "2px",
                                    fontSize: "10px",
                                    textTransform: 'capitalize'
                                }} label={item.status === 'waiting_to_be_signed' ? 'Waiting' : item.status}
                                />
                            </div>
                            <Divider/>
                            <div className='flex justify-center'>
                                <button className='secondary-button w-full'
                                        onClick={() => {
                                            navigate(item.viewReport.route, {state: {item: item.viewReport.item}})
                                        }}
                                >View Report
                                </button>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>)}
            </div>
        );
    } else if (type === 'Properties') {
        return (
            <div>
                {data.map((item, idx) => <Accordion key={idx} expanded={expanded === idx} onChange={handleChange(idx)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 2,
                            marginBottom: 2                            }}
                        >
                            <span className='font-medium text-sm text-[#2D3436]'>{item.address}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex flex-col gap-3'>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Postcode</span>
                                    <span className='text-sm text-[#2D3436]'>{item.postcode}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Customer Name</span>
                                    <span className='text-sm text-[#2D3436]'>{item.customerName}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Property Type</span>
                                    <span className='text-sm text-[#2D3436]'>{item.type}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Reports</span>
                                    <span className='text-sm text-[#2D3436]'>{item.reports}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Tenancies</span>
                                    <span className='text-sm text-[#2D3436]'>{item.tenancies}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-center'>
                                    <button className='secondary-button w-full'
                                            onClick={() => {
                                                navigate(item.viewProperty.route, {state: {item: item.viewProperty.item}})
                                            }}
                                    >View Property
                                    </button>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>
        )
    } else if (type === 'Customers') {
        return (
            <div>
                {data.map((item, idx) => <Accordion key={idx} expanded={expanded === idx} onChange={handleChange(idx)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 2,
                            marginBottom: 2                            }}
                        >
                            <span className='font-medium text-sm text-[#2D3436]'>{item.customerName}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex flex-col gap-3'>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Postcode</span>
                                    <span className='text-sm text-[#2D3436]'>{item.postcode}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Email</span>
                                    <span className='text-sm text-[#2D3436]'>{item.email}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Contact Number</span>
                                    <span className='text-sm text-[#2D3436]'>{item.telephoneNo}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Website</span>
                                    <span className='text-sm text-[#2D3436]'>{item.website}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>No. of Properties</span>
                                    <span className='text-sm text-[#2D3436]'>{item.noOfProperties}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-center'>
                                    <button className='secondary-button w-full'
                                            onClick={() => {
                                                navigate(item.viewCustomer.route, {state: {item: item.viewCustomer.item}})
                                            }}
                                    >View Customer
                                    </button>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>
        )
    } else if (type === 'Users') {
        return (
            <div>
                {data.map((item, idx) => <Accordion key={idx} expanded={expanded === idx} onChange={handleChange(idx)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 2,
                            marginBottom: 2                            }}
                        >
                            <span className='font-medium text-sm text-[#2D3436]'>{item.name}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex flex-col gap-3'>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Email</span>
                                    <span className='text-sm text-[#2D3436]'>{item.email}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Role</span>
                                    <span className='text-sm text-[#2D3436]'>{item.role}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Date Added</span>
                                    <span className='text-sm text-[#2D3436]'>{item.dateAdded}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-center'>
                                    <button className='secondary-button w-full'
                                            onClick={() => {
                                                navigate(item.viewUser.route, {state: {item: item.viewUser.item}})
                                            }}
                                    >View User
                                    </button>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>
        )
    } else if (type === 'Tenancies') {
        return (
            <div>
                {data.map((item, idx) => <Accordion key={idx} expanded={expanded === idx} onChange={handleChange(idx)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 2,
                            marginBottom: 2                            }}
                        >
                            <span className='font-medium text-sm text-[#2D3436]'>{item.refNo}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex flex-col gap-3'>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Address</span>
                                    <span className='text-sm text-[#2D3436]'>{item.property}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Tenancy Start Date</span>
                                    <span className='text-sm text-[#2D3436]'>{item.tenancyStartDate}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Reports</span>
                                    <span className='text-sm text-[#2D3436]'>{item.reports}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Tenants</span>
                                    <span className='text-sm text-[#2D3436]'>{item.tenants}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-center'>
                                    <button
                                        className='secondary-button w-full'
                                        onClick={() => {
                                            navigate(item.viewTenancy.route, {state: {item: item.viewTenancy.item}})
                                        }}
                                    >View Tenancy
                                    </button>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>
        )
    } else if (type === 'View Notes') {
        return (
            <div>
                {data.map((item, idx) => <Accordion key={idx} expanded={expanded === idx} onChange={handleChange(idx)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 2,
                            marginBottom: 2                            }}
                        >
                            <span className='font-medium text-sm text-[#2D3436]'>{item.date} - {item.time}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex flex-col gap-3'>
                                <span className='font-bold text-sm text-[#2D3436]'>Note</span>
                                <span className='text-sm text-[#2D3436]'>{item.note}</span>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>
        )
    } else if (type === 'Edit Notes') {
        return (
            <div>
                {data.map((item, idx) => <Accordion key={idx} expanded={expanded === idx} onChange={handleChange(idx)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 2,
                            marginBottom: 2                            }}
                        >
                            <span className='font-medium text-sm text-[#2D3436]'>{item.date} - {item.time}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex flex-col gap-3'>
                                <div className='flex flex-col gap-2'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Note</span>
                                    <span className='text-sm text-[#2D3436]'>{item.note}</span>
                                </div>
                                <Divider/>
                                <div className='flex justify-center'>
                                    <button
                                        className='secondary-button w-full'
                                        onClick={() => {
                                            item.editNote.func(item.editNote.item)
                                        }}
                                    ><CreateRounded fontSize='small'/> Edit Note
                                    </button>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>
        )
    } else if (type === 'View Tenancy') {
        return (
            <div>
                {data.map((item, idx) => <Accordion key={idx} expanded={expanded === idx} onChange={handleChange(idx)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 2,
                            marginBottom: 2                            }}
                        >
                            <span className='font-medium text-sm text-[#2D3436]'>{item.name}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex flex-col gap-3'>
                                <div className='flex flex-col gap-2'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Email</span>
                                    <span className='text-sm text-[#2D3436]'>{item.email}</span>
                                </div>
                                <Divider/>
                                <div className='flex flex-col gap-2'>
                                    <span className='font-bold text-sm text-[#2D3436]'>Contact Number</span>
                                    <span className='text-sm text-[#2D3436]'>{item.mobile}</span>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>
        )
    } else if (type === 'Settings') {
        return (
            <div>
                {data.map((item, idx) => <Accordion key={idx} expanded={expanded === idx} onChange={handleChange(idx)}
                                                    className='bg-slate-400 mx-4'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            sx={{
                                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                            }}
                        >
                            <span className='font-medium text-sm text-[#2D3436]'>{item.question}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex flex-col gap-3'>
                                <div className='flex justify-between'>
                                    <span className='font-bold text-sm text-[#2D3436]'>{item.answer}</span>
                                    <div className='flex gap-1'>
                                        <EditRounded color='primary'
                                                     onClick={() => item.action.handleEditDelete(item.action.item, 'edit')}/>
                                        <DeleteForever color='error'
                                                       onClick={() => item.action.handleEditDelete(item.action.item, 'delete')}/>
                                    </div>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>
        )
    }
}