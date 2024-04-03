import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { useGetAllDishesQuery } from "../features/dishesapi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateProductQuantity } from "../features/cartSlice"; // Import updateCartQuantity thunk action

const RenderMenu = () => {
  const { data, error, isLoading } = useGetAllDishesQuery();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0); // State to keep track of total quantity
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartTotalQuantity = useSelector((state) => state.cart.cartTotalQuantity); // Get total quantity from Redux store

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    // Update total quantity when it changes in Redux store
    setTotalQuantity(cartTotalQuantity);
  }, [cartTotalQuantity]);

  const handleAddToCart = (dish) => {
    dispatch(addToCart(dish)); // Dispatch addToCart action
    dispatch(updateProductQuantity({ dishId: dish._id, quantity: 1 })); // Dispatch updateCartQuantity action with quantity 1
    navigate('/cart');
  };

  return (
    <>
      <nav>
        <div className="logo">Fun&Feast</div>
        <div className="navLinks">
          {isLoggedIn && (
            <RouterLink to="/cart">
              <button className="menuBtn">
                <FaShoppingCart /> 
                <span className="redBadge">{totalQuantity}</span>
              </button>
            </RouterLink>
          )}
        </div>
        <div className="hamburger">
          <GiHamburgerMenu />
        </div>
      </nav>

      <div className="home-container">
        {isLoading ? (
          <p>Loading....</p>
        ) : error ? (
          <p>An error occurred: {error.data}....</p>
        ) : (
          <>
            <h2>Delicious Offerings</h2>
            <div className="products">
              {data.dishes.map((dish) => (
                <div key={dish._id} className="product">
                  <h3>{dish.dishName}</h3>
                  <img src={dish.imageUrl} alt={dish.dishName} />
                  <div className="details">
                    {/* <span>{dish.description}</span> */}
                    <span className="price">${dish.price}</span>
                  </div>
                  <button onClick={() => handleAddToCart(dish)}>
                    Add To Cart
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RenderMenu;
