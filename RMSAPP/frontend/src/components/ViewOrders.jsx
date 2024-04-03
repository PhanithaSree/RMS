import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const ViewOrders = () => {
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))._id;
        const response = await axios.get(
          `http://localhost:3001/orders/${userId}`
        );
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array indicates that this effect runs only once, similar to componentDidMount

  return (
    <>
      <nav>
        <div className="logo">Fun&Feast</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <RouterLink to="/">
              <button className="menuBtn">Home</button>
            </RouterLink>
          </div>
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
          <RouterLink to="/rendermenu">
            <button className="menuBtn">MENU</button>
          </RouterLink>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>

      <div className="cart-container">
        <h2>Your Orders</h2>
        {orders && orders.length > 0 ? (
          <div>
            <div className="titles">
              <div className="date">Date</div>
              <div className="dishes">Dishes</div>
              <div className="price">Price</div>
              <div className="quantity">Quantity</div>
            </div>
            <div className="cart-items">
              {orders.map((order) => (
                <div className="cart-item" key={order._id}>
                  <div className="date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="cart-product">
                    {order.products.map((product) => (
                      <div
                        key={product._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "12px",
                          marginBottom: "5px", // Add margin bottom to create space between dishes
                        }}
                      >
                        <img
                          style={{ display: "flex", marginRight: "10px" }}
                          src={product.imageUrl}
                          alt={product.dishName}
                        />
                        <div>
                        <h3 style={{ fontSize: "9px", margin: "0" }}>
                            {product.dishName}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="cart-product-rice">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <div className="cart-product-quantity">
                    {order.products.reduce((acc, cur) => acc + cur.quantity, 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="cart-empty">
            <p>You havenot Ordered Anything Yet!!</p>{" "}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewOrders;
