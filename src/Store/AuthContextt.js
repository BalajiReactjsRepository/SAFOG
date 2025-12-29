// AuthContext.js
import { createContext, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [doctorName, setDoctorNameState] = useState(
    localStorage.getItem("doctor-name") || ""
  );
  const [genderVal, setGenderValue] = useState(
    localStorage.getItem("gender-value") || ""
  );

  const setDoctorName = (name = "", gender = "") => {
    setDoctorNameState(name);
    setGenderValue(gender);
    if (name) {
      localStorage.setItem("gender-value", gender);
    } else {
      localStorage.removeItem("doctor-name");
      localStorage.removeItem("gender-value");
    }
  };

  const logout = () => {
    localStorage.removeItem("doctor-name");
    localStorage.removeItem("gender-value");
    Cookies.remove(process.env.REACT_APP_TOKEN);
    setDoctorNameState("");
    setGenderValue("");
  };

  return (
    <AuthContext.Provider
      value={{
        doctorName,
        genderVal,
        setDoctorName,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
