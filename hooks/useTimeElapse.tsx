import { useEffect, useState } from "react";

export const useTimeElapseAnimation = () => {
    const [iconName, setIconName] = useState<'timer-sand' | 'timer-sand-paused' | 'timer-sand-complete'>('timer-sand');
    useEffect(() => {
        let timer: NodeJS.Timeout;
        console.log("working")
    
        const startIconSequence = () => {
          const iconSequence = ['timer-sand', 'timer-sand-paused', 'timer-sand-complete'];
          let currentIndex = 0;
    
          const cycleIcons = () => {
            setIconName(iconSequence[currentIndex] as 'timer-sand' | 'timer-sand-paused' | 'timer-sand-complete');
            currentIndex = (currentIndex + 1) % iconSequence.length;
    
            if (currentIndex === 0) {
              timer = setTimeout(startIconSequence, 1000);
            } else {
              timer = setTimeout(cycleIcons, 1000);
            }
          };
    
          cycleIcons();
        };
    
        startIconSequence();
        return () => {
          clearTimeout(timer);
        };
      }, []);
    return iconName
}