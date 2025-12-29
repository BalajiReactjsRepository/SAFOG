import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavbarModule from "../Modules/NavbarModule";
import FooterModule from "../Modules/FooterModule";

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className='main-layout'>
      {location.pathname !== "/" && <NavbarModule />}
      <Outlet />
      <FooterModule />
    </div>
  );
};

export default MainLayout;
