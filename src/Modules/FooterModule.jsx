import React from "react";
import brandLogo from "../Assets/Brand.png";
import heterohealthcare from "../Assets/heterohealthcare.png";

const FooterModule = () => {
  return (
    <div className='footer blueBg pt-5 pb-3'>
      <div className='container'>
        <div className='d-flex justify-content-center align-items-center gap-5'>
          <img src={brandLogo} alt='brand' className='brand-logo' />
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
