import React from "react";
import { useSelector } from "react-redux";
import Toast from "./Toast";

const Alert = () => {
  const { alert } = useSelector((state) => state);

  return (
    <div>
      {alert.error && <Toast msg={{ msg: alert.error, statusErr: "error" }} />}
      {alert.success && (
        <Toast msg={{ msg: alert.success, statusSucc: "success" }} />
      )}
    </div>
  );
};

export default Alert;