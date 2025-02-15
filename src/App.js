import React, {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import './App.css';
import carImage from './assets/car.png';
import backgroundImageSky from './assets/1upscaled4.png';
import backgroundImageMtn from './assets/2upscaled4.png';
import backgroundImageTree from './assets/4upscaled4.png';
import backgroundImageRiv from './assets/3upscaled4.png';
import backgroundImage from './assets/background.png';
import mileMarker0 from './assets/mile0.png';
import mileSign from './assets/distance_state_sign.png';
// import textDisplay1 from './assets/text_display.png';
import GoogleMapComponent from './GoogleMapComponent';
import bus152 from './assets/bus152.png';
const App = () => {
    const mainTextRef = useRef(null);
    const carRef = useRef(null);
    const stripesRef = useRef(null);
    const animationCurrent = useRef(0);
    const MapSignRef = useRef(null);
    const mileMarker0Ref = useRef(null);
    const mileSignRef = useRef(null);
    const [miles, setMiles] = useState(0);
    const animationMilesCurrent = useRef(0);
    const animationMultiplier = 100;
    const textDisplay1Ref = useRef(null);
    const [currentState, setcurrentState] = useState("Georgia");
    const [displayText, setDisplayText] = useState("");
    const [displayDate, setDisplayDate] = useState("");
    const [textStyle, setTextStyle] = useState({fontSize: '2.4rem', lineHeight: '1.6rem'});
    const [displaySize, setDisplaySize] = useState({width: '40vw', height: '30vh'});
    const [movementThreshold, setMovementThreshold] = useState('34');
    const textDisplayYRef = useRef(0);
    const [scrollMultiplier, setScrollMultiplier] = useState(2);
    const [scrollMiles, setScrollMiles] = useState(0);
    const backgroundSkyRef = useRef(null);
    const backgroundMtnRef = useRef(null);
const backgroundRivRef = useRef(null);
    const backgroundTreeRef = useRef(null);
    const busRef = useRef(null);
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
            x: -x * animationMultiplier/3,
            ease: "none",
        });
    }
    // const STRIPE_RESET_THRESHOLD = 2340;
    // const animateStripes = (x) => {
    //     let adjustedX = parseInt(x % STRIPE_RESET_THRESHOLD);
    //     console.log("adjustedX", adjustedX);
    //
    //     gsap.to(stripesRef.current, {
    //         backgroundPosition: `${-adjustedX * animationMultiplier/10}px 0`,
    //         ease: "none",
    //         overwrite: true, // Ensures that any ongoing animation is immediately overwritten
    //         immediateRender: false // Prevents GSAP from rendering an immediate state change
    //     });
    //
    //     if (adjustedX === 0) {
    //         // Force a reset of the position to start if it reaches 0
    //         gsap.set(stripesRef.current, {
    //             backgroundPosition: `0px 0`,
    //             overwrite: true // Ensures this set action takes precedence
    //         });
    //     }
    // };
    const animateStripes = (x) => {
        gsap.to(stripesRef.current, {
            backgroundPosition: `${-x * animationMultiplier/3}px 0`,
            ease: "none",
        });
    };
    const animateMileSign = (y) => {
        gsap.to(mileSignRef.current, {
            y: animationMultiplier * y,
            ease: "none",

        });


    }
    const animateMapSign = (y) => {
        gsap.to(MapSignRef.current, {
            y: animationMultiplier * y,
            ease: "none",

        });
    }
    const animateMileSignText = (y) => {
        // Calculate miles based on the scroll amount
        animationMilesCurrent.current = Math.floor(y);

        setMiles(Math.floor(y));
        // console.log(miles)
    }
    const animateTextDisplay1 = (y) => {
        gsap.to(textDisplay1Ref.current, {
            y: animationMultiplier * y,
            ease: "none",

        });
    }
    const animateBus = (x) => {
        gsap.to(busRef.current, {
            x: -animationMultiplier * x/10,
            ease: "none",

        });
    }
    const animateBackgroundImageSky = (x) => {
        gsap.to(backgroundSkyRef.current, {
            backgroundPositionX: `-${x*animationMultiplier/80}px`, // Move the background to the left
            ease: "none",
        });
    };
    const animateBackgroundImageMtn = (x) => {
        gsap.to(backgroundMtnRef.current, {
            backgroundPositionX: `-${x*animationMultiplier/40}px`, // Move the background to the left
            ease: "none",
        });
    };
    const animateBackgroundImageTree = (x) => {
        gsap.to(backgroundTreeRef.current, {
            backgroundPositionX: `-${x*animationMultiplier/10}px`, // Move the background to the left
            ease: "none",
        });
    };
    const animateBackgroundImageRiv = (x) => {
        gsap.to(backgroundRivRef.current, {
            backgroundPositionX: `-${x*animationMultiplier/8}px`, // Move the background to the left
            ease: "none",
        });
    };
    const animateTextDisplay2 = (y) => {
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
            if (textDisplayYRef.current > 0) {
                const newYPosition = textDisplayYRef.current - 0.4;
                if (newYPosition < 0) {

                    animateTextDisplay1(0);
                    textDisplayYRef.current = 0;
                } else {
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
            displaySize: {width: '40vw', height: '35vh'},
            movementThreshold: '39',
        },
        {
            start: 120,
            end: 160,
            text: "So why did Chris embark on this fateful journey?",
            date: "",
            textSize: "4vh", // Example text size
            textSpacing: "4vh",
            displaySize: {width: '40vw', height: '17vh'},
            movementThreshold: '24',
        },
        {
            start: 190,
            end: 300,
            text: "I believe Chris embarked on this journey to escape from the societal pressures and materialism he perceived in his life and upbringing particularly his parents, which contributed to his desire to seek independence and a new identity in the wild. His odyssey was as much about finding himself as it was about challenging his limits and shedding what he considered the unnecessary burdens of modern life.\n",
            date: "",
            textSize: "2.8vh", // Example text size
            textSpacing: "2.5vh",
            displaySize: {width: '40vw', height: '33vh'},
            movementThreshold: '37',
        },
        {
            start: 360,
            end: 400,
            text: "When I started making this, I didn't realize that how long his journey was. So this might take a while",
            date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.5vh",
            displaySize: {width: '35vw', height: '20vh'},
            movementThreshold: '24',
        },

        {
            start: 770,
            end: 820,
            text: "Chris reaches Dallas, Texas and gets his money stolen while sleeping in the car",
            date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.5vh",
            displaySize: {width: '35vw', height: '20vh'},
            movementThreshold: '24',
        },
        {
            start: 1000,
            end: 1050,
            text: "Chris takes a quick stop in Houston, Texas where he buries his money",
            date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.5vh",
            displaySize: {width: '35vw', height: '20vh'},
            movementThreshold: '24',
        },
        {
            start: 2572, end: 2610, text: "Chris arrives at the Detrital Wash near Lake Mead.",
            date: "July 6, 1990",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: {width: '40vw', height: '20vh'},
            movementThreshold: '24',
        },
        {
            start: 2640,
            end: 2670,
            text: "A sudden flash flood makes him unable to start his car and he is forced to abandon it. He starts to walk on foot.",
            date: "July 10, 1990",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: {width: '40vw', height: '25vh'},
            movementThreshold: '29',
        },
        {
            start: 2700,
            end: 2760,
            text: "Shortly after the incident, he burns all his money. I feel that this symbolizes not only his rejection of materialism but also shows his full commitment to his journey. He also buries some of his belongings and license plate.",
            date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: {width: '40vw', height: '24vh'},
            movementThreshold: '28',
        },

        {
            start: 2790, end: 2820, text: "Chris hitchhikes through Nevada all the way to Lake Tahoe", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: {width: '40vw', height: '16vh'},
            movementThreshold: '20',
        },

        {
            start: 3170, end: 3210, text: "Chris arrives at Lake Tahoe.", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: {width: '35vw', height: '13vh'},
            movementThreshold: '17',
        },
        {
            start: 3250,
            end: 3300,
            text: "Chris gets picked up by a man named Crazy Ernie who invited him to work on his rundown ranch. However, after 11 days, he realizes that Crazy Ernie will not pay him and continues on his journey. I found it very interesting how earlier he burned his money but now he is trying to get money.",
            date: "",
            textSize: "3vh", // Example text size
            textSpacing: "2.8vh",
            displaySize: {width: '40vw', height: '30vh'},
            movementThreshold: '34',
        },
        {
            start: 3375,
            end: 3410,
            text: "McCandless arrives at Red Bluff, CA and he hikes into the Sierra Nevada and spends a week walking north into the Pacific Crest Trail before returning to hitchhiking.",
            date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: {width: '40vw', height: '30vh'},
            movementThreshold: '34',
        },

        {
            start: 3564,
            end: 3615,
            text: "Chris arrives at Orick, CA where met Jan Burres and her boyfriend Bob. This encounter was significant, with Jan developing a maternal affection for the adventurous McCandless. They exchanged stories and ideals about freedom and exploration, and Jan and Bob provided him with essential supplies for his travels. This meaningful connection was maintained through postcards and letters, highlighting Chris's ability to form lasting relationships and his reliance on the kindness of others during his journey. ",
            date: "",
            textSize: "3vh", // Example text size
            textSpacing: "2.8vh",
            displaySize: {width: '45vw', height: '40vh'},
            movementThreshold: '44',
        },
        {
            start: 4087, end: 4117, text: "Quick Stop in Astoria, Oregon", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: {width: '40vw', height: '13vh'},
            movementThreshold: '17',
        },
        {
            start: 4300, end: 4330, text: "Quick Stop in Port Angeles, WA", date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: {width: '40vw', height: '13vh'},
            movementThreshold: '17',
        },
        {
            start: 5140,
            end: 5220,
            text: "Chris arrives at Cut Bank, MT where he meets Wayne Westerberg. Westerberg, who owned a grain elevator in Carthage, South Dakota, offered Chris both employment and a place to stay, providing him with much-needed respite and stability during his travels. Their friendship became a significant part of McCandless's story, with Westerberg understanding and respecting his quest for freedom and adventure. This connection continued throughout Chris's journey, as they kept in touch and Chris periodically returned to work for Westerberg. This relationship offered Chris not just practical support but also emotional support, highlighting the depth and impact of his interactions during his travels. ",
            date: "",
            textSize: "2.9vh", // Example text size
            textSpacing: "2.8vh",
            displaySize: {width: '45vw', height: '42vh'},
            movementThreshold: '46',
        },
        {
            start: 6135,
            end: 6190,
            text: "Chris returned to South Dakota with Wayne, where he spent several months working at Wayne's grain elevator. Wayne recalled Chris as an exceptionally hardworking individual, notable for his refusal to accept payment for his labor. Chris remained there until September, at which point he chose to leave in search of warmer climates.",
            date: "",
            textSize: "3vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '40vw', height: '33vh'},
            movementThreshold: '37',
        },
        {
            start: 5400, end: 5450, text: "Chris hitches a ride with a trucker all the way to Needles, CA.", date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '40vw', height: '15vh'},
            movementThreshold: '19',
        },
        {
            start: 7930,
            end: 7970,
            text: "Chris arrives in Needles, CA. and he hikes 12 miles to Topcock, AZ. There he finds a aluminum canoe and purchases it.",
            date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '40vw', height: '20vh'},
            movementThreshold: '24',
        },
        {
            start: 8000, end: 8070, text: "Chris paddles down the Colorado River.", date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '40vw', height: '15vh'},
            movementThreshold: '19',
        },
        {
            start: 8155, end: 8200, text: "Finally he reaches and crosses the border into Mexico.", date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '40vw', height: '15vh'},
            movementThreshold: '19',
        },
        {
            start: 8240,
            end: 8290,
            text: "Unfortunately, after reaching the Mexican Border, the Colorado river diverts into a vast network of canals used for irrigation. Chris spends days and days trying to navigate the narrow waterways but finds himself going in circles. Luckily, he runs into a couple of duck hunters who explain that the canals do not actually reach the gulf. They offer him a ride to a small coastal town called El Golfo De Santa Clara. From there, he paddles back north and hitches to the border.",
            date: "",
            textSize: "3vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '45vw', height: '40vh'},
            movementThreshold: '44',
        },
        {
            start: 8450,
            end: 8490,
            text: "As Chris tries to cross the border back into the US, he gets caught by border patrol he is kept in custody for 1 day before being released without his gun.",
            date: "",
            textSize: "4vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '45vw', height: '24vh'},
            movementThreshold: '28',
        },
        {
            start: 8604,
            end: 8655,
            text: "After arriving in Los Angeles, California, with the intention of finding a job and obtaining an ID, Chris soon felt overwhelmed and alienated by the societal norms and the bustling urban environment. This experience quickly led him to abandon his initial plan. Feeling out of place in the structured and crowded setting of the city, he returned to the road, resuming his journey of exploration and solitude.",
            date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '45vw', height: '40vh'},
            movementThreshold: '44',
        },
        {
            start: 8930,
            end: 8972,
            text: "Chris makes a quick stop at Detirial Wash to recover some of his buried belongings.",
            date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '40vw', height: '15vh'},
            movementThreshold: '19',
        },
        {
            start: 9010,
            end: 9040,
            text: "Chris arrives in Las Vegas where he works a little while in an italian restaurant before departing. However, not much is known about what Chris did during this time.",
            date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '40vw', height: '24vh'},
            movementThreshold: '28',
        },
        {
            start: 9142,
            end: 9240,
            text: "In Bullhead City, Arizona, Chris McCandless momentarily departed from his wilderness adventures to lead a surprisingly conventional life. He secured employment at a fast-food restaurant, lived in an RV park, and interacted regularly with locals, using his real name for perhaps the first time in his travels. This phase in Bullhead City, marked by a brief foray into normalcy and societal engagement, contrasts sharply with his usual quest for solitude and wilderness exploration. It reflects an intriguing aspect of McCandless's journey, hinting at an inner conflict and a re-evaluation of his ideals about living a non-materialistic, unstructured life. This period in Bullhead City adds a layer of complexity to his character, illustrating his broader exploration of different lifestyles and self-discovery. ",
            date: "",
            textSize: "2.6vh", // Example text size
            textSpacing: "2.5vh",
            displaySize: {width: '40vw', height: '44vh'},
            movementThreshold: '48',
        },
        {
            start: 9350,
            end: 9550,
            text: "In Salton City, Chris McCandless, under the alias \"Alex,\" formed a significant and transformative relationship with Ronald Franz, an 80-year-old man who was deeply impacted by the loss of his family. Their bond was marked by mutual mentorship and companionship, with McCandless sharing his life philosophies and influencing Franz to embrace aspects of minimalism and adventure. This emotional connection was so deep that Franz offered to adopt McCandless, who declined in favor of maintaining his independence. Their parting was impactful, with McCandless advising Franz to pursue a life of travel, leading to a profound change in Franz's lifestyle. This encounter in Salton City highlights the remarkable influence McCandless had on those he met, showcasing his ability to inspire and effect change through his unique perspectives and relationships. Chris gets a ride up to Grand Junction with Franz.",
            date: "",
            textSize: "2.4vh", // Example text size
            textSpacing: "2.5vh",
            displaySize: {width: '40vw', height: '44vh'},
            movementThreshold: '48',
        },
        {
            start: 10045,
            end: 10145,
            text: "Chris and Franz arrive at Grand Junction, Colorado where they part ways. This is unfortunately the last time that Franz sees McCandless.",
            date: "",
            textSize: "3.9vh", // Example text size
            textSpacing: "3vh",
            displaySize: {width: '40vw', height: '24vh'},
            movementThreshold: '28',
        },
        {
            start: 11323,
            end: 11400,
            text: "Chris arrives in Carthage, SD his last stop before he departs for Alaska. He sees Wayne Westerberg for the final time and he works for a little while in the grain elevator before departing on his Alaskan adventure.",
            date: "",
            textSize: "3vh", // Example text size
            textSpacing: "2.5vh",
            displaySize: {width: '40vw', height: '24vh'},
            movementThreshold: '28',
        },
        {
            start: 13541,
            end: 13610,
            text: "Quick Stop in Dawson Creek, BC",
            date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: {width: '40vw', height: '13vh'},
            movementThreshold: '17',
        },
        {
            start: 14000,
            end: 14060,
            text: "A blizzard hits while he's near the Liard River causing him to have to wait it out in a nearby truck station. A trucker named Gaylord Stuckey drives him up to Fairbanks, Alaska.",
            date: "",
            textSize: "3.5vh", // Example text size
            textSpacing: "3.3vh",
            displaySize: {width: '40vw', height: '28vh'},
            movementThreshold: '32',
        },
        {
            start: 15132,
            end: 15170,
            text: "During his time in Alaska, Chris McCandless dedicated three days to intensive research at the University of Fairbanks' library, focusing on edible plants and wildlife in the surrounding areas. Understanding the importance of survival skills in the harsh Alaskan wilderness, he meticulously studied to prepare himself. Additionally, McCandless purchased a .22 caliber rifle, a choice that many would consider underpowered for the challenges of Alaska's rugged terrain and wildlife. In a poignant final act before venturing into the wilderness, he sent his last postcard, not to his family, but to Wayne Westerberg, a friend and confidant he had made during his travels. This series of actions reflects McCandless's commitment to his ideals of independence and living in harmony with nature, even in the face of daunting challenges.",
            date: "",
            textSize: "2.4vh", // Example text size
            textSpacing: "2.5vh",
            displaySize: {width: '44vw', height: '44vh'},
            movementThreshold: '48',
        },
        {
            start: 15200,
            end: 15230,
            text: "Chris begins hiking south along the Alaskan Highway. Along the way, he was picked up by Jim Gallien, who was heading to Anchorage. Gallien gave him a ride to Healy, Alaska, near the start of the Stampede Trail, marking himself as the last person to see McCandless alive. Gallien noted the surprisingly light weight of Chris's backpack for a wilderness survival expedition. He even offered Chris a pair of rubber boots for the journey, which Chris declined, staying true to his minimalistic approach despite the daunting Alaskan wilderness ahead.",
            date: "",
            textSize: "2.4vh", // Example text size
            textSpacing: "2.5vh",
            displaySize: {width: '40vw', height: '40vh'},
            movementThreshold: '44',
        },
        {
            start: 15260,
            end: 15280,
            text: "After Jim Gallien dropped him off near the Stampede Trail in Alaska, Chris McCandless's final journey began, culminating in a tale of adventure and tragedy. He ventured into the wilderness with minimal supplies, intending to survive off the land. McCandless found shelter in an abandoned bus, known as the \"Magic Bus,\" which became his base. Despite his efforts to hunt and forage, he faced severe challenges due to his inadequate gear and the harsh Alaskan environment. A critical mistake occurred when he possibly consumed a poisonous plant, leading to starvation and weakening his condition. His final days were marked by a desperate struggle for survival, as documented in his diary, and he ultimately succumbed to starvation. McCandless's body was later discovered by hunters, and his story sparked widespread debate on wilderness adventure and the pursuit of self-discovery. His journey remains a poignant and controversial narrative about the allure and dangers of the wild.",
            date: "The End of the Journey",
            textSize: "2.4vh", // Example text size
            textSpacing: "2vh",
            displaySize: {width: '44vw', height: '44vh'},
            movementThreshold: '48',
        },
    ];
    const handleKeyPress = (event) => {
        // Check if the right arrow key is pressed
        if (event.keyCode === 39) {
            // Simulate a scroll event
            const simulatedScrollEvent = {
                deltaY: 1 * scrollMultiplier, preventDefault: () => {
                }
            };
            handleWheel(simulatedScrollEvent);
        }
    };

    const handleWheel = (event) => {
        event.preventDefault();
        // if (animationMilesCurrent.current >= 1000 && animationMilesCurrent.current <= 2000) {
        //     setScrollMultiplier(2);
        // } else {
        //     setScrollMultiplier(2);
        // }

        const scrollIncrement = Math.min(Math.max(event.deltaY, -1), 1) * scrollMultiplier;

        // Determine the new potential value for animationCurrent
        let newAnimationCurrent = animationCurrent.current + scrollIncrement;

        // Ensure newAnimationCurrent doesn't exceed the threshold (15267 miles)
        if (newAnimationCurrent > 15267 * 2+8) {
            newAnimationCurrent = 15267 * 2+8;
        }

        // Prevent scrolling below 0
        if (newAnimationCurrent < 0) {
            newAnimationCurrent = 0;
        }

        // Update animationCurrent with the new value
        animationCurrent.current = newAnimationCurrent;



        const carMoveThreshold = window.innerWidth * 0.40 / animationMultiplier;
        animateText(animationCurrent.current);

        if (animationCurrent.current < carMoveThreshold) {
            animateCar(animationCurrent.current);
            animateMileSignText(0);
        } else {
            if(animationCurrent.current<15267 * 2+8) {
                console.log(animationCurrent.current)
                animateCar(carMoveThreshold); // Adjusting car's final position
                const extraScroll = (animationCurrent.current - carMoveThreshold) / 2;
                animateStripes(extraScroll);
                animateMileMarker0(extraScroll);
                // animationMilesCurrent.current += scrollIncrement;
                animateBackgroundImageSky(extraScroll);
                animateMileSignText(extraScroll);
                animateBackgroundImageMtn(extraScroll);
                animateBackgroundImageTree(extraScroll);
                animateBackgroundImageRiv(extraScroll);
            }
        }
        if(animationMilesCurrent.current>15187){
            const extraScroll = animationMilesCurrent.current-15187;
            console.log("extrascroll",extraScroll);
            animateBus(extraScroll);


        }
        const mileSignThreshold = window.innerHeight * 0.32 / animationMultiplier;
        if (animationCurrent.current < mileSignThreshold) {
            animateMileSign(animationCurrent.current);
        } else {
            animateMileSign(mileSignThreshold); // Adjusting mile sign's final position
        }
        const mapSignThreshold = window.innerHeight * 0.38 / animationMultiplier;
        if (animationCurrent.current < mapSignThreshold) {
            animateMapSign(animationCurrent.current);
        } else {
            animateMapSign(mapSignThreshold); // Adjusting mile sign's final position
        }


        handleDisplaySign(animationMilesCurrent.current);


    };
    useEffect(() => {
        if (miles > 0 && miles <= 63) {
            setcurrentState("Georgia");
        } else if (miles > 63 && miles <= 282) {
            setcurrentState("Alabama");
        } else if (miles > 282 && miles <= 437) {
            setcurrentState("Mississippi");
        } else if (miles > 437 && miles <= 618) {
            setcurrentState("Louisiana");
        } else if (miles > 618 && miles <= 1860) {
            setcurrentState("Texas");
        } else if (miles > 1860 && miles <= 2024) {
            setcurrentState("New Mexico");
        } else if (miles > 2024 && miles <= 2589) {
            setcurrentState("Arizona");
        } else if (miles > 2589 && miles <= 3142) {
            setcurrentState("Nevada");
        } else if (miles > 3142 && miles <= 3705) {
            setcurrentState("California");
        } else if (miles > 3705 && miles <= 4093) {
            setcurrentState("Oregon");
        } else if (miles > 4093 && miles <= 4794) {
            setcurrentState("Washington");
        } else if (miles > 4794 && miles <= 4910) {
            setcurrentState("Idaho");
        } else if (miles > 4910 && miles <= 5633) {
            setcurrentState("Montana");
        } else if (miles > 4633 && miles <= 5889) {
            setcurrentState("North Dakota");
        } else if (miles > 5889 && miles <= 6272) {
            setcurrentState("South Dakota");
        } else if (miles > 6272 && miles <= 6443) {
            setcurrentState("Iowa");
        } else if (miles > 6443 && miles <= 6529) {
            setcurrentState("Missouri");
        } else if (miles > 6529 && miles <= 6953) {
            setcurrentState("Kansas");
        } else if (miles > 6953 && miles <= 7403) {
            setcurrentState("Colorado");
        } else if (miles > 7403 && miles <= 7610) {
            setcurrentState("Utah");
        } else if (miles > 7610 && miles <= 8154) {
            setcurrentState("Arizona");
        } else if (miles > 8154 && miles <= 8450) {
            setcurrentState("Mexico");
        } else if (miles > 8450 && miles <= 8855) {
            setcurrentState("California");
        } else if (miles > 8855 && miles <= 8966) {
            setcurrentState("Arizona");
        } else if (miles > 8966 && miles <= 9036) {
            setcurrentState("Nevada");
        } else if (miles > 9036 && miles <= 9240) {
            setcurrentState("Arizona");
        } else if (miles > 9240 && miles <= 9487) {
            setcurrentState("California");
        } else if (miles > 9487 && miles <= 9825) {
            setcurrentState("Arizona");
        } else if (miles > 9825 && miles <= 10023) {
            setcurrentState("Utah");
        } else if (miles > 10023 && miles <= 10471) {
            setcurrentState("Colorado");
        } else if (miles > 10471 && miles <= 10892) {
            setcurrentState("Kansas");
        } else if (miles > 10892 && miles <= 10988) {
            setcurrentState("Missouri");
        } else if (miles > 10988 && miles <= 11158) {
            setcurrentState("Iowa");
        } else if (miles > 11158 && miles <= 11629) {
            setcurrentState("South Dakota");
        } else if (miles > 11629 && miles <= 11718) {
            setcurrentState("North Dakota");
        } else if (miles > 11718 && miles <= 12490) {
            setcurrentState("Montana");
        } else if (miles > 12490 && miles <= 12573) {
            setcurrentState("Idaho");
        } else if (miles > 12573 && miles <= 12643) {
            setcurrentState("Washington");
        } else if (miles > 12643 && miles <= 14812) {
            setcurrentState("Canada");
        } else if (miles > 14812 && miles <= 16000) {
            setcurrentState("Alaska");
        }
    }, [miles]); // This useEffect will run every time 'miles' changes
    useEffect(() => {
        window.addEventListener("wheel", handleWheel, {passive: false});
        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKeyPress);
        };
    },);
    const adjustedTop = `-${parseInt(displaySize.height, 10) + 1}vh`;
    return (
        <div>
            <div className="backgroundtest" style={{backgroundImage: `url(${backgroundImage})`}}>
            </div>
        <div className="background" style={{backgroundImage: `url(${backgroundImageSky})`}} ref={backgroundSkyRef}>
        </div>
            <div className="background1" style={{backgroundImage: `url(${backgroundImageMtn})`}} ref={backgroundMtnRef}>
            </div>
            <div className="background1" style={{backgroundImage: `url(${backgroundImageRiv})`}} ref={backgroundRivRef}>
            </div>
            <div className="background2" style={{backgroundImage: `url(${backgroundImageTree})`}} ref={backgroundTreeRef}>
                <img src={bus152} alt="bus" id="bus" ref={busRef}/>
            </div>

            <div className="main-text" ref={mainTextRef}>
                <p>Scrolling Into the Wild</p>

            </div>

            <div className="mile-sign-container" ref={mileSignRef}>
                <img id='mile-sign-counter' src={mileSign} alt="Mile Sign"/>
                <div className="mile-sign-text">
                    <p>Distance Traveled: </p>
                    <div className="" style={{fontSize: '4.5vh'}}>
                        <p>{miles} miles</p>
                    </div>
                    <p>Current State: </p>
                    <div className="" style={{fontSize: '4.5vh'}}>
                        <p>{currentState}</p>
                    </div>
                </div>
            </div>
            <div className="map-display-container" ref={MapSignRef}>
                <GoogleMapComponent miles={miles}/>
            </div>
            <div className="text-display-container" ref={textDisplay1Ref} style={{
                top: adjustedTop,
                width: displaySize.width,
                height: displaySize.height,

            }}>
                {/*<img  id="text-display-1" alt="Text Display 1" style={{ width: '100%', height: '100%' }}/>*/}
                <div className="date-text" style={{fontSize: '5vh', paddingBottom: '2px'}}>
                    <p>{displayDate}</p>
                </div>
                <div className="display-text" style={{fontSize: textStyle.fontSize, lineHeight: textStyle.lineHeight}}>

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