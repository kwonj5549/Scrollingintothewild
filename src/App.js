import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './App.css';
import carImage from './assets/car.png';
import backgroundImage from './assets/background.png';

const App = () => {
    const mainTextRef = useRef(null);
    const carRef = useRef(null);
    const stripesRef = useRef(null);
    const animationCurrent = useRef(0);

    const animateText = (y) => {
        gsap.to(mainTextRef.current, {
            y: -y,
            ease: "none",
        });
    };

    const animateCar = (x) => {
        gsap.to(carRef.current, {
            x: x,
            ease: "none",
        });
    };

    const animateStripes = (x) => {
        gsap.to(stripesRef.current, {
            backgroundPosition: `${-x}px 0`,
            ease: "none",
        });
    };

    useEffect(() => {
        const handleWheel = (event) => {
            // Prevent the default scroll behavior
            event.preventDefault();

            // Update the current animation value
            animationCurrent.current += event.deltaY;
            // Clamp the value to not go below 0
            if (animationCurrent.current < 0) {
                animationCurrent.current = 0;
            }

            // Invoke animation functions
            animateText(animationCurrent.current);

            if (animationCurrent.current < window.innerWidth * 0.40) {
                // The car should only move to a maximum of 40% of the viewport width
                animateCar(animationCurrent.current);
            } else {
                // Once the car stops, start moving the stripes
                animateStripes(animationCurrent.current - (window.innerWidth * 0.40));
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    return (
        <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="main-text" ref={mainTextRef}>
                <p>Scrolling Into the Wild</p>
            </div>
            <div id="grass"></div>
            <div id="road">
                <div id="stripes" ref={stripesRef}></div>
                <img src={carImage} alt="Chris's Car" id="car" ref={carRef}/>
            </div>
        </div>
    );
}

export default App;