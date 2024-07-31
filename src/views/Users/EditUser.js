import {
  CheckOutlined,
  ChevronLeftRounded,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import Input from "../../components/Input/Input";
import { useLocation, useNavigate } from "react-router-dom";
import { useToastState } from "../../contexts/toastContext";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { useAuthState } from "../../contexts/authContext";
import AlertDialog from "../../components/AlertDialog";
import { validateEmail, validatePassword } from "../../utils/helper";
import CustomSelect from "../../components/CustomSelect";
import { USER_TYPES } from ".";
import { useAllDataState } from "../../contexts/allDataContext";
import PasswordChecker from "../../components/PasswordChecker";

const EditUserView = () => {
  const navigate = useNavigate();
  const {
    state: { item, isEdit },
  } = useLocation();

  const { triggerToast } = useToastState();
  const { token, user } = useAuthState();
  const { getUsers, getCustomers } = useAllDataState();

  const [form, setForm] = useState({
    email: "",
    role: "",
    name: "",
    password: "",
    confirm_password: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        email: item?.email,
        role: item?.type,
        name: item?.name,
        password: "",
        confirm_password: "",
      });
    }
    if (isEdit) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [item, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const updateUser = useCallback(async () => {
    if (form.email === "" || form.role === "" || form.name === "") {
      triggerToast("Incomplete fields!", "warning");
      return;
    }
    if (form.password !== form.confirm_password) {
      triggerToast("Passwords do not match!", "error");
      return;
    }
    if (!validateEmail(form.email)) {
      triggerToast("Email is not valid!", "error");
      return;
    }
    if (form.password.length > 0 && !validatePassword(form.password)) {
      triggerToast("Invalid password", "error");
      return;
    }
    try {
      const response = await axios.put(
        `${API_URL}/account/user/${item._id}`,
        {
          name: form.name,
          type: form.role,
          password: form?.password,
          email: form?.email,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const data = await response.data;
      setForm({
        email: "",
        role: "",
        name: "",
        password: "",
        confirm_password: "",
      });
      getUsers();
      getCustomers();
      navigate("/users");
      triggerToast("User updated successfully!", "success");
    } catch (error) {
      triggerToast("Could not update user!", "error");
    }
  }, [token, form, triggerToast, item, navigate, getUsers]);

  const deleteUser = useCallback(async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/account/user/${item._id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.data;
      triggerToast("User deleted successfully!", "success");
      getUsers();
      navigate("/users");
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
  }, [item, token, triggerToast, navigate, getUsers]);

  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const handleDeleteUserDialogOpen = () => setDeleteUserDialogOpen(true);
  const handleDeleteUserDialogClose = () => setDeleteUserDialogOpen(false);

  return (
    <div>
      <div className="flex md:flex-row flex-col items-start justify-between mt-6">
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronLeftRounded className="text-coolBlue" fontSize="large" />
          </button>
          <span className="text-xl md:text-2xl font-semibold md:font-bold text-[#2D3436]">
            {isEditing ? "Edit" : "View"} User{" "}
          </span>
        </div>
        <div
          className={
            "flex gap-2 justify-between md:justify-end md:mt-0 mt-4 w-full md:w-fit"
          }
        >
          {user?.role !== "customer" ? (
            <button
              className="secondary-button w-full md:w-auto"
              onClick={handleDeleteUserDialogOpen}
            >
              <DeleteOutlined fontSize={"small"} className={"mr-2"} /> Delete
            </button>
          ) : (
            <div></div>
          )}
          {!isEditing && (
            <button
              className="secondary-button w-full md:w-auto"
              onClick={() => setIsEditing(true)}
            >
              <EditOutlined fontSize={"small"} className={"mr-2"} />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Input
            header={"Name"}
            type={"text"}
            placeholder={"Name"}
            name="name"
            value={form.name}
            onChange={handleChange}
            required={true}
            disabled={!isEditing}
          />
          <Input
            header={"Email"}
            type={"text"}
            placeholder={"Email"}
            name="email"
            value={form.email}
            onChange={handleChange}
            required={true}
            // disabled={!isEditing}
            disabled={true}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <CustomSelect
            required={true}
            header={"Role"}
            name="role"
            disabled={!isEditing}
            value={form.role}
            handleChange={handleChange}
            data={USER_TYPES}
            placeholder={"Role"}
          />
        </div>
        {form.password && <PasswordChecker password={form.password} />}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Input
            header={"Password"}
            type={"password"}
            placeholder={"Password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <Input
            header={"Confirm Password"}
            type={"password"}
            placeholder={"Confirm Password"}
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="flex justify-center md:justify-end items-center my-10">
        <button
          className="primary-button
                disabled:bg-gray-200 disabled:cursor-not-allowed flex gap-[1px] items-center"
          onClick={updateUser}
          disabled={!isEditing}
        >
          <CheckOutlined /> Save
        </button>
      </div>

      <AlertDialog
        open={deleteUserDialogOpen}
        handleClose={handleDeleteUserDialogClose}
        accept={deleteUser}
        content={"Delete this user?"}
      />
    </div>
  );
};

export default EditUserView;
