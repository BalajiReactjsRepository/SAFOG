import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import first from "../Assets/first.png";
import second from "../Assets/second.png";
import winner from "../Assets/winner.png";
// import leftBanner from "../Assets/leftBanner.png";
import { useNavigate } from "react-router-dom";
import {
  onLoading,
  onLoadingClose,
  onSuccess,
  onError,
} from "../Utils/ErrorHandler";
import Cookies from "js-cookie";
import brandLogo from "../Assets/Brand.png";
import MakersLogo from "../Utils/MakersLogo";

const LandingPage = () => {
  const [userMail, setUserMail] = useState("");
  const [error, setError] = useState("");
  const [socities, setSocities] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const navigate = useNavigate();

  const token = process.env.REACT_APP_TOKEN;
  const tokenKey = Cookies.get(token);

  // useEffect(() => {
  //   if (tokenKey) {
  //     navigate("/registration");
  //   }
  // }, [tokenKey, navigate]);

  useEffect(() => {
    if (tokenKey) navigate("/registration");
  }, [tokenKey, navigate]);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/societies/with-country-participant-count`
        );

        const response = res.data?.data?.societies;
        setSocities(response);
      } catch (error) {
        console.error("Failed to fetch societies", error);
      }
    };

    fetchSocieties();
  }, [baseUrl]);

  const handleInput = (e) => {
    setUserMail(e.target.value);
    setError("");
  };

  const onSubmitSuccess = () => {
    navigate("/otp-verification", { state: { userMail } });
  };

  const handleRegisterEmail = async (e) => {
    e.preventDefault();
    try {
      if (!userMail) {
        setError("Enter the Email");
        return;
      }
      onLoading();
      const response = await axios.post(`${baseUrl}/auth/send-otp`, {
        email: userMail,
      });
      onLoadingClose();
      if (response?.status === 200) {
        onSuccess({ message: "Registered Successfully" });
        onSubmitSuccess();
      }
    } catch (error) {
      console.log(error);
      onLoadingClose();
      onError(error);
    }
  };

  return (
    <div>
      <div className='banner-sec'>
        {/* LEFT SECTION */}
        <div className='d-flex flex-column'>
          <img src={brandLogo} alt='brand' className='banner-logo' />

          <div className='left-sec'>
            <div className='banner-content'>
              <p className='banner-pill'>ESSAY COMPETITION 2025</p>

              <h4 className='banner-title'>
                South Asian Federation of Obstetrics and Gynaecology (SAFOG) in
                Collaboration with Hetero Healthcare is organizing an Essay
                Competition for SAFOG Members on Polycystic Ovarian Disease in
                South Asia.
              </h4>

              <span className='divider'></span>

              <h5 className='highlight'>Registration & Submission Link</h5>

              <p className='desc'>
                Enter your SAFOG-registered email to continue your competition
                registration.
              </p>

              <form className='d-flex flex-column flex-md-row gap-3'>
                <input
                  type='email'
                  placeholder='Enter your mail id'
                  className='email-input rounded-2'
                  maxLength={100}
                  value={userMail}
                  onChange={handleInput}
                />
                <button className='register-btn' onClick={handleRegisterEmail}>
                  Continue To Register
                </button>
              </form>
              {error && <small>{error}</small>}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className='right-sec'>
          <div className='deadline-card'>
            <h5>Submission Deadline:</h5>
            <p>Feb 14, 2026 | 11:59 PM IST</p>
          </div>
        </div>
      </div>

      {/* About us */}

      <section className='About'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-12 col-md-6'>
              <h4 className='heading'>
                About the <span style={{ color: "#2D318F" }}>Essay</span>
              </h4>
              <p className='about_text'>
                In the UK, a community-based study found that polycystic ovaries
                (PCO) were common among South Asian women (52%) compared to a
                predominantly Caucasian population (22%).
              </p>
              <p className='about_text'>
                A similar Sri Lankan study found the prevalence of PCOS to be
                6.3%. South Asians also show higher insulin resistance and
                type-2 diabetes, increasing long-term morbidity.
              </p>
              <h6 className='lh-base'>
                A test for plagiarism will be carried out. The essays will be
                judged by a panel of judges from SAFOG.
              </h6>
            </div>
            <div className='col-sm-12 col-md-6'>
              <div className='organ_bg'>
                <div className='row gap-2'>
                  <div className='col-md-3 border border-1 rounded p-2'>
                    <h5>Topic</h5>
                    <p>
                      <strong>Polycystic Ovarian disease</strong> in the South
                      Asia Region
                    </p>
                  </div>
                  <div className='col-md-8 border border-1 rounded p-2'>
                    <h5>Eligibility</h5>
                    <p>
                      Open to all members of OGSB,
                      FOGSI,NESOG,SOGP,SLCOG,AFSOG,SOGM below the age of
                      <strong> 45 years</strong>
                      as on 1st January 2025
                    </p>
                  </div>
                  <div className='col-md-7 border border-1 rounded p-2'>
                    <h5>Topics to Be Covered</h5>
                    <p>
                      Covering incidence, clinical features, diagnosis,
                      treatment, and long-term outcomes.
                    </p>
                  </div>
                  <div className='col-md-4 border border-1 rounded p-2'>
                    <h5>Word Limit</h5>
                    <p>
                      The essay should be around
                      <strong> 2,500 words</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* societies */}

      <section className='container'>
        <div className='societies-sec p-3 rounded-4'>
          <h4 className='heading text-center mb-4' style={{ color: "#2D318F" }}>
            Societies
          </h4>

          <div className='societies-list row'>
            {socities?.map((each, i) => (
              <div
                key={i}
                className='col-sm-12 col-md-6 d-flex align-items-center my-2'
              >
                <img src={each.country_logo} alt='flag' className='flag' />
                <p className='society_name d-inline mb-0 ms-2 fw-semibold'>
                  {each.society_code} -
                  <small className='fw-normal'>{each.society_name}</small>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* prizes sec */}

      <section className='prizelist-sec blueBg py-4'>
        <h4 className='heading text-center'>
          Attractive <span style={{ color: "#2D318F" }}>Prizes</span> Await
          <span style={{ color: "#2D318F" }}> theWinners</span>
        </h4>
        <div className='d-flex flex-column flex-md-row align-items-center justify-content-center gap-5 py-3'>
          <div className='registration-panel d-flex flex-column align-items-center rounded-3 p-3'>
            <img src={first} alt='first-prize' className='prize' />
            <h6 className='prize-title text-light fw-bold mt-2'>Winner</h6>
            <h5 className='prize-amount text-light'>&#8377; 40,000</h5>
            <span className='d-block text-light mb-2'>
              Essay will be Published in the SAFOG
            </span>
            <span className='d-block text-light'>
              SAFOG Winner’s Certificate
            </span>
          </div>
          <div className='registration-panel d-flex flex-column align-items-center rounded-3 p-3'>
            <img src={winner} alt='first-prize' className='prize' />
            <h6 className='prize-title text-light fw-bold mt-2'>
              1st Runner Up
            </h6>
            <h5 className='prize-amount text-light'>&#8377; 30,000</h5>
            <span className='d-block text-light mb-2'>
              Essay will be Published in the SAFOG
            </span>
            <span className='d-block text-light'>
              SAFOG Winner’s Certificate
            </span>
          </div>
          <div className='registration-panel d-flex flex-column align-items-center rounded-3 p-3'>
            <img src={second} alt='first-prize' className='prize' />
            <h6 className='prize-title text-light fw-bold mt-2'>
              2nd Runner Up
            </h6>
            <h5 className='prize-amount text-light'>&#8377; 20,000</h5>
            <span className='d-block text-light mb-2'>
              Essay will be Published in the SAFOG
            </span>
            <span className='d-block text-light'>
              SAFOG Winner’s Certificate
            </span>
          </div>
        </div>
        <h6 className='text-center lh-lg'>
          Winners will have the chance to present their work at the SAFOG
          conference in Kathmandu in April 2026.
        </h6>
        <p className='text-center about_text'>
          All participants will receive a Certificate of Participation.
        </p>
      </section>

      {/* Guidelines section */}

      <section className='guidelines-sec'>
        <div className='container'>
          <h4 className='heading text-center'>
            Limitations & Submission
            <span style={{ color: "#2D318F" }}> Guidelines</span>
          </h4>
          <div className='guidelines-cont rounded p-4 m-4'>
            <p>
              To ensure a fair and rigorous evaluation, all participants must
              observe the following limitations:
            </p>
            <ol>
              <li className='fw-bold'>
                Originality:
                <p className='fw-normal text-muted'>
                  All submissions must be the original, unpublished work of the
                  participant. Essays will be subject to plagiarism checks.
                </p>
              </li>
              <li className='fw-bold'>
                Exclusivity:
                <p className='fw-normal text-muted '>
                  Only one essay submission is permitted per participant.
                </p>
              </li>
              <li className='fw-bold'>
                Format:
                <p className='fw-normal text-muted'>
                  The essay must be written in English.
                </p>
              </li>
              <li className='fw-bold'>
                Deadline:
                <p className='fw-normal text-muted'>
                  All entries must be received via the submission portal by
                  February 15, 2026, 11:59 PM IST
                </p>
              </li>
              <li className='fw-bold'>
                Finality:
                <p className='fw-normal text-muted'>
                  The decision of the judging panel, appointed by SAFOG will be
                  final.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* makers section */}
      <div className='makers-section'>
        <MakersLogo />
      </div>

      {/* registration panel */}

      <section className='container'>
        <div className=' registration-panel rounded-4 p-4'>
          <div className='panel-body text-center'>
            <h4 className='heading text-light mb-3'>
              Registration & Submission Link
            </h4>
            <p className='text-light text-wrap mb-2'>
              Register your participation today to receive the official
              submission guidelines and the link to the submission portal.
            </p>
            <div className='input-cont'>
              <Form
                onSubmit={handleRegisterEmail}
                className='d-flex flex-column align-items-start justify-content-md-center flex-md-row gap-2 mt-3'
              >
                <div className='d-flex flex-column align-items-start registration-input'>
                  <Form.Control
                    placeholder='Enter your mail id'
                    className='input-field'
                    maxLength={100}
                    value={userMail}
                    onChange={handleInput}
                  />
                  {error && (
                    <small className='text-end text-light'>{error}</small>
                  )}
                </div>

                <button className='register-btn rounded-3 px-3' type='submit'>
                  Continue To Register
                </button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
