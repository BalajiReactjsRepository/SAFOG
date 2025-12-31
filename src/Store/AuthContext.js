import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const tokenKey = process.env.REACT_APP_TOKEN || "token";
  const [authToken, setAuthToken] = useState(Cookies.get(tokenKey) || null);
  const [doctorName, setDoctorNameState] = useState(
    localStorage.getItem("doctor-name") || ""
  );

  const [genderVal, setGenderValue] = useState(
    localStorage.getItem("gender-value") || "male"
  );

  const [submitStatus, setSubmitStatus] = useState(
    localStorage.getItem("submit-status")
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/me`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const profile = res?.data?.data?.profile;
        if (profile?.first_name) {
          setDoctorNameState(profile.first_name);
          setGenderValue(profile.gender);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (authToken && !doctorName) {
      fetchUser();
    }
  }, [authToken, baseUrl, doctorName]);

  useEffect(() => {
    if (doctorName) {
      localStorage.setItem("doctor-name", doctorName);
    }
    if (genderVal) {
      localStorage.setItem("gender-value", genderVal);
    }
    if (submitStatus) {
      localStorage.setItem("submit-status", submitStatus);
    }
  }, [doctorName, genderVal, submitStatus]);

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
        setDoctorNameState,
        setGenderValue,
        logout,
        setAuthToken,
        submitStatus,
        setSubmitStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
