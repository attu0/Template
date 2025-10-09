import React from "react";
import "./Hero.css";
import mudraImg from "../assets/real.png";

function Hero() {
  return (
    <div className="hero-wrapper">
      <div className="hero-container d-flex flex-column justify-content-center align-items-center vh-100">
        <img src={mudraImg} alt="Logo" className="img-fluid hero-img mb-4" />
      </div>
    </div>
  );
}

export default Hero;
