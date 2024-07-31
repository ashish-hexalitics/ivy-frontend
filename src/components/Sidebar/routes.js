import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";
import NightShelterOutlinedIcon from "@mui/icons-material/NightShelterOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { TbTemplate } from "react-icons/tb";
import { ViewQuilt, ViewQuiltOutlined } from "@mui/icons-material";

export const ROUTES = [
  {
    id: 1,
    name: "Dashboard",
    icon: <DashboardOutlinedIcon fontSize={"small"} />,
    active_icon: (
      <DashboardOutlinedIcon fontSize={"small"} sx={{ color: "#532FD9" }} />
    ),
  },
  {
    id: 2,
    name: "Customers",
    icon: <AssignmentIndOutlinedIcon fontSize={"small"} />,
    active_icon: (
      <AssignmentIndOutlinedIcon fontSize={"small"} sx={{ color: "#532FD9" }} />
    ),
  },
  {
    id: 3,
    name: "Properties",
    icon: <HolidayVillageOutlinedIcon fontSize={"small"} />,
    active_icon: (
      <HolidayVillageOutlinedIcon
        fontSize={"small"}
        sx={{ color: "#532FD9" }}
      />
    ),
  },
  {
    id: 4,
    name: "Reports",
    icon: <AssignmentOutlinedIcon fontSize={"small"} />,
    active_icon: (
      <AssignmentOutlinedIcon fontSize={"small"} sx={{ color: "#532FD9" }} />
    ),
  },
  {
    id: 8,
    name: "Templates",
    icon: <ViewQuiltOutlined fontSize={"small"} />,
    active_icon: (
      <ViewQuiltOutlined fontSize={"small"} sx={{ color: "#532FD9" }} />
    ),
  },
  {
    id: 5,
    name: "Tenants",
    icon: <NightShelterOutlinedIcon fontSize={"small"} />,
    active_icon: (
      <NightShelterOutlinedIcon fontSize={"small"} sx={{ color: "#532FD9" }} />
    ),
  },
  {
    id: 6,
    name: "Users",
    icon: <GroupOutlinedIcon fontSize={"small"} />,
    active_icon: (
      <GroupOutlinedIcon fontSize={"small"} sx={{ color: "#532FD9" }} />
    ),
  },
  {
    id: 7,
    name: "Settings",
    icon: <SettingsOutlinedIcon fontSize={"small"} />,
    active_icon: (
      <SettingsOutlinedIcon fontSize={"small"} sx={{ color: "#532FD9" }} />
    ),
  },
];
