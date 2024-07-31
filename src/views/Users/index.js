import React, { useEffect } from "react";
import Tbl from "../../components/Table/Tbl";
import { DownloadRounded } from "@mui/icons-material";
import { useAllDataState } from "../../contexts/allDataContext";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import AccordionTable from "../../components/Accordion";
import { columns } from "./constants";
import { useAuthState } from "../../contexts/authContext";
import TitleButtons from "../../components/MainLayout/TitleButtons";

export const USER_TYPES = ["admin", "manager", "clerk", "customer"];

const UsersView = () => {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const { users } = useAllDataState();

  useEffect(() => {
    if (user?.role !== "admin") navigate(-1);
  }, [navigate, user]);

  return (
    <div className="pb-1">
      <TitleButtons
        data={users}
        title={"users"}
        addButton={"User"}
        disabled={user?.role !== "admin"}
      />

      <div className="hidden md:block border border-[#eeeeee] rounded-lg shadow-lg mb-20">
        <Tbl data={users} columns={columns} type={"Users"} />
      </div>

      <div className="block md:hidden mt-4 mb-20">
        <AccordionTable data={users} type={"Users"} />
      </div>
    </div>
  );
};

export default UsersView;
