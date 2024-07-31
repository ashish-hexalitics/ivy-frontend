import React from "react";
import Tbl from "../../components/Table/Tbl";
import { DownloadOutlined, DownloadRounded } from "@mui/icons-material";
import { useAllDataState } from "../../contexts/allDataContext";
import { columns } from "./constants";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import AccordionTable from "../../components/Accordion";
import { useAuthState } from "../../contexts/authContext";
import TitleButtons from "../../components/MainLayout/TitleButtons";

const CustomersView = () => {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const { customers } = useAllDataState();

  return (
    <div className={"pb-1"}>
      <TitleButtons
        data={customers}
        title={"customers"}
        addButton={"Customer"}
        userRole={user.role}
      />

      <div className="hidden md:block border border-[#eeeeee] rounded-lg shadow-md mb-20">
        <Tbl data={customers} columns={columns} type={"Customers"} />
      </div>

      <div className="block md:hidden mt-4 mb-20">
        <AccordionTable data={customers} type={"Customers"} />
      </div>
    </div>
  );
};

export default CustomersView;
