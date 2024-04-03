import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="order-success-container">
      <img src="transparentcheck.png" alt="Checkmark" className="checkmark-gif" />
      <h2>Your order has been placed successfully!</h2>
      <Link to="/">
        <button className="continue-shopping-btn">Continue Shopping</button>
      </Link>
    </div>
  );
};

export default OrderSuccess;
