import { green } from "@mui/material/colors";

// export const API_URL = "https://ivy.studiorav.co.uk/api";
export const API_URL = "http://localhost:8890/api";

export const X_API_KEY = "1234567891";

export const PROPERTY_TYPES = ["villa", "house", "apartment", "building"];

export const COLOR_SCHEMES = {
  started: {
    bg: "#DFAD4D1A",
    text: "#DFAD4D",
  },
  production: {
    bg: "#0671E01A",
    text: "#0671E0",
  },
  pending: {
    text: "#FF455E",
    bg: "#FFE7EA",
  },
  to_do: {
    text: "#FF455E",
    bg: "#FFE7EA",
  },
  awaiting: {
    bg: "#7CB9E8",
    text: "#1F75FE",
  },
  draft: {
    bg: "#DFAD4D1A",
    text: "#DFAD4D",
  },
  sent: {
    bg: "#7CB9E8",
    text: "#1F75FE",
  },
  feedback: {
    bg: "#7CB9E8",
    text: "#1F75FE",
  },
  completed: {
    bg: "#28B6501A",
    text: "#28B650",
  },
  complete: {
    bg: "#28B6501A",
    text: "#28B650",
  },
  approved: {
    bg: "#28B6501A",
    text: "#28B650",
  },
  signed: {
    bg: "#28B6501A",
    text: "#28B650",
  },

  quote: {
    bg: "#DFAD4D1A",
    text: "#DFAD4D",
  },
  quote_approved: {
    bg: "#28B6501A",
    text: "#28B650",
  },
  deposit_paid: {
    bg: "#DFAD4D1A",
    text: "#DFAD4D",
  },
  in_design: {
    bg: "#EB76221A",
    text: "#EB7622",
  },
  design_completed: {
    bg: "#28B6501A",
    text: "#28B650",
  },
  cutting_frames: {
    bg: "#0671E01A",
    text: "#0671E0",
  },
  keeping_frame: {
    bg: "#0671E01A",
    text: "#0671E0",
  },
  steel_and_gasket: {
    bg: "#0671E01A",
    text: "#0671E0",
  },
  welding: {
    bg: "#0671E01A",
    text: "#0671E0",
  },
  slab_cutting: {
    bg: "#0671E01A",
    text: "#0671E0",
  },
  finishing_frames: {
    bg: "#0671E01A",
    text: "#0671E0",
  },
  hanging_door: {
    bg: "#0671E01A",
    text: "#0671E0",
  },
  glazing_door: {
    bg: "#0671E01A",
    text: "#0671E0",
  },
  qc_wrapped: {
    bg: "#0671E01A",
    text: "#0671E0",
  },
  door_completed: {
    bg: "#28B6501A",
    text: "#28B650",
  },
  delivery_date_assigned: {
    bg: "#EB76221A",
    text: "#EB7622",
  },
  out_for_delivery: {
    bg: "#28B6501A",
    text: "#28B650",
  },
  delivered: {
    bg: "#28B6501A",
    text: "#28B650",
  },
  delivery_recieved: {
    bg: "#28B6501A",
    text: "#28B650",
  },
  payment_collected: {
    bg: "#28B6501A",
    text: "#28B650",
  },
};

export const REPORT_ROWS_BG_COLOR = {
  pending: "bg-white",
  started: "bg-orange-100",
  completed: "bg-[#abdcab]",
  awaiting: "bg-blue-200",
};

export const cloneReportData = [
  {
    name: "rooms_and_areas",
    images: true,
    title: "Rooms & Areas",
    inventoryreport: true,
    checkoutreport: true,
    inspectionreport: true,
  },
  {
    name: "check_in_overview",
    images: true,
    title: "Check In Overview",
    inventoryreport: true,
    checkoutreport: false,
    inspectionreport: false,
  },
  {
    name: "inspection_overview",
    images: true,
    title: "Inspection Overview",
    inventoryreport: false,
    checkoutreport: false,
    inspectionreport: true,
  },
  {
    name: "check_out_overview",
    images: true,
    title: "Checkout Overview",
    inventoryreport: false,
    checkoutreport: true,
    inspectionreport: false,
  },
  {
    name: "h_s_compliance",
    images: true,
    title: "H&S Compliance",
    inventoryreport: true,
    checkoutreport: true,
    inspectionreport: true,
  },
  {
    name: "utilities",
    images: true,
    title: "Utilities",
    inventoryreport: true,
    checkoutreport: true,
    inspectionreport: false,
  },
  {
    name: "meters",
    images: true,
    title: "Meters",
    inventoryreport: true,
    checkoutreport: true,
    inspectionreport: false,
  },
];
