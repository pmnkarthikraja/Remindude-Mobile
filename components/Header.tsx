import { Dimensions, Image, Switch, View } from 'react-native';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { StyleSheet } from 'react-native';
import { Polygon } from 'react-native-svg';
import { ThemedText } from '@/components/ThemedText';
import { useUser } from '@/components/userContext';
import { useProfileContext } from '@/hooks/useProfile';
import { User } from '@/utils/user';
import { MoonStar, Sun } from '@tamagui/lucide-icons';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg from 'react-native-svg';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const createStarPath = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
  let path = '';
  let angle = Math.PI / spikes;

  for (let i = 0; i < 2 * spikes; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + Math.cos(i * angle) * radius;
    const y = cy - Math.sin(i * angle) * radius;
    path += `${x},${y} `;
  }
  return path.trim();
};

const generateRandomStars = (count: number) => {
  let stars = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 2 + 3;
    stars.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * 100,
      size,
      path: createStarPath(0, 0, 5, size, size / 2),
    });
  }
  return stars;
};

interface HeaderProps{
    user:User | null
  }
  
  const Header:FunctionComponent<HeaderProps> = ({
    user
  }) => {
    const [stars] = useState(() => generateRandomStars(15));
    const systemTheme = Appearance.getColorScheme();
    const { profile } = useProfileContext()
    const translateX = useSharedValue(-150);
    const [switchOn, setSwitchOn] = useState(systemTheme == 'dark')
    const {officeMode, setOfficeMode,loading} = useUser()
  
    React.useEffect(() => {
      translateX.value = withRepeat(
        withTiming(width, { duration: 15000,reduceMotion:ReduceMotion.Never }),
        100,
        false
      );
    }, [translateX]);
  
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));
  
    const toggleTheme = () => {
      const theme = systemTheme == 'dark' ? 'light' : 'dark'
      setSwitchOn(theme == 'dark')
      Appearance.setColorScheme(theme)
    };
  
    const toggleOffice = () => {
      setOfficeMode(!officeMode)
    }
  
    return (
      <View style={[styles.header]}>
        {systemTheme == 'dark' && <Svg height={100} width={width} style={styles.starsContainer}>
          {stars.map((star) => (
            <Polygon
              key={star.id}
              points={star.path}
              fill="white"
              opacity={Math.random() * 0.8 + 0.2}
              translateX={star.x}
              translateY={star.y}
            />
          ))}
        </Svg>}
  
        {systemTheme === 'light' && (
          <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
            <Image
              source={require('../assets/images/clouds.png')}
              style={styles.cloud}
              resizeMode="contain"
            />
          </Animated.View>
        )}
        <Image
          source={{ uri: user?.profilePicture || profile }}
          style={styles.profilePic}
        />
        <TypingAnimation userName={user?.userName+'!' || ''}/>
        <Switch
          value={officeMode}
          onValueChange={toggleOffice}
          trackColor={{ false: 'white', true: 'grey' }}
          thumbColor={officeMode ? '#24cc5e' : Colors.light.tint}
          style={styles.switch}
        />
        <ThemedText>{officeMode ? 'Task':'Office'}</ThemedText>
  
        <Switch
          value={switchOn}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={switchOn ? '#f5dd4b' : '#f4f3f4'}
          style={styles.switch}
        />
        <Animated.View>
          {systemTheme == 'dark' ? (
            <MoonStar fill={'white'} color="white" size={20} />
          ) :
            (
              <Sun fill={'yellow'} color="yellow" size={20} />
            )}
        </Animated.View>
      </View>
    );
  };

  export default Header
  

  const styles = StyleSheet.create({
    starsContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    cloud: {
      position: 'absolute',
      width: 150,
      height: 100,
      top: 50,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      paddingTop: 40,
    },
    profilePic: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    greeting: {
      fontSize: 14,
      fontWeight: 'bold',
      flex: 1,
    },
    themeSwitch: {
      color: 'grey'
    },
    switch: {
      width: 60,
      height: 30,
    },
    
  });

  
  const TypingAnimation:FunctionComponent<{userName:string}> = ({ userName }) => {
    const [displayedText, setDisplayedText] = useState('');
  
    useEffect(() => {
      if (userName) {
        let currentIndex = 0;
  
        const interval = setInterval(() => {
          if (currentIndex < userName.length) {
            setDisplayedText(prev => prev + userName[currentIndex]);
            currentIndex++;
          } else {
            clearInterval(interval);
          }
        }, 100); 
  
        return () => clearInterval(interval);
      }
    }, [userName]);
  
    return (
      <ThemedText style={styles.greeting}>
        Hello, {displayedText}
      </ThemedText>
    );
  };