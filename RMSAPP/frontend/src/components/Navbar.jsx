import React, { useState, useEffect } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom"; // Import Link as RouterLink
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import axios from "axios"; // Import axios for making HTTP requests
import { LoaderIcon } from "react-hot-toast";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State variable to track login status
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle login button click
  const handleLoginClick = () => {
    navigate("/login"); // Navigate to "/login" route when login button is clicked
  };

  // Function to handle logout
  const handleLogout = () => {
    // Make a request to the logout API to clear cookies
    axios
      .get("http://localhost:3001/auth/logout")
      .then((res) => {
        if (res.data.status) {
          localStorage.removeItem("user");
          // localStorage.removeItem("cartItem") // Remove user data from localStorage
          setIsLoggedIn(false); // Update login status
          navigate("/login"); // Redirect to login page
        }
      })
      .catch((err) => {
        console.log(err); // Handle error
      });
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <nav>
        <div className="logo">Fun&Feast</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {/* Mapping over navbarLinks array */}
            {data[0].navbarLinks.map((element) => (
              <Link
                to={element.link}
                spy={true}
                smooth={true}
                duration={500}
                key={element.id}
              >
                {element.title}
              </Link>
            ))}
          </div>
          {/* Conditionally render login/logout button */}
          {isLoggedIn ? (
              <>
              <button className="menuBtn" onClick={handleLogout}>
                Logout
              </button>
              <RouterLink to="/myorders">
                <button className="menuBtn">Orders</button>
              </RouterLink>
            </>
          
            
           
            
          ) : (
            <button className="menuBtn" onClick={handleLoginClick}>
              Login
            </button>
          )}
          <RouterLink to="/signup">
            <button className="menuBtn">SignUp</button>
          </RouterLink>
          <RouterLink to = "/rendermenu">
          <button className="menuBtn">MENU</button>
          </RouterLink>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
