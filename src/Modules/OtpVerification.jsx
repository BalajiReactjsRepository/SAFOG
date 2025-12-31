import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import otpImg from "../Assets/otp.png";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import {
  onLoading,
  onLoadingClose,
  onSuccess,
  onError,
} from "../Utils/ErrorHandler";
import MakersLogo from "../Utils/MakersLogo";
import { AuthContext } from "../Store/AuthContext";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");

  const location = useLocation();
  const { userMail } = location.state || {};
  const { setAuthToken, setSubmitStatus } = useContext(AuthContext);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const tokenKey = process.env.REACT_APP_TOKEN;
  const token = Cookies.get(tokenKey);

  const inputsRef = useRef([]);

  const navigate = useNavigate();
  const verifiedRef = useRef(false);

  // useEffect(() => {
  //   if (token) navigate("/registration");
  // }, [token, navigate]);

  useEffect(() => {
    // If user already logged in AND not coming from OTP verification
    if (token && !verifiedRef.current) {
      navigate("/registration");
    }
  }, [token, navigate]);

  const handleOtp = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 6 - 1) {
      inputsRef.current[index + 1].focus();
    }
    setError("");
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
    setError("");
  };

  const resendOtp = async (e) => {
    e.preventDefault();
    try {
      onLoading();
      const response = await axios.post(`${baseUrl}/auth/send-otp`, {
        email: userMail,
      });
      onLoadingClose();
      if (response.status === 200) {
        onSuccess({ message: "OTP Sent" });
      }
    } catch (error) {
      onLoadingClose();
      onError();
    }
  };

  const submitOtp = async () => {
    const joinedOtp = otp.join("").trim();

    if (!joinedOtp || joinedOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      onLoading();

      const res = await axios.post(`${baseUrl}/auth/verify-otp`, {
        email: userMail,
        otp: joinedOtp,
      });

      if (res?.data?.status === "success") {
        onLoadingClose();
        const { token, essay_submitted } = res.data.data;
        onSuccess({ message: "OTP verified successfully" });
        // Cookies.set(tokenKey, token);
        // setAuthToken(token);
        // console.log(essay_submitted, "test");
        // if (essay_submitted) {
        //   navigate("/submitted", {
        //     state: {
        //       message:
        //         "Your essay has already been submitted. Winners will be announced soon.",
        //     },
        //   });
        // } else {
        //   navigate("/registration");
        // }
        verifiedRef.current = true; // 🔥 important
        Cookies.set(tokenKey, token);
        setAuthToken(token);

        if (essay_submitted) {
          navigate("/submitted", {
            state: {
              message:
                "Your essay has already been submitted. Winners will be announced soon.",
            },
          });
        } else {
          navigate("/registration");
        }
      }
    } catch (error) {
      onLoadingClose();
      onError({ message: "Invalid or expired OTP" });
    }
  };

  return (
    <div className='d-flex flex-column align-items-center w-100 mb-5 p-4'>
      <div className='otp-card p-4'>
        <Row>
          <Col sm={12} className='text-center'>
            <img src={otpImg} alt='otpImg' className='otp-logo my-3' />
            <h4 className='heading'>Verify with OTP</h4>
            <p>Enter your SAFOG-registered email to get OTP</p>
          </Col>
        </Row>
        <Row className='d-flex align-items-end my-2'>
          <Col sm={12} md={8}>
            <Form.Group className='' controlId='formGroupEmail'>
              <Form.Label className='fw-bold otp-form'>
                Email Address
              </Form.Label>
              <Form.Control
                className='readOnlyInput'
                type='text'
                value={userMail}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col sm={12} md={4}>
            <button
              className='text-nowrap sec-btn rounded-3 border-0 mt-2 mt-md-0 w-100'
              onClick={resendOtp}
            >
              Re-Send OTP
            </button>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col sm={12}>
            <Form.Group as={Col} controlId='formGridZip'>
              <Form.Label className='fw-bold otp-form'>
                Enter the OTP Send to your email
              </Form.Label>
              <div className='d-flex gap-2 gap-md-4'>
                {otp.map((value, i) => (
                  <Form.Control
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type='text'
                    className='otp-input'
                    value={value}
                    maxLength={1}
                    onChange={(e) => handleOtp(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                  />
                ))}
              </div>
              {error && <small className='text-danger'>{error}</small>}
            </Form.Group>
          </Col>
          <Col className='my-3' sm={12}>
            <button
              className='sec-btn rounded-3 w-100 border-0'
              onClick={submitOtp}
            >
              Verify and Continue
            </button>
          </Col>
        </Row>
        <p className='note-text fw-normal'>
          <span className='text-danger fw-bold'>Note: </span>Your Registration
          Number will be sent to your email
        </p>
      </div>
      <div className='makers-section'>
        <MakersLogo />
      </div>
    </div>
  );
};

export default OtpVerificationPage;
