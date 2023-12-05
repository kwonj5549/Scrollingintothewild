import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';



const App = () => {
    const mainTextRef = React.useRef(null);
  useEffect(() => {
    const handleWheel = (event) => {
      // Move up when scrolling down, and vice versa
      gsap.to(mainTextRef.current, {
        y: "-=100", // Adjust this value to control the speed of the movement
        ease: "none",
      });
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);


  return (
      <div className="App">
        <div className="main-text" ref={mainTextRef}>
          <p>Scrolling Into the Wild</p>
        </div>
        <div className="road"></div>
      </div>
  );
}

export default App;
