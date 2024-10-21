import React from "react";
import { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

const useBlinkingAnimation = () => {
    const opacity = useSharedValue(1);

    React.useEffect(() => {
        opacity.value = withRepeat(withTiming(0, { duration: 500, easing: Easing.linear, reduceMotion: ReduceMotion.Never }), -1, true);
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            borderColor: 'red',
        };
    });

    return animatedStyle
}

export default useBlinkingAnimation