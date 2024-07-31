import { photo_bw, upload_photo } from "../../assets";
import { DeleteForeverRounded } from "@mui/icons-material";
import AlertDialog from "../AlertDialog";
import React from "react";
import { useAuthState } from "../../contexts/authContext";

const UploadPhoto = ({
  form,
  getRootProps,
  getInputProps,
  handleDeletePhotoDialogOpen,
  deletePhotoDialogOpen,
  handleDeletePhotoDialogClose,
  deletePhoto,
  itemName,
  title,
  userRole,
  width,
  isAllowMultiple,
}) => {
  const { user } = useAuthState();

  return (
    <div className={`flex flex-col gap-2 w-full md:${width || "w-1/2"}`}>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-[#151515]">
          {title ? title : "Photo"}
        </span>
        {form[itemName].length > 0 && (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
          </div>
        )}
      </div>
      {form[itemName].length === 0 && (
        <div
          className="w-full h-[200px] border-2 border-dashed bg-white flex flex-col justify-center items-center gap-4 cursor-pointer"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <img src={upload_photo} alt="docs" />
          <span className="text-sm text-[#686868] font-medium">
            Click or drag a file to this area to upload.
          </span>
        </div>
      )}
      {form[itemName].length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {isAllowMultiple && (
            <div
              className="w-full h-[200px] border-2 mb-4 border-dashed bg-white flex flex-col justify-center items-center gap-4 cursor-pointer"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <img src={upload_photo} alt="docs" />
              <span className="text-sm text-[#686868] font-medium">
                Click or drag a file to this area to upload.
              </span>
            </div>
          )}
          {Array.isArray(form[itemName]) ? (
            form[itemName].map((item) => (
              <div
                className="flex bg-white items-center
            justify-start flex-wrap gap-4"
              >
                <div className="flex flex-col items-center w-full rounded-lg bg-gray-100 p-2">
                  <div className={"flex justify-end w-full items-end"}>
                    {userRole && userRole.includes(user?.role) ? (
                      <></>
                    ) : (
                      <button onClick={handleDeletePhotoDialogOpen}>
                        <DeleteForeverRounded className={"text-coolBlue"} />
                      </button>
                    )}
                  </div>

                  <div className={"px-4 py-2"}>
                    <img
                      src={item.length > 0 ? item : photo_bw}
                      alt="photo_bw"
                      className={`h-[120px] ${
                        itemName === "logo" ? "w-full" : "w-[120px]"
                      } object-cover rounded-lg`}
                    />
                  </div>
                </div>
                <AlertDialog
                  open={deletePhotoDialogOpen}
                  handleClose={handleDeletePhotoDialogClose}
                  accept={() => deletePhoto(item)}
                  content={"Delete this photo?"}
                />
              </div>
            ))
          ) : (
            <div className="flex bg-white items-center justify-between">
              <div className="flex flex-col items-end w-full rounded-lg bg-gray-100 p-2">
                {userRole && userRole.includes(user?.role) ? (
                  <></>
                ) : (
                  <button onClick={handleDeletePhotoDialogOpen}>
                    <DeleteForeverRounded className={"text-coolBlue"} />
                  </button>
                )}
                <div className={"px-4 py-2"}>
                  <img
                    src={form[itemName] ? form[itemName] : photo_bw}
                    alt="photo_bw"
                    className="max-h-[140px] rounded-lg"
                  />
                </div>
              </div>
              <AlertDialog
                open={deletePhotoDialogOpen}
                handleClose={handleDeletePhotoDialogClose}
                accept={() => deletePhoto(form[itemName])}
                content={"Delete this photo?"}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPhoto;
