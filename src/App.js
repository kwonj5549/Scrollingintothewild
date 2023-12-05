import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
    const mainTextRef = useRef(null);
    const roadRef = useRef(null);
    const stripesRef = useRef(null);
    useEffect(() => {
        gsap.to(roadRef.current, {
            x: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".App",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        });
    }, []);

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
    useEffect(() => {
        ScrollTrigger.create({
            animation: gsap.to(stripesRef.current, {
                backgroundPosition: '100% 0', // Move the background to simulate the stripe movement
                ease: 'none',
                repeat: -1, // Infinite loop
                duration: 1, // Speed of the animation
            }),
            trigger: '#road',
            start: 'top bottom', // Start the animation when the top of the road hits the bottom of the viewport
            end: 'bottom top', // End the animation when the bottom of the road leaves the top of the viewport
            scrub: true, // Link the animation progress to the scroll position
        });
    }, []);
    return (
        <div className="App">
            <div className="main-text" ref={mainTextRef}>
                <p>Scrolling Into the Wild</p>
            </div>
            <div id="road" >
                <div id="stripes" ref={stripesRef}></div>
            </div>
        </div>
    );
}

export default App;