import React, { useEffect, useState } from 'react'
import { useAuthState } from '../../contexts/authContext'
import { customers, properties, reports as reports_icon, tenants } from '../../assets'
import { AddCircleOutlineOutlined, CalendarMonthOutlined, CloseRounded, FilterAltOutlined, FilterAlt } from '@mui/icons-material'
import Tbl from '../../components/Table/Tbl'
import { REPORT_STATUS, columns } from '../Reports/constants'
import { useReportState } from '../../contexts/reportContext'
import { useNavigate } from 'react-router-dom'
import { Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react'
import {
    Divider,
    FormControl,
    FormControlLabel,
    Modal,
    Radio,
    RadioGroup,
    styled,
    useMediaQuery, useRadioGroup,
    useTheme
} from '@mui/material'
import { DateRange } from 'react-date-range'
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { filterData } from '../../utils/helper'
import AccordionTable from '../../components/Accordion'
import CalendarView from '../../components/Calendar'
import DashboardCard from "../../components/Card/DashboardCard";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import NightShelterOutlinedIcon from "@mui/icons-material/NightShelterOutlined";

const HomeView = () => {
    const { reports, reportTypeList, clerkList } = useReportState()
    const navigate = useNavigate()

    const [filteredReports, setFilteredReports] = useState([])
    const [reportTypeFilter, setReportTypeFilter] = useState('')
    const [reportStatusFilter, setReportStatusFilter] = useState('')
    const [clerkAgentFilter, setClerkAgentFilter] = useState('')
    const [filterMinDate, setFilterMinDate] = useState('')
    const [filterMaxDate, setFilterMaxDate] = useState('')

    const clearFilters = () => {
        setReportTypeFilter('')
        setReportStatusFilter('')
        setClerkAgentFilter('')
        setFilterMinDate('')
        setFilterMaxDate('')
    }

    const { stats, user } = useAuthState()
    const [view, setView] = useState('reports')

    const [state, setState] = useState([{
        startDate: new Date(), endDate: new Date(), key: "selection",
    },]);

    const StyledFormControlLabel = styled((props) => (
        <FormControlLabel {...props} />
    ))(({ theme, checked }) => ({
        ".MuiFormControlLabel-label": checked && {
            color: "#5131D7",
            fontWeight: "bold"
        },
        marginTop: '-10px'
    }));

    function CustomFormControlLabel(props) {
        // MUI UseRadio Group
        const radioGroup = useRadioGroup();

        let checked = false;

        if (radioGroup) {
            checked = radioGroup.value === props.value;
        }

        return <StyledFormControlLabel checked={checked} {...props} />;
    }

    useEffect(() => {
        if (reports.length > 0) {
            setFilteredReports(filterData(reports, reportTypeFilter, reportStatusFilter, clerkAgentFilter, filterMinDate, filterMaxDate))
        }
    }, [reports, reportTypeFilter, reportStatusFilter, clerkAgentFilter, filterMinDate, filterMaxDate])

    const theme = useTheme();
    const lessThanSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const [calendarModalOpen, setCalendarModalOpen] = useState(false);
    const handleOpenCalendarModal = () => setCalendarModalOpen(true)
    const handleCloseCalendarModal = () => setCalendarModalOpen(false)

    const toTitleCase = (str) => {
        if (str === 'waiting_to_be_signed') {
            return 'Waiting'
        }
        return str
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    };

    const Tabs = ["reports", "calendar"];

    return (<div className={'pb-1'}>
        <div>
            <span className={'flex text-xl md:text-2xl  font-bold mt-6'}>Dashboard</span>
        </div>
        {user?.role !== 'customer' &&
            <div className='flex flex-col md:flex-row justify-between gap-4 md:items-center mt-6'>

                <DashboardCard url={'/customers'} title={'Customers'} stat={stats?.customer} icon={<AssignmentIndOutlinedIcon className={'text-coolBlue'} />} />
                <DashboardCard url={'/properties'} title={'Properties'} stat={stats?.property} icon={<HolidayVillageOutlinedIcon className={'text-coolBlue'} />} />
                <DashboardCard url={'/reports'} title={'Reports'} stat={stats?.report} icon={<AssignmentOutlinedIcon className={'text-coolBlue'} />} />
                <DashboardCard url={'/tenants'} title={'Tenancies'} stat={stats?.tenancies} icon={<NightShelterOutlinedIcon className={'text-coolBlue'} />} />

            </div>}

        <div className={'flex flex-col md:flex-row md:items-center justify-between mt-16'}>
            <div className='flex justify-between'>
                <div className='hidden md:flex gap-8'>
                    {Tabs.map(tab =>
                        <span onClick={() => setView(tab)} className={`text-sm md:text-md pb-2 capitalize
                 ${view === tab ? 'text-[#502FD8] border-[#502FD8] border-b-2 font-bold' : 'hover:text-coolBlue font-bold'} 
                 cursor-pointer`}>{tab}</span>)}
                </div>
            </div>
            <span className={'md:hidden flex text-sm mb-4 font-bold'}>Reports Filters</span>
            {view === 'reports' && <div className='flex flex-col md:flex-row md:mt-0 md:justify-end gap-4'>
                {(reportTypeFilter !== '' || reportStatusFilter !== '' || clerkAgentFilter !== '' || filterMinDate !== '' || filterMaxDate !== '') &&
                    <button className='text-coolBlue text-sm font-medium mr-2'
                        onClick={clearFilters}><CloseOutlinedIcon fontSize={'small'} /> Clear filters</button>}
                <Popover placement="bottom-start">
                    <PopoverHandler>
                        <div
                            className='cursor-pointer secondary-button flex items-center justify-center'>
                            <FilterAltOutlined fontSize={'small'} className={'text-coolBlue'} />
                            <span className='text-sm font-semibold'>Type</span>
                        </div>
                    </PopoverHandler>
                    <PopoverContent>
                        <div className="flex flex-col gap-4 w-fit pl-3">
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="reportTypeFilter"
                                    value={reportTypeFilter}
                                    onChange={(e) => setReportTypeFilter(e.target.value)}
                                >
                                    {reportTypeList.length > 0 && reportTypeList.map(item => <CustomFormControlLabel
                                        className={'font-bold'}
                                        key={item}
                                        value={item}
                                        control={<Radio
                                            className={'m-2'}
                                            sx={{
                                                marginY: 1, '&.Mui-checked': {
                                                    color: '#532FD9',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 20,
                                                }
                                            }}
                                        />}
                                        label={<span
                                            className="label-text hover:font-bold text-sm hover:text-coolBlue"
                                        >{item}</span>}
                                    />)}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover placement="bottom-start">
                    <PopoverHandler>
                        <div
                            className='cursor-pointer secondary-button flex items-center justify-center'>
                            <FilterAltOutlined fontSize={'small'} className={'text-coolBlue'} />
                            <span className='text-sm font-semibold'>Status</span>
                        </div>
                    </PopoverHandler>
                    <PopoverContent>
                        <div className="flex flex-col gap-4 w-fit pl-3">
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="reportStatusFilter"
                                    value={reportStatusFilter}
                                    onChange={(e) => setReportStatusFilter(e.target.value)}
                                >
                                    {REPORT_STATUS.map(item => <CustomFormControlLabel value={item} control={<Radio sx={{
                                        marginY: 1, '&.Mui-checked': {
                                            color: '#532FD9'
                                        },
                                        '& .MuiSvgIcon-root': {
                                            fontSize: 20,
                                        }
                                    }} />} autoFocus={false} label={<span
                                        className="label-text hover:font-bold text-sm hover:text-coolBlue"
                                    >{toTitleCase(item)}</span>} />)}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover placement="bottom-start">
                    <PopoverHandler>
                        <div
                            className='cursor-pointer secondary-button flex items-center justify-center'>
                            <FilterAltOutlined fontSize={'small'} className={'text-coolBlue'} />
                            <span className='text-sm font-semibold'>Clerk/Agent</span>
                        </div>
                    </PopoverHandler>
                    <PopoverContent>
                        <div className="flex flex-col gap-4 w-fit pl-3">
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="clerkAgentFilter"
                                    value={clerkAgentFilter}
                                    onChange={(e) => setClerkAgentFilter(e.target.value)}
                                >
                                    {clerkList.length > 0 && clerkList.map(item => <CustomFormControlLabel
                                        value={item.name} control={<Radio sx={{
                                            marginY: 1, '&.Mui-checked': {
                                                color: '#532FD9',
                                            },
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 20,
                                            }
                                        }} />} autoFocus={false} label={<span
                                            className="label-text hover:font-bold text-sm hover:text-coolBlue"
                                        >{item.name}</span>} />)}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </PopoverContent>
                </Popover>
                <Popover placement="bottom-start">
                    <PopoverHandler>
                        <div
                            className='cursor-pointer secondary-button flex items-center justify-center'>
                            <CalendarMonthOutlined fontSize={'small'} className={'text-coolBlue'} />
                            <span className='text-sm font-semibold'>Date Range</span>
                        </div>
                    </PopoverHandler>
                    <PopoverContent className="shadow-md">
                        <DateRange
                            onChange={(item) => {
                                setFilterMinDate(item.selection.startDate)
                                setFilterMaxDate(item.selection.endDate)
                                setState([item.selection])
                            }}
                            editableDateInputs={true}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={true}
                            months={2}
                            ranges={state}
                            rangeColors={["#532FD9", "#FFF4F3"]}
                            direction={lessThanSmall ? 'vertical' : "horizontal"}
                        />
                    </PopoverContent>
                </Popover>
            </div>}
        </div>

        {view === 'reports' && <>
            <div
                className='hidden md:block border border-[#eeeeee] rounded-lg shadow-md mb-20 mt-10 dashboard-table'>
                <Tbl
                    data={filteredReports.map(report => ({ ...report, reportType: report.reportType.split(" ")[0] }))}
                    columns={columns} type={"Reports"} />
            </div>

            <div className='block md:hidden mt-8 mb-20'>
                <AccordionTable data={filteredReports} type={"Reports"} />
            </div>
        </>}

        {view === 'calendar' && <div className='rounded-lg my-10 custom-calendar'>
            <CalendarView reports={reports}
                onClickHandler={handleOpenCalendarModal}
                setFilterMaxDate={setFilterMaxDate}
                setFilterMinDate={setFilterMinDate} />
        </div>}

        <Modal open={calendarModalOpen} onClose={handleCloseCalendarModal}>
            <div className='flex justify-end h-screen w-full'>
                <div className='flex justify-center items-center w-full md:w-[calc(100%_-_245px)] h-screen'>
                    <div className='bg-white w-[98%] flex flex-col gap-6 py-4 rounded-lg md:mx-8'>
                        <div className='flex justify-between px-8'>
                            <span
                                className='text-lg font-semibold'>{new Date(filterMinDate).toLocaleString('en-GB', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    timeZone: 'UTC',
                                })}</span>
                            <button onClick={handleCloseCalendarModal}>
                                <CloseRounded className={'text-coolBlue'} />
                            </button>
                        </div>
                        <Divider />

                        <div
                            className='hidden md:block mx-4 md:mx-8 border border-[#eeeeee] rounded-lg'>
                            <Tbl data={filteredReports} columns={columns} type={"Reports"} />
                        </div>

                        <div className='block md:hidden mt-4 mb-20'>
                            <AccordionTable data={filteredReports} type={"Reports"} />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>)
}

export default HomeView