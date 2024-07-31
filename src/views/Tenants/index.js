import React from "react";
import Tbl from "../../components/Table/Tbl";
import { DownloadRounded } from "@mui/icons-material";
import { useAllDataState } from "../../contexts/allDataContext";
import { columns } from "./constants";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import AccordionTable from "../../components/Accordion";
import TitleButtons from "../../components/MainLayout/TitleButtons";

const TenanciesView = () => {
  const navigate = useNavigate();
  const { tenancies } = useAllDataState();

  return (
    <div className={"pb-1"}>
      <TitleButtons
        data={tenancies}
        route={"tenants"}
        title={"tenancies"}
        addButton={"Tenancy"}
      />

      <div className="hidden md:block border border-[#eeeeee] rounded-lg shadow-lg mb-20">
        <Tbl
          data={tenancies.filter((tenancy) => tenancy.property)}
          columns={columns}
          type={"Tenants"}
        />
      </div>

      <div className="block md:hidden mt-4 mb-20">
        {" "}
        <AccordionTable data={tenancies} type={"Tenancies"} />
      </div>
    </div>
  );
};

export default TenanciesView;
