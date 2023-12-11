import React, {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import './App.css';
import carImage from './assets/car.png';
import backgroundImage from './assets/background.png';
import mileMarker0 from './assets/mile0.png';
import mileSign from './assets/distance_state_sign.png';
// import textDisplay1 from './assets/text_display.png';
import GoogleMapComponent from './GoogleMapComponent';
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
    const [textStyle, setTextStyle] = useState({ fontSize: '2.4rem', lineHeight: '1.6rem' });
    const [displaySize, setDisplaySize] = useState({ width: '40vw', height: '30vh' });
    const [movementThreshold, setMovementThreshold] = useState('34');
    const textDisplayYRef= useRef(0);
    const [scrollMultiplier, setScrollMultiplier] = useState(1);
    const [scrollMiles, setScrollMiles] = useState(0);
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
        console.log(miles)
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
        setTextStyle({
            fontSize: currentKeyPoint.textSize || '2.4rem',
            lineHeight: currentKeyPoint.textSpacing || '1.6rem'
        });
        setDisplaySize(currentKeyPoint.displaySize || {width: '40vw', height: '30vh'});
        setMovementThreshold(currentKeyPoint.movementThreshold || '30');
        const displayThreshold = window.innerHeight * (movementThreshold / 100) / animationMultiplier + currentKeyPoint.start;
        const offset = currentMiles - currentKeyPoint.end;

        if (currentMiles <= displayThreshold) {
            animateTextDisplay1(currentMiles - currentKeyPoint.start);
            textDisplayYRef.current = (currentMiles - currentKeyPoint.start);
        } else if (currentMiles > displayThreshold) {
            animateTextDisplay1(displayThreshold - currentKeyPoint.start);
            textDisplayYRef.current = (displayThreshold - currentKeyPoint.start);
        } else if (currentMiles > currentKeyPoint.end) {

            const newYPosition = (displayThreshold - currentKeyPoint.start) - offset / 4;
            animateTextDisplay1(newYPosition);
        }
    } else {
        if(textDisplayYRef.current > 0) {
            const newYPosition = textDisplayYRef.current-0.4;
            if(newYPosition < 0) {
            console.log(newYPosition)
                animateTextDisplay1(0);
                textDisplayYRef.current = 0;
            }
                else
                {
                    animateTextDisplay1(newYPosition);
                    textDisplayYRef.current = textDisplayYRef.current - 0.4;
                }
        }
    }

    };


    const displayKeyPoints = [
        {
            start: 10,
            end: 80,
            text: "Chris McCandless begins his journey in Atlanta after he graduates from Emory University. He\n" +
                "                        donates $25000 to Oxfam and loads up his car to start his new journey venturing into the wild to\n" +
                "                        find a new sense of identity.",
            date: "July 1990",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.5vh",
            displaySize: { width: '40vw', height: '35vh' },
            movementThreshold: '39',
        },
        {
            start: 120,
            end: 150,
            text: "So why did McCandless embark on this fateful journey?",
            date: "",
            textSize: "4vh", // Example text size
            textSpacing: "4vh",
            displaySize: { width: '40vw', height: '17vh' },
            movementThreshold: '24',
        },
        {
            start: 190,
            end: 300,
            text: "I believe McCandless embarked on this journey to escape from the societal pressures and materialism he perceived in his life and upbringing particularly his parents, which contributed to his desire to seek independence and a new identity in the wild. His odyssey was as much about finding himself as it was about challenging his limits and shedding what he considered the unnecessary burdens of modern life.\n",
            date: "",
            textSize: "2.8vh", // Example text size
            textSpacing: "2.5vh",
            displaySize: { width: '40vw', height: '33vh' },
            movementThreshold: '37',
        },
        {start: 360, end: 400, text: "When I started making this, I didn't realize that how long his journey was. So this might take a while", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.5vh",
            displaySize: { width: '35vw', height: '20vh' },
            movementThreshold: '24',},

        {start: 760, end: 800, text: "McCandless reaches Dallas, Texas and gets his money stolen while sleeping in the car", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.5vh",
            displaySize: { width: '35vw', height: '20vh' },
            movementThreshold: '24',
        },
        {start: 983, end: 1050, text: "McCandless takes a quick stop in Houston, Texas where he buries his money", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.5vh",
            displaySize: { width: '35vw', height: '20vh' },
            movementThreshold: '24',
        },
        {start: 2439, end: 2539, text: "McCandless arrives at the Detrital Wash near Lake Mead.",
            date: "July 6, 1990",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: { width: '40vw', height: '20vh' },
            movementThreshold: '24',
        },
        {start: 2565, end: 2595, text: "A sudden flash flood makes him unable to start his car and he is forced to abandon it. He starts to walk on foot.",
            date: "July 10, 1990",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: { width: '40vw', height: '25vh' },
            movementThreshold: '29',
        },
        {start: 2615, end: 2655, text: "Shortly after the incident, he burns all his money. I feel that this symbolizes not only his rejection of materialism but also shows his full commitment to his journey.", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: { width: '40vw', height: '24vh' },
            movementThreshold: '28',
        },

        {start: 2690, end: 2750, text: "McCandless hitchhikes through Nevada all the way to Lake Tahoe", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: { width: '40vw', height: '16vh' },
            movementThreshold: '20',
        },

        {start: 2970, end: 3010, text: "McCandless arrives at Lake Tahoe.", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: { width: '35vw', height: '13vh' },
            movementThreshold: '17',
        },
        {start: 3050, end: 3090, text: "McCandless gets picked up by a man named Crazy Ernie who invited him to work on his rundown ranch. However, after 11 days, he realizes that Crazy Ernie will not pay him and continues on his journey. I found it very interesting how earlier he burned his money but now he is trying to get money.", date: "",
            textSize: "3vh", // Example text size
            textSpacing: "2.8vh",
            displaySize: { width: '40vw', height: '30vh' },
            movementThreshold: '34',
        },
        {start: 3345, end: 3400, text: "McCandless arrives at Orick, CA where met Jan Burres and her boyfriend Bob. This encounter was significant, with Jan developing a maternal affection for the adventurous McCandless. They exchanged stories and ideals about freedom and exploration, and Jan and Bob provided him with essential supplies for his travels. This meaningful connection was maintained through postcards and letters, highlighting McCandless's ability to form lasting relationships and his reliance on the kindness of others during his journey. ", date: "",
            textSize: "3vh", // Example text size
            textSpacing: "2.8vh",
            displaySize: { width: '45vw', height: '40vh' },
            movementThreshold: '44',
        },
        {start: 3741, end: 3765, text: "Quick Stop in Astoria, Oregon", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: { width: '40vw', height: '13vh' },
            movementThreshold: '17',
        },
        {start: 3891, end: 3915, text: "Quick Stop in Port Angeles, WA", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: { width: '40vw', height: '13vh' },
            movementThreshold: '17',
        },
        {start: 4499, end: 4550, text: "McCandless arrives at Cut Bank, MT where he meets Wayne Westerberg. Westerberg, who owned a grain elevator in Carthage, South Dakota, offered McCandless both employment and a place to stay, providing him with much-needed respite and stability during his travels. Their friendship became a significant part of McCandless's story, with Westerberg understanding and respecting his quest for freedom and adventure. This connection continued throughout McCandless's journey, as they kept in touch and McCandless periodically returned to work for Westerberg. This relationship offered McCandless not just practical support but also emotional support, highlighting the depth and impact of his interactions during his travels.. ", date: "",
            textSize: "2.9vh", // Example text size
            textSpacing: "2.8vh",
            displaySize: { width: '45vw', height: '42vh' },
            movementThreshold: '46',
        },
        {start: 5315, end: 5350, text: "McCandless returned to South Dakota with Wayne, where he spent several months working at Wayne's grain elevator. Wayne recalled Chris as an exceptionally hardworking individual, notable for his refusal to accept payment for his labor. Chris remained there until September, at which point he chose to leave in search of warmer climates.", date: "",
            textSize: "3vh", // Example text size
            textSpacing: "3vh",
            displaySize: { width: '40vw', height: '33vh' },
            movementThreshold: '37',
        },
        {start: 5400, end: 5450, text: "Chris hitches a ride with a trucker all the way to Needles, CA.", date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: { width: '40vw', height: '15vh' },
            movementThreshold: '19',
        },
        {start: 6895, end: 6930, text: "Chris arrives in Needles, CA. and he hikes 12 miles to Topcock, AZ. There he finds a aluminum canoe and purchases it.", date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: { width: '40vw', height: '20vh' },
            movementThreshold: '24',
        },
        {start: 6960, end: 7010, text: "Chris paddles down the Colorado River.", date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: { width: '40vw', height: '15vh' },
            movementThreshold: '19',
        },
        {start: 7100, end: 7140, text: "Finally he reaches and crosses the border into Mexico.", date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: { width: '40vw', height: '15vh' },
            movementThreshold: '19',
        },
        {start: 7180, end: 7220, text: "Unfortunately, after reaching the Mexican Border, the Colorado river diverts into a vast network of canals used for irrigation. Chris spends days and days trying to navigate the narrow waterways but finds himself going in circles. Luckily, he runs into a couple of duck hunters who explain that the canals do not actually reach the gulf. They offer him a ride to a small coastal town called El Golfo De Santa Clara. From there, he paddles back north and hitches to the border.", date: "",
            textSize: "3vh", // Example text size
            textSpacing: "3vh",
            displaySize: { width: '45vw', height: '40vh' },
            movementThreshold: '44',
        },
        {start: 7367, end: 7410, text: "As Chris tries to cross the border back into the US, he gets caught by border patrol he is kept in custody for 1 day before being released without his gun.", date: "",
            textSize: "4vh", // Example text size
            textSpacing: "3vh",
            displaySize: { width: '45vw', height: '24vh' },
            movementThreshold: '28',
        },
        {start: 7517, end: 7570, text: "After arriving in Los Angeles, California, with the intention of finding a job and obtaining an ID, Chris McCandless soon felt overwhelmed and alienated by the societal norms and the bustling urban environment. This experience quickly led him to abandon his initial plan. Feeling out of place in the structured and crowded setting of the city, he returned to the road, resuming his journey of exploration and solitude.", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3vh",
            displaySize: { width: '45vw', height: '40vh' },
            movementThreshold: '44',
        },
        {start: 7517, end: 7570, text: "After arriving in Los Angeles, California, with the intention of finding a job and obtaining an ID, Chris McCandless soon felt overwhelmed and alienated by the societal norms and the bustling urban environment. This experience quickly led him to abandon his initial plan. Feeling out of place in the structured and crowded setting of the city, he returned to the road, resuming his journey of exploration and solitude.", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3vh",
            displaySize: { width: '45vw', height: '40vh' },
            movementThreshold: '44',
        },
    ];
    const handleWheel = (event) => {
        event.preventDefault();
        // if (animationMilesCurrent.current >= 1000 && animationMilesCurrent.current <= 2000) {
        //     setScrollMultiplier(2);
        // } else {
        //     setScrollMultiplier(2);
        // }
        const scrollIncrement = Math.min(Math.max(event.deltaY, -1), 1)* scrollMultiplier;

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
        }else if (miles> 2539 && miles <= 3008) {
            setcurrentState("Nevada");

        }else if (miles> 3008 && miles <= 3411) {
        setcurrentState("California");

    }
        else if(miles> 3411 && miles <= 3742) {
            setcurrentState("Oregon");
        }else if(miles> 3742 && miles <= 4266) {
            setcurrentState("Washington");
        }else if(miles> 4266 && miles <= 4316) {
            setcurrentState("Idaho");
        }else if(miles> 4316 && miles <= 4873) {
            setcurrentState("Montana");
        }else if(miles> 4873 && miles <= 5135) {
            setcurrentState("North Dakota");
        }else if (miles> 5135 && miles <= 5458) {
            setcurrentState("South Dakota");
        }else if (miles> 5458 && miles <= 5590) {
            setcurrentState("Iowa");
        }else if (miles> 5590 && miles <= 5640) {
            setcurrentState("Missouri");
        }else if (miles> 5640 && miles <= 6060) {
            setcurrentState("Kansas");
        }else if (miles> 6060 && miles <= 6447) {
            setcurrentState("Colorado");
        }else if (miles> 6447 && miles <= 6620) {
            setcurrentState("Utah");
        }else if (miles> 6620 && miles <= 7101) {
            setcurrentState("Arizona");
        }else if (miles> 7101 && miles <= 7367) {
            setcurrentState("Mexico");
        }else if (miles> 7367 && miles <= 7477) {
            setcurrentState("California");
        }else if (miles> 7477 && miles <= 7580) {
            setcurrentState("Arizona");
        }else if (miles> 7580 && miles <= 7637) {
            setcurrentState("Nevada");
        }else if (miles> 7637 && miles <= 7724) {
            setcurrentState("Arizona");
        }else if (miles> 7724 && miles <= 8124) {
            setcurrentState("California");
        }else if (miles> 8124 && miles <= 8400) {
            setcurrentState("Arizona");
        }else if (miles> 8400 && miles <= 8577) {
            setcurrentState("Utah");
        }else if (miles> 8577 && miles <= 8965) {
            setcurrentState("Colorado");
        }else if (miles> 8965 && miles <= 9379) {
            setcurrentState("Kansas");
        }else if (miles> 9379 && miles <= 9434) {
            setcurrentState("Missouri");
        }else if (miles> 9434 && miles <= 9597) {
            setcurrentState("Iowa");
        }else if (miles> 9597 && miles <= 9888) {
            setcurrentState("South Dakota");
        }else if (miles> 9888 && miles <= 10150) {
            setcurrentState("North Dakota");
        }else if (miles> 10150 && miles <= 10745) {
            setcurrentState("Montana");
        }else if (miles> 10745 && miles <= 12226) {
            setcurrentState("Canada");
        }else if (miles> 12226 && miles <= 12524) {
            setcurrentState("Alaska");
        }
    }, [miles]); // This useEffect will run every time 'miles' changes
    useEffect(() => {


        window.addEventListener("wheel", handleWheel, {passive: false});

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };

    }, );
    const adjustedTop = `-${parseInt(displaySize.height, 10) + 1}vh`;
    return (
        <div className="App" style={{backgroundImage: `url(${backgroundImage})`}}>
            <GoogleMapComponent miles={miles} />
            <div className="main-text" ref={mainTextRef}>
                <p>Scrolling Into the Wild</p>

            </div>

            <div className="mile-sign-container" ref={mileSignRef}>
                <img id='mile-sign-counter' src={mileSign} alt="Mile Sign"/>
                <div className="mile-sign-text">
                    <p>Distance Traveled: </p>
                    <div className="" style={{fontSize:'4.5vh'}}>
                        <p>{miles} miles</p>
                    </div>
                    <p>Current State: </p>
                    <div className="" style={{fontSize:'4.5vh'}}>
                        <p>{currentState}</p>
                    </div>
                </div>
            </div>

            <div className="text-display-container" ref={textDisplay1Ref} style={{
                top: adjustedTop,
                width: displaySize.width,
                height: displaySize.height,

            }}>
                {/*<img  id="text-display-1" alt="Text Display 1" style={{ width: '100%', height: '100%' }}/>*/}
                <div className="date-text" style={{fontSize: '5vh', paddingBottom:'2px'}}>
                    <p>{displayDate}</p>
                </div>
                <div className="display-text" style={{ fontSize: textStyle.fontSize, lineHeight: textStyle.lineHeight }}>

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