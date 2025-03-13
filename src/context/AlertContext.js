import React, { createContext, useContext, useState, useCallback } from "react";
import CustomAlert from "../components/CustomAlert";

const AlertContext = createContext({
  showAlert: () => {},
  hideAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "success",
    message: "",
    autoClose: true,
    duration: 3000,
  });

  const showAlert = useCallback(
    ({ type = "success", message, autoClose = true, duration = 3000 }) => {
      setAlertConfig({
        visible: true,
        type,
        message,
        autoClose,
        duration,
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        autoClose={alertConfig.autoClose}
        duration={alertConfig.duration}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};
