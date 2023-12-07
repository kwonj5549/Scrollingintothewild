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
    const animationPrevious = useRef(0);
    const mileMarker0Ref = useRef(null);
    const mileSignRef = useRef(null);
    const [miles, setMiles] = useState(0);
    const animationMiles = useRef(0);
    const animationMultiplier = 15;
    const animateText = (y) => {
        gsap.to(mainTextRef.current, {
            y: -y*animationMultiplier,
            ease: "none",
        });
    };

    const animateCar = (x) => {
        gsap.to(carRef.current, {
            x: x*animationMultiplier,
            ease: "none",
        });
    };
    const animateMileMarker0 = (x) => {
        gsap.to(mileMarker0Ref.current, {
            x: -x*animationMultiplier,
            ease: "none",
        });
    }
    const animateStripes = (x) => {
        gsap.to(stripesRef.current, {
            backgroundPosition: `${-x*animationMultiplier}px 0`,
            ease: "none",
        });
    };
    const animateMileSign = (y) => {
        gsap.to(mileSignRef.current, {
            y: animationMultiplier*y,
            ease: "none",

        });


    }
    const animateMileSignText= (y) => {
        // Calculate miles based on the scroll amount
        setMiles(Math.floor(y));
    }
    const handleWheel = (event) => {
        event.preventDefault();

        const normalizedDeltaY = Math.min(Math.max(event.deltaY, -1), 1);
        const scrollIncrement = normalizedDeltaY;

        animationCurrent.current += scrollIncrement;

        if (animationCurrent.current < 0) {
            animationCurrent.current = 0;
        }

        const carMoveThreshold = window.innerWidth * 0.40 / animationMultiplier;
        animateText(animationCurrent.current);

        if (animationCurrent.current < carMoveThreshold) {
            animateCar(animationCurrent.current);
            animateMileSignText(0);
        } else {
            animateCar(carMoveThreshold); // Adjusting car's final position
            const extraScroll = (animationCurrent.current - carMoveThreshold) ;
            animateStripes(extraScroll);
            animateMileMarker0(extraScroll);
            animationMiles.current += scrollIncrement;
            animateMileSignText(extraScroll);
        }

        const mileSignThreshold = window.innerWidth * 0.12 / animationMultiplier;
        if (animationCurrent.current < mileSignThreshold) {
            animateMileSign(animationCurrent.current);
        } else {
            animateMileSign(mileSignThreshold); // Adjusting mile sign's final position
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