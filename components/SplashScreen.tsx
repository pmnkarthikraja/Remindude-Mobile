import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemedView } from './ThemedView';
import Animated,{FadeIn,FadeOut,useReducedMotion} from 'react-native-reanimated'

interface SplashScreenProps {
  onAnimationFinish: (isCancelled:boolean) => void; // Function that takes no arguments and returns void
}

const SplashScreenComponent: React.FC<SplashScreenProps> = ({ onAnimationFinish }) => {

  const isReducedMotionEnabled = useReducedMotion();

  return (
    <Animated.View exiting={FadeOut} style={styles.container}>
      <LottieView
        source={require('../assets/Animation/Animation3.json')} 
        speed={0.5}
        autoPlay
        loop={false}
        onAnimationFinish={onAnimationFinish}
        style={styles.lottie}
      />
       </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'black'
  },
  lottie:{
    width:420,
    height:370,
    backgroundColor: 'transparent',
  }
});

export default SplashScreenComponent;
