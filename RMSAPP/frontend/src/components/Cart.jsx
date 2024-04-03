import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  decreaseCart,
  removeFromCart,
  increaseCart,
  clearCart,
  updateProductQuantity,
  fetchCartItems,
  removeItemFromCart, // Import the new Thunk
  clearUserCart, // Import the new Thunk
} from "../features/cartSlice";

const Cart = () => {
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
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
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setIsLoggedIn(true);
      dispatch(fetchCartItems(userData._id))
        .then((result) => {
          if (result.payload && result.payload.length > 0) {
            // Cart data fetched successfully
            console.log("Cart Data Fetched");
            // You may perform additional actions here if needed
          } else {
            // Cart data is empty
            // You may handle this case if needed
            console.log("Empty");
          }
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
          // Handle error if needed
        });
    } else {
      // User is not logged in
      setIsLoggedIn(false);
    }
  }, [dispatch, setIsLoggedIn]);

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const handleRemovefromCart = (cartItem) => {
    dispatch(removeFromCart(cartItem)); // Remove from Redux store
    dispatch(
      removeItemFromCart(cartItem.dishId) // Dispatch removeItemFromCart with the dishId
    ).then(() => {
      // After successfully removing the item from the cart, fetch updated cart items
      dispatch(fetchCartItems(JSON.parse(localStorage.getItem("user"))._id));
    });
  };
  const handleDecreaseCart = (cartItem) => {
    if (cartItem.quantity <= 1) {
      // If quantity is 1 or less, remove the item from the cart
      handleRemovefromCart(cartItem);
    } else {
      // If quantity is greater than 1, decrease the quantity by 1
      dispatch(decreaseCart(cartItem));
      dispatch(
        updateProductQuantity({
          userId: userId,
          dishId: cartItem.dishId,
          quantity: cartItem.quantity - 1,
        })
      );
    }
  };
  const handleIncreaseCart = (cartItem) => {
    dispatch(increaseCart(cartItem));
    dispatch(
      updateProductQuantity({
        userId: userId,
        dishId: cartItem.dishId,
        quantity: cartItem.quantity + 1, // Increase quantity by 1
      })
    );
  };

  const handleClearCart = () => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    dispatch(clearUserCart(userId)).then(() => {
      // After clearing the cart, fetch updated cart items
      dispatch(fetchCartItems(userId));
    });
  };

  return (
    <>
      <nav>
        <div className="logo">Fun&Feast</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">{/* Your other navigation links */}</div>
          {/* Conditionally render login/logout button and cart button */}
          {isLoggedIn ? (
            <>
              <button className="menuBtn" onClick={handleLogout}>
                Logout
              </button>
              <RouterLink to="/cart">
                <button className="menuBtn">
                  <FaShoppingCart />
                  <span className="redBadge">{cart.cartItems.length}</span>
                </button>
              </RouterLink>
            </>
          ) : (
            <button className="menuBtn" onClick={handleLoginClick}>
              Login
            </button>
          )}
          <RouterLink to="/rendermenu">
            <button className="menuBtn">OUR MENU</button>
          </RouterLink>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
      <div className="cart-container">
        <h2>Your Cart</h2>
        {cart.cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your Cart is currently Empty</p>
            <div className="start-shopping">
              <RouterLink to="/rendermenu">
                <span>
                  <FaArrowLeft /> Start Shopping
                </span>
              </RouterLink>
            </div>
          </div>
        ) : (
          <>
            {!isLoggedIn && (
              <div className="login-prompt">
                <p style={{alignContent: "center"}}>Please login to add items to your cart.</p>
                <RouterLink to="/login">Login Here</RouterLink>
              </div>
            )}
            {isLoggedIn && (
              <div>
                <div className="titles">
                  <h3 className="product-tile">Dishes</h3>
                  <h3 className="price">Price</h3>
                  <h3 className="Quantity">Quantity</h3>
                  <h3 className="total">Total</h3>
                </div>
                <div className="cart-items">
                  {cart.cartItems?.map((cartItem) => (
                    <div className="cart-item" key={cartItem._id}>
                      <div className="cart-product">
                        <img src={cartItem.imageUrl} alt={cartItem.dishName} />
                        <div>
                          <h3>{cartItem.dishName}</h3>
                          <button
                            onClick={() => handleRemovefromCart(cartItem)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="cart-product-rice">${cartItem.price}</div>
                      <div className="cart-product-quantity">
                        <button onClick={() => handleDecreaseCart(cartItem)}>
                          -
                        </button>
                        <div className="count">
                          {cartItem.quantity} {/* Display quantity here */}
                        </div>
                        <button onClick={() => handleIncreaseCart(cartItem)}>
                          +
                        </button>
                      </div>
                      <div className="cart-product-total-price">
                        ${cartItem.price * cartItem.quantity}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <button className="clear-cart" onClick={handleClearCart}>
                    Clear Cart
                  </button>
                  <div className="cart-checkout">
                    <div className="subtotal">
                      <span>Subtotal</span>
                      <span className="amount">${cart.cartTotalAmount}</span>
                    </div>
                    <p>Taxes and Shipping are Calculated to Checkout</p>
                    <RouterLink to="/adress">
                      <button>Checkout</button>
                    </RouterLink>
                    <RouterLink to="/rendermenu">
                      <span>
                        <FaArrowLeft /> Start Shopping
                      </span>
                    </RouterLink>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
