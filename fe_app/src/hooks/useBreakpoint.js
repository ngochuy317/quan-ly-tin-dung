import React, { useState, useEffect } from "react";

export const useBreakpoints = () => {
    const [breakpoint, setBreakPoint] = useState('');
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();

        if (0 < windowSize.width && windowSize.width < 600) {
            setBreakPoint('xs');
        }
        if (600 < windowSize.width && windowSize.width < 960) {
            setBreakPoint('sm');
        }
        if (960 < windowSize.width && windowSize.width < 1280) {
            setBreakPoint('md');
        }
        if (1280 < windowSize.width && windowSize.width < 1920) {
            setBreakPoint('lg');
        }
        if (windowSize.width >= 1920) {
            setBreakPoint('xl');
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [windowSize.width]);

    return breakpoint;
}