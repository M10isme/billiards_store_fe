import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }) => {
    const [displayLocation, setDisplayLocation] = useState(useLocation());
    const [transitionStage, setTransitionStage] = useState("fadeIn");
    const location = useLocation();

    useEffect(() => {
        if (location !== displayLocation) {
            setTransitionStage("fadeOut");
        }
    }, [location, displayLocation]);

    return (
        <div
            className={`transition-all duration-300 ${
                transitionStage === "fadeOut"
                    ? "opacity-0 transform translate-y-4"
                    : "opacity-100 transform translate-y-0"
            }`}
            onTransitionEnd={() => {
                if (transitionStage === "fadeOut") {
                    setDisplayLocation(location);
                    setTransitionStage("fadeIn");
                }
            }}
        >
            {children}
        </div>
    );
};

export default PageTransition;
