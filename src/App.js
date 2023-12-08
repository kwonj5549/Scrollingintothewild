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
    const [displayText, setDisplayText] = useState("");
    const [displayDate, setDisplayDate] = useState("");

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
        animationMilesCurrent.current = Math.floor(y);
        setMiles(Math.floor(y));
    }
    const animateTextDisplay1 = (y) => {
        gsap.to(textDisplay1Ref.current, {
            y: animationMultiplier * y,
            ease: "none",

        });
    }
    const handleDisplaySign = (currentMiles) => {
        let shouldDisplay = false;
        let currentKeyPoint = null;

        for (let keyPoint of displayKeyPoints) {
            if (currentMiles >= keyPoint.start && currentMiles <= keyPoint.end) {
                shouldDisplay = true;
                currentKeyPoint = keyPoint;
                break;
            }
        }

        if (shouldDisplay && currentKeyPoint) {
            setDisplayText(currentKeyPoint.text);
            setDisplayDate(currentKeyPoint.date); // Set the display date
            const displayThreshold = window.innerHeight * 0.39 / animationMultiplier + currentKeyPoint.start;
            const offset = currentMiles - currentKeyPoint.end;

            if (currentMiles <= displayThreshold) {
                animateTextDisplay1(currentMiles - currentKeyPoint.start);
            } else if (currentMiles > displayThreshold) {
                animateTextDisplay1(displayThreshold - currentKeyPoint.start);
            } else if (currentMiles > currentKeyPoint.end) {
                const newYPosition = (displayThreshold - currentKeyPoint.start) - offset / 4;
                animateTextDisplay1(newYPosition);
            }
        } else {
            animateTextDisplay1(0);
        }
    };


    const displayKeyPoints = [
        {
            start: 10,
            end: 60,
            text: "Chris McCandless begins his journey in Atlanta after he graduates from Emory University. He\n" +
                "                        donates $25000 to Oxfam and loads up his car to start his new journey venturing into the wild to\n" +
                "                        find a new sense of identity.",
            date: "June 1, 1990"
        },
        {
            start: 100,
            end: 150,
            text: "I believe McCandless embarked on this journey to escape from the societal pressures and materialism he perceived in his life and upbringing particularly his parents, which contributed to his desire to seek independence and a new identity in the wild. Krakauer's \"Into the Wild\" suggests that McCandless was motivated by a mix of youthful idealism, a quest for raw, unfiltered experiences, and the influence of transcendentalist literature. His odyssey was as much about finding himself as it was about challenging his limits and shedding what he considered the unnecessary burdens of modern life.\n",
            date: ""
        },
        {start: 200, end: 250, text: "Third milestone text", date: "August 15, 1990"},
        // ... more key points
    ];
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
            // animationMilesCurrent.current += scrollIncrement;
            animateMileSignText(extraScroll);
        }

        const mileSignThreshold = window.innerHeight * 0.32 / animationMultiplier;
        if (animationCurrent.current < mileSignThreshold) {
            animateMileSign(animationCurrent.current);
        } else {
            animateMileSign(mileSignThreshold); // Adjusting mile sign's final position
        }


        handleDisplaySign(animationMilesCurrent.current);


    };
    useEffect(() => {
        if (miles > 0 && miles <= 61) {
            setcurrentState("Georgia");
        } else if (miles > 60 && miles <= 260) {
            setcurrentState("Alabama");
        } else if (miles > 260 && miles <= 437) {
            setcurrentState("Mississippi");
        } else if (miles > 437 && miles <= 596) {
            setcurrentState("Louisiana");
        } else if (miles > 596 && miles <= 1830) {
            setcurrentState("Texas");
        } else if (miles > 1830 && miles <= 1985) {
            setcurrentState("New Mexico");
        } else if (miles > 1985 && miles <= 2539) {
            setcurrentState("Arizona");
        }
    }, [miles]); // This useEffect will run every time 'miles' changes
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
                        <p>{displayDate}</p>
                    </div>
                    {/* Display the date */}
                    <p>{displayText}</p> {/* Display the text */}
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