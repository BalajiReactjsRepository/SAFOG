import React from "react";
import brandLogo from "../Assets/Brand.png";
import facebook from "../Assets/facebook.png";
import twitter from "../Assets/twitter.png";
import instagram from "../Assets/instagram.png";
import heterohealthcare from "../Assets/heterohealthcare.png";

const FooterModule = () => {
  return (
    <div className='footer blueBg pt-5 pb-3'>
      <div className='container'>
        <div className='d-flex justify-content-between gap-3 flex-wrap'>
          <img src={brandLogo} alt='brand' className='brand-logo' />
          <div className='d-flex align-items-center gap-2'>
            <img src={facebook} alt='facebook' className='social-icon' />
            <img src={twitter} alt='twitter' className='social-icon' />
            <img src={instagram} alt='instagram' className='social-icon' />
          </div>
          <img src={heterohealthcare} alt='brand' className='footer-logo' />
        </div>
        <span className='d-block border-bottom border-1 border-secondary my-3'></span>
        <small className='text-center d-block mt-1'>
          Copyright © {new Date().getFullYear()} All Rights Reserved by Hetero
          Healthcare Limited
        </small>
      </div>
    </div>
  );
};

export default FooterModule;
