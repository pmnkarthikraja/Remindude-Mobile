import React, { createContext, useContext, useEffect, useState } from 'react';

type IconName = 'timer-sand' | 'timer-sand-paused' | 'timer-sand-complete';

const TimeAnimationContext = createContext<IconName>('timer-sand');

export const TimeAnimationProvider = ({ children }: { children: React.ReactNode }) => {
    const [iconName, setIconName] = useState<IconName>('timer-sand');

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const startIconSequence = () => {
            const iconSequence: IconName[] = ['timer-sand', 'timer-sand-paused', 'timer-sand-complete'];
            let currentIndex = 0;

            const cycleIcons = () => {
                setIconName(iconSequence[currentIndex]);
                currentIndex = (currentIndex + 1) % iconSequence.length;
                timer = setTimeout(cycleIcons, 1000);
            };

            cycleIcons();
        };

        startIconSequence();

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <TimeAnimationContext.Provider value={iconName}>
            {children}
        </TimeAnimationContext.Provider>
    );
};

export const useTimeElapseAnimation = () => useContext(TimeAnimationContext);
