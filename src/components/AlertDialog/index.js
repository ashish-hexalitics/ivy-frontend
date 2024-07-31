import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Input from "../Input/Input";
import { useToastState } from "../../contexts/toastContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CloseRounded } from "@mui/icons-material";

export default function AlertDialog({ open, handleClose, accept, content }) {
  const [deleteInput, setDeleteInput] = React.useState("");
  const { triggerToast } = useToastState();
  return (
    <div>
      <Dialog className={"md:ml-[20%]"} open={open} onClose={handleClose}>
        <span className="text-lg font-semibold md:w-[400px] h-[80px] px-8 pt-8">
          {content}
        </span>

        <div className="px-8 mb-4">
          <Input
            header="Please type delete here"
            type={"text"}
            placeholder={'Please type "delete" to confirm'}
            name="deleteText"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            required={true}
          />
        </div>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingX: "2rem",
            paddingBottom: "2rem",
          }}
        >
          <button
            className="px-6 h-9 text-xs font-bold bg-gray-200 hover:bg-[#EFEAFE] rounded-md"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className={`${
              deleteInput !== "delete"
                ? " bg-gray-200 text-gray-400"
                : "bg-coolBlue text-white"
            } bg-coolBlue px-6 h-9 text-xs font-bold rounded-md`}
            disabled={deleteInput !== "delete"}
            onClick={() => {
              accept();
              setDeleteInput("");
              handleClose();
            }}
          >
            <DeleteOutlineIcon className={"mr-1"} fontSize={"small"} />
            Delete
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
