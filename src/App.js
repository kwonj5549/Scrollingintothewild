import React, {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import './App.css';
import carImage from './assets/car.png';
import backgroundImage from './assets/background.png';
import mileMarker0 from './assets/mile0.png';
import mileSign from './assets/distance_state_sign.png';
import textDisplay1 from './assets/text_display.png';

const App = () => {
    const mainTextRef = useRef(null);
    const carRef = useRef(null);
    const stripesRef = useRef(null);
    const animationCurrent = useRef(0);

    const mileMarker0Ref = useRef(null);
    const mileSignRef = useRef(null);
    const [miles, setMiles] = useState(0);
    const animationMilesCurrent = useRef(0);
    const animationMultiplier = 100;
    const textDisplay1Ref = useRef(null);
    const [currentState, setcurrentState] = useState("Georgia");
    const animateText = (y) => {
        gsap.to(mainTextRef.current, {
            y: -y * animationMultiplier,
            ease: "none",
        });
    };

    const animateCar = (x) => {
        gsap.to(carRef.current, {
            x: x * animationMultiplier,
            ease: "none",
        });
    };
    const animateMileMarker0 = (x) => {
        gsap.to(mileMarker0Ref.current, {
            x: -x * animationMultiplier,
            ease: "none",
        });
    }
    const animateStripes = (x) => {
        gsap.to(stripesRef.current, {
            backgroundPosition: `${-x * animationMultiplier}px 0`,
            ease: "none",
        });
    };
    const animateMileSign = (y) => {
        gsap.to(mileSignRef.current, {
            y: animationMultiplier * y,
            ease: "none",

        });


    }
    const animateMileSignText = (y) => {
        // Calculate miles based on the scroll amount
        setMiles(Math.floor(y));
    }
    const animateTextDisplay1 = (y) => {
        gsap.to(textDisplay1Ref.current, {
            y: animationMultiplier * y,
            ease: "none",

        });
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
            const extraScroll = (animationCurrent.current - carMoveThreshold);
            animateStripes(extraScroll);
            animateMileMarker0(extraScroll);
            animationMilesCurrent.current += scrollIncrement;
            animateMileSignText(extraScroll);
        }

        const mileSignThreshold = window.innerHeight * 0.32 / animationMultiplier;
        if (animationCurrent.current < mileSignThreshold) {
            animateMileSign(animationCurrent.current);
        }
        else {
            animateMileSign(mileSignThreshold); // Adjusting mile sign's final position
        }
        const textDisplay1Start= 10;
        const textDisplay1End= 60;
        const textDisplayThreshold1 = window.innerHeight* 0.39 / animationMultiplier+textDisplay1Start;
        if (animationCurrent.current >= textDisplay1Start && animationCurrent.current <= textDisplay1End) {

            if (animationCurrent.current <= textDisplayThreshold1) {
                // Move text display down until it reaches the movement threshold
                animateTextDisplay1(animationCurrent.current - textDisplay1Start);

            } else if (animationCurrent.current > textDisplayThreshold1) {
                // Keep the text display stationary once it reaches the movement threshold
                animateTextDisplay1(textDisplayThreshold1 - textDisplay1Start);

            }
        } else if (animationCurrent.current > textDisplay1End) {
            // Calculate the offset for moving the text display back up
            const offset = animationCurrent.current - textDisplay1End;
            // Ensure the text display moves back up and off the screen
            const newYPosition = (textDisplayThreshold1 - textDisplay1Start) - offset/4;
            animateTextDisplay1(newYPosition);
        }else{
            animateTextDisplay1(0);
        }

    };
    useEffect(() => {


        window.addEventListener("wheel", handleWheel, {passive: false});

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    return (
        <div className="App" style={{backgroundImage: `url(${backgroundImage})`}}>
            <div className="main-text" ref={mainTextRef}>
                <p>Scrolling Into the Wild</p>
            </div>

            <div className="mile-sign-container" ref={mileSignRef}>
                <img id='mile-sign-counter' src={mileSign} alt="Mile Sign"/>
                <div className="mile-sign-text">
                    <p>Distance Traveled: </p>
                    <div className="text-5xl">
                    <p>{miles} miles</p>
                    </div>
                    <p>Current State: </p>
                    <div className="text-5xl">
                    <p>{currentState}</p>
                    </div>
                </div>
            </div>

            <div className="text-display-container" ref={textDisplay1Ref}>
                <img src={textDisplay1} id="text-display-1" alt="Text Display 1"/>
                <div className="display-text">
                    <div className="text-5xl">
                    <p>June 1, 1990</p>
                        </div>
                    <p>Chris McCandless begins his journey in Atlanta after he graduates from Emory University. He donates $25000 to Oxfam and loads up his car to start his new journey venturing into the wild to find a new sense of identity.</p>
                </div>

            </div>






            <div id="grass">
                <img src={mileMarker0} alt="Mile Marker 0" id="mile-marker-0" ref={mileMarker0Ref}/>
            </div>

            <div id="road">
                <div id="stripes" ref={stripesRef}></div>
                <img src={carImage} alt="Chris's Car" id="car" ref={carRef}/>
            </div>
        </div>
    );
}

export default App;