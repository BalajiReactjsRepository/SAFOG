import React from "react";
import carbiactLogo from "../Assets/carbiact-logo.png";
import mylotinLogo from "../Assets/mylotin-logo.png";
import { Link, useLocation } from "react-router-dom";

const MakersLogo = () => {
  const { pathname } = useLocation();

  return (
    <section className='makers-logo-cont'>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12'>
            <h4 className='heading text-center mb-4'>
              <span style={{ color: "#2D318F" }}>From </span>The Makers of
            </h4>
          </div>
          <div className='col-sm-12 col-md-6 d-flex flex-column align-items-center'>
            <img
              src={carbiactLogo}
              alt='carbiact-logo'
              className='makers-logo'
            />
            {pathname === "/" && (
              <Link className='brand-link mt-2' to={"/product/carbiact"}>
                Click to Know More
              </Link>
            )}
          </div>
          <div className='col-sm-12 col-md-6 d-flex flex-column align-items-center'>
            <img src={mylotinLogo} alt='mylotin-logo' className='makers-logo' />
            {pathname === "/" && (
              <Link className='brand-link mt-2' to={"/product/mylotin"}>
                Click to Know More
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MakersLogo;
