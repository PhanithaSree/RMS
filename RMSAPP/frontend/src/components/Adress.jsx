import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { placeOrder, clearUserCart } from "../features/cartSlice";
import Success from "../Pages/Success/Success"; // Import the Success component

const Address = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",
    phoneNumber: "",
  });
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch(); // Add this line to get access to dispatch
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false); // State to track if the order is placed
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      // Extract user ID from user data
      const userId = userData._id;
      // Dispatch the placeOrder action
      dispatch(
        placeOrder({
          userId,
          products: cart.cartItems,
          totalAmount: cart.cartTotalAmount,
        })
      );
      const res = await axios.put(
        `http://localhost:3001/auth/update/adress/${userId}`,
        formData
      );
      if (res.status === 200) {
        console.log("Posted Address");
        toast.success("Order Placed Succesfully!", { position: "top-right" });
        setFormData({
          streetAddress: "",
          city: "",
          state: "",
          pinCode: "",
          phoneNumber: "",
        });
        setOrderPlaced(true); // Set orderPlaced to true after placing the order
        // Dispatch clearUserCart action to empty the cart after placing the order
        dispatch(clearUserCart());
      } else {
        console.error("Failed to update address");
        toast.error("This Adress Already Exists");
      }
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    axios
      .get("http://localhost:3001/auth/logout")
      .then((res) => {
        if (res.data.status) {
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {orderPlaced ? ( // Render the Success component if order is placed
        <Success />
      ) : (
        <>
          <nav>
            <div className="logo">Fun&Feast</div>
            <div className={show ? "navLinks showmenu" : "navLinks"}>
              <div className="links">
                <Link to="/savedaddresses">Your Adresses</Link>
              </div>
              {/* Conditionally render login/logout button and cart button */}
              {isLoggedIn ? (
                <>
                  <button className="menuBtn" onClick={handleLogout}>
                    Logout
                  </button>
                  <Link to="/cart">
                    <button className="menuBtn">
                      <FaShoppingCart />
                      <span className="redBadge">{cart.cartItems.length}</span>
                    </button>
                  </Link>
                </>
              ) : (
                <button className="menuBtn" onClick={handleLoginClick}>
                  Login
                </button>
              )}
              <Link to="/rendermenu">
                <button className="menuBtn">OUR MENU</button>
              </Link>
            </div>
            <div className="hamburger" onClick={() => setShow(!show)}>
              <GiHamburgerMenu />
            </div>
          </nav>
          <div className="container signup-container border p-4">
            {" "}
            {/* Apply classNames for the signup form container */}
            <div className="sign-up-container">
              <h2 className="text-center">Delivery Details</h2>
              <form onSubmit={handleSubmit} className="sign-up-form">

                <div className="mb-3">
                  <label htmlFor="streetAddress" className="form-label">
                    Street Address:
                  </label>
                  <input
                    type="textarea"
                    className="form-control input-custom"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="city" className="form-label">
                    City:
                  </label>
                  <input
                    type="text"
                    className="form-control input-custom"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="state" className="form-label">
                    State:
                  </label>
                  <input
                    type="text"
                    className="form-control input-custom"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="pinCode" className="form-label">
                    PIN Code:
                  </label>
                  <input
                    type="number"
                    className="form-control input-custom"
                    id="pinCode"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Contact Number:
                  </label>
                  <input
                    type="text"
                    className="form-control input-custom"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success btn-rounded"
                    style={{ backgroundColor: "green" }}
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Address;
