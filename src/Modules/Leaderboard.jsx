import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import MakersLogo from "../Utils/MakersLogo";
import axios from "axios";
import Cookies from "js-cookie";
import first from "../Assets/first.png";
import second from "../Assets/second.png";
import winner from "../Assets/winner.png";

const Leaderboard = () => {
  const [socitiesList, setSocitiesList] = useState([]);
  const [totalParicipants, setTotalParicipants] = useState("");
  const [winnersList, setWinnersList] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const tokenKey = process.env.REACT_APP_TOKEN || "token";
  const token = Cookies.get(tokenKey);

  useEffect(() => {
    const socities = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/societies/with-country-participant-count`
        );
        const { total_participants, societies } = res?.data?.data;
        setSocitiesList(societies);
        setTotalParicipants(total_participants);
      } catch (error) {
        console.log(error);
      }
    };
    socities();
  }, [baseUrl]);

  useEffect(() => {
    const winnersRes = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const winnersRes = await axios.get(`${baseUrl}/winners`, { headers });
        const res = winnersRes?.data?.data;
        setWinnersList(res);
      } catch (error) {}
    };
    winnersRes();
  }, [baseUrl, token]);

  console.log(socitiesList);

  return (
    <section className='leaderboard-sec'>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12 col-md-8'>
            <h4 className='heading mb-3' style={{ color: "#2D318F" }}>
              Society Wise Participants
            </h4>
            <span className='fw-semibold d-block mb-4'>
              Total Participants : {totalParicipants}
            </span>
            <div className='d-flex flex-wrap justify-content-center justify-content-md-start gap-3'>
              {socitiesList.map((each, i) => (
                <Card
                  key={i}
                  style={{ width: "20rem" }}
                  className='assosciation-card border-0 rounded-3'
                >
                  <Card.Body>
                    <div className='d-flex align-items-start gap-2'>
                      <img
                        src={each.country_logo}
                        alt='country'
                        className='country-logo'
                      />
                      <div className='card-content'>
                        <h6 className='fw-bold'>{each.society_code}</h6>
                        <Card.Subtitle className='mb-2'>
                          {each.society_name}
                        </Card.Subtitle>
                        <Card.Title className='mt-2'>
                          {each.participant_count}
                        </Card.Title>
                        <Card.Subtitle className='mb-2'>
                          Participants
                        </Card.Subtitle>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
          <div className='col-sm-12 col-md-4'>
            <div className='d-flex flex-column flex-md-row align-items-center align-items-md-end justify-content-center gap-3 py-3'>
              <div className='d-flex flex-column align-items-center'>
                {/* <img src={profileImg} alt='profile' className='profileImg' /> */}
                {winnersList[1]?.full_name !== "--" ? (
                  <h6 className='fw-semibold mt-2 winner-name mb-2'>
                    {winnersList[1]?.full_name}
                  </h6>
                ) : (
                  <h6>--</h6>
                )}
                {winnersList[1]?.country_logo !== "--" ? (
                  <img
                    src={winnersList[1]?.country_logo}
                    alt='flag'
                    className='flag'
                  />
                ) : (
                  <small>NA</small>
                )}
                {winnersList[1]?.country_name !== "--" ? (
                  <small className='fw-semibold d-block'>
                    {winnersList[1]?.country_name}
                  </small>
                ) : (
                  <h6>--</h6>
                )}
                <div className='registration-panel d-flex flex-column align-items-center rounded-3 p-3 mt-2'>
                  <img src={winner} alt='first-prize' className='prize1' />
                  <h6 className='text-light fw-semibold mt-2 text-nowrap winner-stage'>
                    {winnersList[1]?.position}
                  </h6>
                  <h6 className='text-light fw-bold winner-amount'>
                    &#8377; {winnersList[1]?.prize_amount}
                  </h6>
                </div>
              </div>
              <div className='d-flex flex-column align-items-center'>
                {/* <img src={profileImg} alt='profile' className='profileImg' /> */}
                {winnersList[0]?.full_name !== "--" ? (
                  <h6 className='fw-semibold mt-2 winner-name mb-2'>
                    {winnersList[0]?.full_name}
                  </h6>
                ) : (
                  <h6>--</h6>
                )}
                {winnersList[0]?.country_logo !== "--" ? (
                  <img
                    src={winnersList[0]?.country_logo}
                    alt='flag'
                    className='flag'
                  />
                ) : (
                  <small>Na</small>
                )}
                {winnersList[0]?.country_logo !== "--" ? (
                  <small className='fw-semibold d-block'>
                    {winnersList[0]?.country_name}
                  </small>
                ) : (
                  <h6>--</h6>
                )}
                <div className='registration-panel d-flex flex-column align-items-center rounded-3 p-3 winner-graph mt-2'>
                  <img src={first} alt='first-prize' className='prize1' />
                  <h6 className='text-light fw-semibold mt-2 text-nowrap winner-stage'>
                    {winnersList[0]?.position}
                  </h6>
                  <h6 className='text-light fw-bold winner-amount'>
                    &#8377; {winnersList[0]?.prize_amount}
                  </h6>
                </div>
              </div>
              <div className='d-flex flex-column align-items-center'>
                {/* <img src={profileImg} alt='profile' className='profileImg' /> */}
                {winnersList[2]?.full_name !== "--" ? (
                  <h6 className='fw-semibold mt-2 winner-name mb-2'>
                    {winnersList[2]?.full_name}
                  </h6>
                ) : (
                  <h6>--</h6>
                )}
                {winnersList[2]?.country_logo !== "--" ? (
                  <img
                    src={winnersList[2]?.country_logo}
                    alt='flag'
                    className='flag'
                  />
                ) : (
                  <h6>NA</h6>
                )}
                {winnersList[2]?.country_name !== "--" ? (
                  <small className='fw-semibold d-block'>
                    {winnersList[2]?.country_name}
                  </small>
                ) : (
                  <h6>--</h6>
                )}
                <div className='registration-panel d-flex flex-column align-items-center rounded-3 p-3 mt-2'>
                  <img src={second} alt='first-prize' className='prize1' />
                  <h6 className='text-light fw-semibold mt-2 text-nowrap winner-stage'>
                    {winnersList[2]?.position}
                  </h6>
                  <h6 className='text-light fw-bold winner-amount'>
                    &#8377; {winnersList[2]?.prize_amount}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row mt-4'>
          <div className='col-sm-12'>
            <MakersLogo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
