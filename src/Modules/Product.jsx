import React, { useEffect, useState } from "react";
import FooterModule from "./FooterModule";
import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useParams } from "react-router-dom";
import hetero from "../Assets/hetero.png";
import * as Yup from "yup";
import {
  onLoading,
  onLoadingClose,
  onSuccess,
  onError,
} from "../Utils/ErrorHandler";

const validationSchema = Yup.object({
  first_name: Yup.string()
    .trim()
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),

  last_name: Yup.string()
    .trim()
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),

  phone_number: Yup.string()
    .required("Phone number is required")
    .length(10, "Enter valid 10 digit number"),

  email: Yup.string()
    .trim()
    .max(100, "Email cannot exceed 100 characters")
    .email("Invalid email address")
    .required("Email is required"),

  country: Yup.string().required("Country is required"),

  speciality: Yup.array()
    .min(1, "Select at least one speciality")
    .required("Speciality is required"),

  preferred_contact: Yup.array()
    .min(1, "Select at least one contact method")
    .required("Contact method is required"),

  message: Yup.string()
    .trim()
    .max(500, "Message cannot exceed 500 characters")
    .required("Message is required"),
});

const Product = () => {
  const [values, setValues] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    country: "",
    phone_number: "",
    email: "",
    speciality: [],
    preferred_contact: [],
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [countriesList, setCountriesList] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const { id } = useParams();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesApi = `${baseUrl}/countries/all`;

        const res = await axios.get(countriesApi);
        setCountriesList(res?.data?.data?.countries ?? []);
      } catch (err) {
        console.log(err);
        // onError(err);
      }
    };

    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`${baseUrl}/products/${id}`);
        const { data } = res?.data;
        setProductDetails(data);
      } catch (error) {}
    };
    fetchCountries();
    if (id) {
      fetchProductDetails();
    }
  }, [baseUrl, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["first_name", "middle_name", "last_name"].includes(name)) {
      const alphaValue = value
        .replace(/[^a-zA-Z\s]/g, "")
        .replace(/\s+/g, " ")
        .trimStart();

      setValues((prev) => ({
        ...prev,
        [name]: alphaValue,
      }));

      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    if (name === "phone_number") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);

      setValues((prev) => ({
        ...prev,
        phone_number: numericValue,
      }));

      setErrors((prev) => ({ ...prev, phone_number: "" }));
      return;
    }

    if (type === "checkbox") {
      setValues((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((v) => v !== value),
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validationSchema.isValid(values, {
      abortEarly: false,
    });
    if (!isValid) {
      try {
        await validationSchema.validate(values, { abortEarly: false });
      } catch (err) {
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      }
      return; // ⛔ HARD STOP — API WILL NEVER RUN
    }
    try {
      setErrors({});
      onLoading();

      const api = `${baseUrl}/contact/submit`;
      const body = {
        ...values,
        product_id: id === "mylotin" ? "1" : "2",
      };

      const res = await axios.post(api, body);

      if (res?.data?.status === "success") {
        onLoadingClose();
        onSuccess({ message: res.data.message });
      }
    } catch (err) {
      onLoadingClose();
      onError({ message: err?.response?.data?.message || "Server error" });
    }
  };

  return (
    <div>
      <Navbar expand='lg'>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            <img src={hetero} alt='brand' className='hetero-brand-logo' />
          </Navbar.Brand>
          <Nav className='ms-auto'>
            <Nav.Link className='fw-semibold brand-page'>
              {id[0].toUpperCase() + id.slice(1)}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <section>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-12 col-md-6'>
              <h4 className='heading'>{productDetails?.name}</h4>
              <h5 className='mt-3'>Composition</h5>
              <p>{productDetails?.composition}</p>
              <h5 className='mt-2'>About {productDetails?.name}</h5>
              <p>{productDetails?.description}</p>
            </div>
            <div className='col-sm-12 col-md-6 ps-5 text-center'>
              <img
                src={productDetails?.image_url}
                alt='flag'
                className='productImg'
              />
              <small className='text-danger fw-bold d-block'>
                {productDetails?.caution}
              </small>
            </div>
            <div className='col-sm-12 mt-4'>
              <h5>Get in Touch</h5>
              <small>
                Please complete the form, and our team will contact you to
                provide more details.
              </small>
              <Form className='my-3' onSubmit={handleSubmit}>
                <Row>
                  <Form.Group as={Col} md={4} className='mb-2'>
                    <Form.Label className='fw-semibold'>
                      First Name *
                    </Form.Label>
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

                  <Form.Group as={Col} md={4} className='mb-2'>
                    <Form.Label className='fw-semibold'>Middle Name</Form.Label>
                    <Form.Control
                      name='middle_name'
                      value={values.middle_name || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={4} className='mb-2'>
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

                <Row className='mb-3'>
                  <Col md={4} className='mb-2'>
                    <Form.Label className='fw-semibold'>
                      Phone Number<sup>*</sup>
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='phone_number'
                      value={values.phone_number}
                      onChange={handleChange}
                      isInvalid={!!errors.phone_number}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.phone_number}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={4} className='mb-2'>
                    <Form.Label className='fw-semibold'>
                      Email Address *
                    </Form.Label>
                    <Form.Control
                      type='text'
                      value={values.email}
                      onChange={handleChange}
                      name='email'
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.email}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={4} className='mb-2'>
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
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Form.Group as={Col} md={4} className='mb-3'>
                    <Form.Label className='fw-semibold'>
                      Speciality *
                    </Form.Label>
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
                      <div className='text-danger small'>
                        {errors.speciality}
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md={4} className='mb-3'>
                    <Form.Label className='fw-semibold'>
                      Preferred method of contact *
                    </Form.Label>
                    <div className='d-flex gap-3'>
                      {["Phone", "Email"].map((item) => (
                        <Form.Check
                          key={item}
                          label={item}
                          value={item}
                          checked={values.preferred_contact.includes(item)}
                          name='preferred_contact'
                          onChange={handleChange}
                          type='checkbox'
                        />
                      ))}
                    </div>
                    {errors.preferred_contact && (
                      <div className='text-danger small'>
                        {errors.preferred_contact}
                      </div>
                    )}
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label className='fw-semibold'>
                      Message/Enquire *
                    </Form.Label>
                    <Form.Control
                      name='message'
                      placeholder='Message/Enquire'
                      value={values.message}
                      onChange={handleChange}
                      isInvalid={!!errors.message}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <div className='d-flex justify-content-center mt-4'>
                  <Button type='submit' className='sec-btn border-0'>
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>
      <FooterModule />
    </div>
  );
};

export default Product;
