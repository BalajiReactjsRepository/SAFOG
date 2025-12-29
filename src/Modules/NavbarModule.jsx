import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import brandLogo from "../Assets/Brand.png";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Store/AuthContext";
import male from "../Assets/male.svg";
import female from "../Assets/female.svg";

function NavbarModule() {
  const tokenKey = process.env.REACT_APP_TOKEN || "token";
  const token = Cookies.get(tokenKey);
  const { doctorName, logout, genderVal } = useContext(AuthContext);

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  console.log(genderVal, doctorName, "ll");
  return (
    <Navbar expand='lg'>
      <Container>
        <Navbar.Brand as={Link} to={token ? "/registration" : "/"}>
          <img src={brandLogo} alt='brand' className='brand-logo' />
        </Navbar.Brand>
        {token && (
          <>
            <Nav className='ms-auto'>
              {pathname === "/leaderboard" && (
                <button className='sec-btn rounded-3 w-100 border-0 ps-2 pe-2 me-3'>
                  Download Your Participation Certificate
                </button>
              )}
              <div className='d-flex gap-1'>
                {genderVal === "female" ? (
                  <img src={female} className='avatar' alt='profile' />
                ) : (
                  <img src={male} className='avatar' alt='profile' />
                )}

                <NavDropdown
                  className='fw-bold'
                  title={doctorName ? doctorName : "Profile"}
                  id='basic-nav-dropdown'
                >
                  <NavDropdown.Item as={Link} to='/registration'>
                    Edit Details
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/leaderboard'>
                    Leaderboard
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </Nav>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavbarModule;
