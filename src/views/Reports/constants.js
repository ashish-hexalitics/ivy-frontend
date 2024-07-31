export const columns = [
  { title: "", data: "property" },
  { title: "Ref No", data: "referenceNo" },
  { title: "Date", data: "dateOfReport" },
  { title: "Address", data: "address" },
  { title: "Town", data: "town" },
  { title: "Postcode", data: "postcode" },
  { title: "Customer", data: "customerName" },
  { title: "Report type", data: "reportType" },
  { title: "Inspector", data: "completedBy" },
  { title: "Tenants", data: "tenancyCount" },
  { title: "Status", data: "status" },
  { title: "", data: "viewReport" },
];

export const NotesColumns = [
  { title: "Date", data: "date" },
  { title: "Time", data: "time" },
  { title: "Note", data: "note" },
  { title: "Edit Note", data: "editNote" },
];

export const REPORT_STATUS =
  "awaiting,approved,pending,signed,feedback,completed,draft".split(",");

export const REPORT_ITEMS = [
  {
    title: "Rooms & Areas",
    status: "Complete",
  },
  {
    title: "Check In Overview",
    status: "To do",
  },
  {
    title: "Meters",
    status: "Complete",
  },
  {
    title: "Utilities",
    status: "Complete",
  },
  {
    title: "H&S Compliance",
    status: "Partly complete",
  },
  // {
  //     title: 'Inspection Comments',
  //     status: 'To do'
  // },
  {
    title: "Documents",
    status: "To do",
  },
  {
    title: "Signature",
    status: "To do",
  },
];

export const OVERVIEW_TYPES = ["Decor", "Fixtures", "Furnishings & Effects"];

export const FIRE_ALARM_QUESTION = [
  "Are all floors fitted with a smoke/heat alarm?",
  "Are all smoke/heat alarms functional?",
  "Are any smoke/heat alarms approaching the end of their life cycle?",
  "Are carbon monoxide alarms present in rooms with a solid fuel burning source?",
  "Are all carbon monoxide alarms functional?",
  "Are any carbon monoxide alarms approaching the end of their life cycle?",
];

export const CURRENT_DESCRIPTION_OPTIONS = [
  "Wood paneled",
  "Wood flat panel",
  "Clear glass",
  "Dented (outer edge)",
];

export const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];

export const LIABILITIES = ["Tenant", "Landlord", "Fair wear & tear", "N/A"];

export const MAINTENANCE_ISSUES = [
  "Light Clean",
  "Professional Clean",
  "Carpet Clean",
  "Maintenance",
  "Missing Item",
  "Damaged Item",
  "Repair Item",
  "Repainting Required",
  "Replace Item",
  "Item Left Behind",
];

export const COLORS = {
  "Very Poor": {
    bg: "#6B070780",
    border: "#6B0707",
  },
  Poor: {
    bg: "#E31A1A80",
    border: "#E31A1A",
  },
  Fair: {
    bg: "#D6541C80",
    border: "#D6541C",
  },
  Good: {
    bg: "#61E75680",
    border: "#61E756",
  },
  Excellent: {
    bg: "#0D9F1C80",
    border: "##0D9F1C",
  },
};
