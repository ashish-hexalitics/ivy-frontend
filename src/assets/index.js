import logo from "../assets/logo.png";
import screen1 from "../assets/screen1.png";
import key from "../assets/key.svg";
import eye from "../assets/eye.svg";
import sms from "../assets/sms.svg";
import search from "../assets/search.svg";
import upload from "../assets/upload.svg";
import upload_photo from "../assets/upload_photo.svg";
import docs from "../assets/docs.svg";
import docs_bw from "../assets/docs_bw.svg";
import photo_bw from "../assets/photo_bw.svg";
import add__room from "../assets/add__room.svg";
import forgot_password from "../assets/forgot_password.svg";
import check_email from "../assets/check_email.svg";
import success from "../assets/success.svg";
import customers from "../assets/customers.svg";
import properties from "../assets/properties.svg";
import reports from "../assets/reports.svg";
import tenants from "../assets/tenants.svg";
import green_tick from "../assets/green_tick.svg";

export {
  logo,
  screen1,
  key,
  eye,
  sms,
  search,
  upload,
  upload_photo,
  docs,
  docs_bw,
  photo_bw,
  add__room,
  forgot_password,
  check_email,
  success,
  customers,
  properties,
  reports,
  tenants,
  green_tick,
};

export function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
