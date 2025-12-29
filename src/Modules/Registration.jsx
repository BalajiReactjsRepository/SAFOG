import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {
  onLoading,
  onLoadingClose,
  onSuccess,
  onError,
} from "../Utils/ErrorHandler";
import moment from "moment";
import Cookies from "js-cookie";
import successImg from "../Assets/success.png";
import { useNavigate } from "react-router-dom";
import MakersLogo from "../Utils/MakersLogo";
import { AuthContext } from "../Store/AuthContext";

const validationSchema = Yup.object({
  first_name: Yup.string()
    .trim()
    .max(100, "First name must not exceed 100 characters")
    .required("First name is required"),

  last_name: Yup.string()
    .trim()
    .max(100, "Last name must not exceed 100 characters")
    .required("Last name is required"),
  country: Yup.string().required("Country is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.string().required("Date of birth is required"),
  speciality: Yup.array().min(1, "Select at least one speciality"),
});

const Registration = () => {
  const { setGenderValue, setDoctorNameState } = useContext(AuthContext);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const tokenKey = process.env.REACT_APP_TOKEN || "token";
  const token = Cookies.get(tokenKey);

  const [values, setValues] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    country: "",
    dob: "",
    age: "",
    gender: "",
    speciality: [],
  });

  const [errors, setErrors] = useState({});
  const [countriesList, setCountriesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesApi = `${baseUrl}/countries/all`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.get(countriesApi, { headers });
        setCountriesList(res?.data?.data?.countries ?? []);
      } catch (err) {
        console.log(err);
        onError(err);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const url = `${baseUrl}/user/me`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        onLoading();
        const res = await axios.get(url, { headers });
        onLoadingClose();
        if (res?.data?.status === "success") {
          const profile = res?.data?.data?.profile;
          if (!profile) {
            return;
          }

          const {
            first_name,
            middle_name,
            last_name,
            country,
            dob,
            age,
            gender,
            speciality,
          } = profile;

          setValues({
            first_name: first_name || "",
            middle_name: middle_name || "",
            last_name: last_name || "",
            country: country || "",
            gender: gender || "",
            dob: dob ? moment(dob).format("YYYY-MM-DD") : "",
            age: age || "",
            speciality: speciality ?? [],
          });
          // setDoctorName(first_name, gender);
          setGenderValue(gender);
          setDoctorNameState(first_name);
        }
      } catch (err) {
        onLoadingClose();
      }
    };

    fetchCountries();

    if (token) {
      fetchUserDetails();
    }
  }, [token, baseUrl, setDoctorNameState, setGenderValue]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setValues((prev) => {
      let updated = { ...prev };

      if (type === "checkbox") {
        updated.speciality = checked
          ? [...prev.speciality, value]
          : prev.speciality.filter((item) => item !== value);
      } else {
        updated[name] = value;
      }

      if (name === "dob") {
        updated.age = value
          ? moment().diff(moment(value, "YYYY-MM-DD"), "years")
          : "";
      }

      return updated;
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});

      onLoading();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const { age, ...payload } = values;
      const res = await axios.post(`${baseUrl}/user/save`, payload, {
        headers,
      });

      onLoadingClose();

      if (res?.data?.status === "success") {
        onSuccess({ message: "Registration completed." });
        navigate("/upload-essay");
      }
    } catch (err) {
      onLoadingClose();
      if (err.name === "ValidationError") {
        const formErrors = {};
        err.inner.forEach((e) => {
          formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      } else {
        onError(err);
      }
    }
  };

  return (
    <div className='container'>
      <div className='registration-cont m-auto mb-5'>
        <div className='d-flex align-items-center gap-2 mt-2 mb-3'>
          <img src={successImg} alt='' />
          <h4 className='fw-semibold'>OTP is Verified Successfully</h4>
        </div>

        <div className='registration-card p-4'>
          <h5>Your Profile Details</h5>
          <span className='d-block mt-2 mb-3'>Check and edit the fields</span>

          <Form onSubmit={handleSubmit}>
            <Row className='mb-3'>
              <Form.Group as={Col} md={4}>
                <Form.Label className='fw-semibold'>First Name *</Form.Label>
                <Form.Control
                  name='first_name'
                  value={values.first_name}
                  onChange={handleChange}
                  isInvalid={!!errors.first_name}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.first_name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={4}>
                <Form.Label className='fw-semibold'>Middle Name</Form.Label>
                <Form.Control
                  name='middle_name'
                  value={values.middle_name || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group as={Col} md={4}>
                <Form.Label className='fw-semibold'>Last Name *</Form.Label>
                <Form.Control
                  name='last_name'
                  value={values.last_name}
                  onChange={handleChange}
                  isInvalid={!!errors.last_name}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.last_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>Country *</Form.Label>
              <Form.Select
                name='country'
                value={values.country}
                onChange={handleChange}
                isInvalid={!!errors.country}
              >
                <option value=''>Choose...</option>
                {countriesList.map((each, i) => (
                  <option key={i} value={each.code}>
                    {each.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type='invalid'>
                {errors.country}
              </Form.Control.Feedback>
            </Form.Group>

            <Row className='mb-3'>
              <Col md={4}>
                <Form.Group className='mb-3'>
                  <Form.Label className='fw-semibold'>Gender *</Form.Label>
                  <Form.Select
                    name='gender'
                    value={values.gender}
                    onChange={handleChange}
                    isInvalid={!!errors.gender}
                  >
                    <option value=''>Choose...</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {errors.gender}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Label className='fw-semibold'>Date of Birth *</Form.Label>
                <Form.Control
                  type='date'
                  name='dob'
                  value={values.dob}
                  onChange={handleChange}
                  isInvalid={!!errors.dob}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.dob}
                </Form.Control.Feedback>
              </Col>

              <Col md={4}>
                <Form.Label className='fw-semibold'>Age *</Form.Label>
                <Form.Control
                  value={
                    values.age
                      ? values.age > 1
                        ? `${values.age} years`
                        : `${values.age} year`
                      : ""
                  }
                  readOnly
                />
              </Col>
            </Row>

            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>Speciality *</Form.Label>
              <div className='d-flex gap-3'>
                {["Gynecologist", "Obstetrician"].map((item) => (
                  <Form.Check
                    key={item}
                    label={item}
                    value={item}
                    checked={values.speciality.includes(item)}
                    name='speciality'
                    onChange={handleChange}
                    type='checkbox'
                  />
                ))}
              </div>
              {errors.speciality && (
                <div className='text-danger small'>{errors.speciality}</div>
              )}
            </Form.Group>

            <Button type='submit' className='sec-btn w-100 border-0'>
              Save and Continue
            </Button>
          </Form>
        </div>
      </div>
      <div className='makers-section'>
        <MakersLogo />
      </div>
    </div>
  );
};

export default Registration;
