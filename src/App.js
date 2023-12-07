import React, { useEffect, useRef,useState } from 'react';
import { gsap } from 'gsap';
import './App.css';
import carImage from './assets/car.png';
import backgroundImage from './assets/background.png';
import mileMarker0 from './assets/mile0.png';
import mileSign from './assets/hanging-sign.png';
const App = () => {
    const mainTextRef = useRef(null);
    const carRef = useRef(null);
    const stripesRef = useRef(null);
    const animationCurrent = useRef(0);
    const mileMarker0Ref = useRef(null);
    const mileSignRef = useRef(null);
    const [miles, setMiles] = useState(0);
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
    const animateMileMarker0 = (x) => {
        gsap.to(mileMarker0Ref.current, {
            x: -x,
            ease: "none",
        });
    }
    const animateStripes = (x) => {
        gsap.to(stripesRef.current, {
            backgroundPosition: `${-x}px 0`,
            ease: "none",
        });
    };
    const animateMileSign = (y) => {
        gsap.to(mileSignRef.current, {
            y: y,
            ease: "none",

        });


    }
    const animateMileSignText= (y) => {
        // Calculate miles based on the scroll amount
        setMiles(Math.floor(animationCurrent.current / 50));
    }
    const handleWheel = (event) => {
        // Prevent the default scroll behavior
        event.preventDefault();

        // Update the current animation value
        animationCurrent.current += event.deltaY;
        console.log(event.deltaY)
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
            animateMileMarker0(animationCurrent.current - (window.innerWidth * 0.40));
            animateMileSignText();

        }
        if(animationCurrent.current < 190){
            animateMileSign(animationCurrent.current);
        }

    };
    useEffect(() => {


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
            <div id="grass">
                <img src={mileMarker0} alt="Mile Marker 0" id="mile-marker-0" ref={mileMarker0Ref}/>
            </div>
            <div id="mile-sign" ref={mileSignRef}>
                <img src={mileSign} alt="Mile Sign"/>
            <div className="milesign-text" >
                <p>{miles} miles</p>
            </div>

            </div>


            <div id="road">
                <div id="stripes" ref={stripesRef}></div>
                <img src={carImage} alt="Chris's Car" id="car" ref={carRef}/>
            </div>
        </div>
    );
}

export default App;