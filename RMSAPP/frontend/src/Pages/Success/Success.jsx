import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";


const Success = () => {
  const [countdown, setCountdown] = useState(10);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setCountdown((preCount) => {
        if (preCount === 1) {
          clearInterval(timeoutId);
          navigate("/");
        }
        return preCount - 1;
      });
    }, 1000);
    return () => clearInterval(timeoutId);
  }, [navigate]);

  useEffect(() => {
    // Check if the order was successfully completed
    const orderStatusKeys = Object.keys(localStorage);
    const orderStatusKey = orderStatusKeys.find(key => key.startsWith("orderStatus_"));
    if (orderStatusKey) {
      const orderStatus = localStorage.getItem(orderStatusKey);
      if (orderStatus === "completed") {
        // Set redirecting state to true
        setRedirecting(true);
      }
    }
  }, []);

  // Redirect if redirecting state is true
  useEffect(() => {
    if (redirecting) {
      navigate("/order-success");
    }
  }, [redirecting, navigate]);

  // Render different content based on redirecting state
  return redirecting ? (
    <p>Redirecting...</p>
  ) : (
    <section className="notFound">
      <div className="container">
        <img src="/sandwich.png" alt="success" />
        <h1>Redirecting to Home in {countdown} seconds...</h1>
        <Link to={"/"}>
          Back to Home <HiOutlineArrowNarrowRight />
        </Link>
      </div>
    </section>
  );
};

export default Success;
