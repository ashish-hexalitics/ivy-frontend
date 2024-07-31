import { CheckOutlined, ChevronLeftRounded } from "@mui/icons-material";
import React, { useCallback, useState } from "react";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { useToastState } from "../../contexts/toastContext";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { useAuthState } from "../../contexts/authContext";
import { validateEmail, validatePassword } from "../../utils/helper";
import CustomSelect from "../../components/CustomSelect";
import { USER_TYPES } from ".";
import { useAllDataState } from "../../contexts/allDataContext";
import PasswordChecker from "../../components/PasswordChecker";

const AddUserView = () => {
  const navigate = useNavigate();

  const { triggerToast } = useToastState();
  const { token } = useAuthState();
  const { getUsers } = useAllDataState();

  const [form, setForm] = useState({
    email: "",
    role: "",
    name: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const addUser = useCallback(async () => {
    if (
      form.email === "" ||
      form.role === "" ||
      form.name === "" ||
      form.password === "" ||
      form.confirm_password === ""
    ) {
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
    if (!validatePassword(form.password)) {
      triggerToast("Invalid password", "error");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/account/user`,
        {
          name: form.name,
          type: form.role,
          email: form.email,
          password: form.password,
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
      navigate("/users");
      triggerToast("User added successfully!", "success");
    } catch (error) {
      triggerToast("Could not add user!", "error");
    }
  }, [token, form, triggerToast, navigate, getUsers]);

  return (
    <div>
      <div className="flex gap-4 items-center mt-6">
        <button onClick={() => navigate(-1)}>
          <ChevronLeftRounded className="text-coolBlue" fontSize="large" />
        </button>
        <span className="text-xl md:text-2xl font-semibold md:font-bold text-[#2D3436]">
          Add User
        </span>
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
          />

          <Input
            header={"Email"}
            type={"text"}
            placeholder={"Email"}
            name="email"
            value={form.email}
            onChange={handleChange}
            required={true}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <CustomSelect
            required={true}
            header={"Role"}
            name="role"
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
            required={true}
          />

          <Input
            header={"Confirm Password"}
            type={"password"}
            placeholder={"Confirm Password"}
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            required={true}
          />
        </div>
      </div>
      <div className="flex justify-center md:justify-end my-10">
        <button
          className="primary-button flex gap-[1px] items-center"
          onClick={addUser}
        >
          <CheckOutlined /> Save
        </button>
      </div>
    </div>
  );
};

export default AddUserView;
