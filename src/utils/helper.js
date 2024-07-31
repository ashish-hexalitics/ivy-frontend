export const storeUserInLocalStorage = (user, token) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  }
};

export const getUserFromLocalStorage = () => {
  const _user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  if (_user && token) {
    const user = JSON.parse(_user);
    return { user, token };
  }
  return null;
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validatePassword = (password) => {
  return String(password).match("^(?=.*[!@#$%^&*)(+=._-])(?=.*[A-Z]).{8,32}$");
};

export const validateMobile = (mobile) => {
  return String(mobile).match(
    /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/
  );
};

export const filterData = (
  reports,
  reportType,
  reportStatus,
  clerkType,
  minDate,
  maxDate,
  property_id = null
) => {
  if (!reportType && !reportStatus && !clerkType && !minDate && !maxDate && !property_id) {
    return reports;
  }
  return reports
    .filter((report) => {
      if (property_id === null) return report;
      return report.property_id === property_id
    })
    .filter((report) => {
      if (reportType === "") return report;
      return report.reportType === reportType;
    })
    .filter((report) => {
      if (clerkType === "") return report;
      return report.completedBy === clerkType;
    })
    .filter((report) => {
      if (reportStatus === "") return report;
      return report.status === reportStatus;
    })
    .filter((report) => {
      if (minDate === "" && maxDate === "") return report;
      return (
        new Date(report?.dateOfReport).toLocaleString().split(",")[0] <=
        new Date(maxDate).toLocaleString().split(",")[0] &&
        new Date(report?.dateOfReport).toLocaleString().split(",")[0] >=
        new Date(minDate).toLocaleString().split(",")[0]
      );
    });
};

export function handleSort(elems, dragElem, draggedOverElem) {
  const movedItem = elems.splice(dragElem.current, 1)[0];
  elems.splice(draggedOverElem.current, 0, movedItem);
  return elems;
}

export const convertToTitleCase = (s) =>
  s
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase());

export const formatDate = (d) => {
  const date = new Date(d);
  let month = date.getMonth(),
    day = date.getDate(),
    year = date.getFullYear();
  return `${year}-${month + 1}-${day}`;
};

export function formatDateReverse(inputDate) {
  const date = new Date(inputDate);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}
