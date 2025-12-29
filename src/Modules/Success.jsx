import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import successImg from "../Assets/success2.png";
import MakersLogo from "../Utils/MakersLogo";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  // const token = Cookies.get(tokenKey);
  return (
    <div className='d-flex flex-column align-items-center'>
      <div className='otp-card p-4 border-0 my-3'>
        <Row>
          <Col sm={12} className='text-center'>
            <img src={successImg} alt='otpImg' className='otp-logo my-3' />

            {state?.message ? (
              <h4 className='heading'>{state?.message}</h4>
            ) : (
              <h4 className='heading'>
                Your essay has been uploaded successfully. Winners will be
                announced Shortly.
              </h4>
            )}
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col className='my-3' sm={12}>
            <button
              className='sec-btn rounded-3 w-100 border-0'
              onClick={() => navigate("/leaderboard")}
            >
              Done
            </button>
          </Col>
        </Row>
      </div>
      <div className='makers-section'>
        <MakersLogo />
      </div>
    </div>
  );
};

export default Success;
