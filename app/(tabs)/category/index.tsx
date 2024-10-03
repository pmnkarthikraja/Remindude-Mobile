import { Dimensions, FlatList, Image, Platform, ScrollView, Switch, Text, TouchableHighlight, useColorScheme, View } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { LinearGradient } from 'expo-linear-gradient';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import type { CardProps } from 'tamagui';
import { Card, H3, Text as TextTamagui, XStack, YStack } from 'tamagui';

import { router } from 'expo-router';
import { Appearance } from 'react-native';

import Lottie from 'lottie-react-native';
import { StyleSheet, RefreshControl } from 'react-native';
import { Path, Polygon } from 'react-native-svg';

import { ThemedText } from '@/components/ThemedText';
import { useCategoryDataContext } from '@/hooks/useCategoryData';
import { useProfileContext } from '@/hooks/useProfile';
import { categorizeData, Category, FormData } from '@/utils/category';
import { MoonStar, Sun } from '@tamagui/lucide-icons';
import * as Notifications from 'expo-notifications';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const categories: Category[] = [
  "Agreements",
  "Purchase Order",
  "Visa Details",
  // "Onboarding Consultant",
  // "Interview Schedule",
  // "VAT Submission",
  "IQAMA Renewals",
  "Insurance Renewals",
  // "Bills Payments",
  // "Room Rent Collection",
  // "Room Rent Pay",
  // "Saudi Salary Processing",
  // "WithHolding Tax",
  // "Reimbursements",
  // "Deduction",
  // "GOSI Payments",
  // "Saudization Payment collection",
  // "Employee Issue Tracking"
]


export const categoryImagePaths: Record<string, any> = {
  Agreements: require('../../../assets/images/categories/Agreement.png'),
  Reimbursements: require('../../../assets/images/categories/Reimbursements.png'),
  Deduction: require('../../../assets/images/categories/Deduction.png'),
  "Purchase Order": require('../../../assets/images/categories/Purchase Order.png'),
  "Visa Details": require('../../../assets/images/categories/Visa.png'),
  "Onboarding Consultant": require('../../../assets/images/categories/Onboard Consultation.png'),
  "Interview Schedule": require('../../../assets/images/categories/Interview Schedule.png'),
  "VAT Submission": require('../../../assets/images/categories/VAT Submission.png'),
  "IQAMA Renewals": require('../../../assets/images/categories/IQAMA Renewal.png'),
  "Insurance Renewals": require('../../../assets/images/categories/Insurance Renewal.png'),
  "Bills Payments": require('../../../assets/images/categories/Bill Payments.png'),
  "Room Rent Collection": require('../../../assets/images/categories/Rental Collectin.png'),
  "Room Rent Pay": require('../../../assets/images/categories/Room Rent Pay.png'),
  "Saudi Salary Processing": require('../../../assets/images/categories/Saudi Salary Processing.png'),
  "WithHolding Tax": require('../../../assets/images/categories/WithHolding Tax.png'),
  "GOSI Payments": require('../../../assets/images/categories/Room Rent Pay.png'),
  "Saudization Payment collection": require('../../../assets/images/categories/Rental Collectin.png'),
  "Employee Issue Tracking": require('../../../assets/images/categories/Employment Issue.png')
};

export const CategoryCardWrapper: FunctionComponent<{ category: Category, items: FormData[] }> = ({
  category,
  items
}) => {

  return (
    <XStack $sm={{ flexDirection: 'column' }} paddingHorizontal="$4">
      <CategoryCard
        theme={'alt2'}
        size="$1"
        animation={'quickest'}
        width={'100%'}
        height={170}
        padding={5}
        // pressStyle={{ scale: 0.775 }}
        category={category}
        items={items}
      />
    </XStack>
  );
};

interface CategoryCardProps extends CardProps {
  category: Category;
  items: FormData[]
}

export function CategoryCard(props: CategoryCardProps) {
  const { items, category } = props
  const colorscheme = useColorScheme();
  const image = categoryImagePaths[props.category];

  const getCardBackgroundColor = (index: number) => {
    const lightColors = ['#F0F4C3', '#FFCDD2', '#D1C4E9'];
    const darkColors = ['#4CAF50', '#E57373', '#9575CD'];

    return colorscheme === 'light' ? lightColors[index] : darkColors[index];
  };

  const filteredItems = items.filter(i => i.category == category)
  const { next30Days, next30to60Days, next60to90Days, renewal } = categorizeData(filteredItems)
  const labelData = [
    { label: 'Next 30 Days', count: next30Days.length },
    { label: '30 - 60 Days', count: next30to60Days.length },
    { label: '60 - 90 Days', count: next60to90Days.length }
  ];

  return (
    <Card
      style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
      onPress={() => router.navigate(`/category/${props.category}`)}
      elevate
      size="$7"
      {...props}
    >
      <Card.Header >
        <View style={styles.cardHeader}>
          <Image source={image} style={styles.cardHeadImg} />
          <H3 theme={'alt2'}
            color={'$black050'}
            size={'$8'}>
            {props.category}
          </H3>
        </View>

        {renewal.length > 0 && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text adjustsFontSizeToFit
            style={{ fontSize: 12, color: colorscheme == 'light' ? 'orangered' : 'orange', paddingLeft: 10 }}>
            Renewal Pending:
          </Text>
          <Text style={{ fontWeight: 'bold', color: colorscheme == 'light' ? 'orangered' : 'orange', paddingLeft: 5, fontSize: 20 }}>{renewal.length}</Text>

        </View>}

      </Card.Header>

      <Card.Footer padded>
        <XStack flex={1} />
      </Card.Footer>

      <Card.Background
        theme={'alt2'}
        borderRadius={10}
        backgroundColor={
          colorscheme == 'light'
            ? 'white'
            : Platform.OS == 'ios'
              ? '$accentBackground'
              : '$accentColor'
        }
      >


        <Svg
          height="200"
          width="400"
          style={{
            position: 'absolute',
            top: 35,
            right: 0,
            opacity: 0.3,
          }}
        >
          <Path
            d="M0,100 C150,200 250,0 400,100 L400,200 L0,200 Z"
            fill={colorscheme == 'light' ? "blue" : '#CCE3F3'}
          />
        </Svg>

        <Svg
          height="200"
          width="400"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            opacity: 0.25,
          }}
        >
          <Path
            d="M0,50 C100,150 300,-50 400,50 L400,200 L0,200 Z"
            fill={colorscheme == 'light' ? "purple" : 'transparent'}
          />
        </Svg>


      </Card.Background>
      <Card.Footer padded>
        <XStack jc="space-around" space="$4">
          {labelData.map((item, index) => (
            <YStack
              key={index}
              borderRadius={10}
              backgroundColor={getCardBackgroundColor(index)}
              width={80}
              height={60}
              ai="center"
              jc="center"
            >
              <View style={{ height: 20 }}></View>
              <TextTamagui fontSize={10} color={'$black'} >{item.label}</TextTamagui>
              <TextTamagui style={{ marginTop: -10 }} padding={15} fontSize={'$8'} color={'$accentColor'}>
                {item.count}
              </TextTamagui>

              {index == 0 && <Svg
                height="50"
                width="100%"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  opacity: 0.2,
                }}
              >
                <Path
                  d="M0,20 C50,70 80,-10 100,20 L100,100 L0,100 Z"
                  fill={colorscheme === 'light' ? '#000000' : '#C5E1A5'}
                />
              </Svg>}
            </YStack>
          ))}
        </XStack>
      </Card.Footer>
    </Card>
  );
}

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

const Header = () => {
  const [stars] = useState(() => generateRandomStars(15));
  const systemTheme = Appearance.getColorScheme();
  const { profile, userName, email } = useProfileContext()
  const translateX = useSharedValue(-150);
  const [switchOn, setSwitchOn] = useState(systemTheme == 'dark')

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
            source={require('../clouds.png')}
            style={styles.cloud}
            resizeMode="contain"
          />
        </Animated.View>
      )}
      <Image
        source={{ uri: profile }}
        style={styles.profilePic}
      />
      <ThemedText style={styles.greeting}>Hello, {userName}!</ThemedText>
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

export const wait = (timeout:
  number
)=>{
  return new Promise(resolve => setTimeout(resolve,timeout))
}

const HomeScreen = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [refreshing,setRefreshing]=useState(false)
  
  const onRefresh= useCallback(()=>{
    setRefreshing(true)
    wait(2000).then(()=>setRefreshing(false))
  },[])

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
    };

    requestPermissions();

    // Set up a notification listener to handle notifications received while the app is open
    const subscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification.request.identifier);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const colorscheme = useColorScheme()
  const { formdata } = useCategoryDataContext()
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colorscheme == 'light' ? '#a1c4fd' : '#252C39', colorscheme == 'light' ? 'white' : 'transparent']}
        style={{ flex: 1 }}
      >
     
        <Header />

           <TouchableHighlight style={styles.gotologin} onPress={async ()=>{
        await AsyncStorage.removeItem('token');

        router.navigate('/login')
        }}>
        <Text>Go to login</Text>
       </TouchableHighlight>
        <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
          ListFooterComponent={() => <View style={{ height: 150 }} />}
          ListHeaderComponentStyle={{
            flex: 1,
          }}
          ListHeaderComponent={() => (
            <>
              <Lottie
                source={require('../../../assets/Animation/Animation2.json')}
                autoPlay
                loop
                style={styles.animation2}
              />
              <Lottie
                source={require('../../../assets/Animation/Animation.json')}
                autoPlay
                loop
                style={styles.animation}
              />
              <Lottie
                source={require('../../../assets/Animation/Animation2.json')}
                autoPlay
                loop
                style={styles.animation2}
              />
            </>
          )}

          data={categories}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => <CategoryCardWrapper key={item.length} items={formdata} category={item} />}
        />
      </LinearGradient>
    </View>
  );
}

export default gestureHandlerRootHOC(HomeScreen)

const styles = StyleSheet.create({
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cloudContainer: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  cardHeadImg: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  animation: {
    width: 'auto',
    height: 150,
  },
  animation2: {
    width: 'auto',
    height: 20
  },
  bannerImage: {
    resizeMode: 'cover',
    width: '100%',
    height: 250,
  },
  listContainer: {
    gap: 10,
    padding: 20,
  },
  themeSwitch: {
    color: 'grey'
  },
  paragraphContainer: {
    marginTop: 10,
  },
  paragraph: {
    marginVertical: 3,
    fontSize: 16,
  },
  next30Days: {
    color: '#FF6600',
    fontWeight: '600',
  },
  next30To60Days: {
    color: '#FFBF04',
    fontWeight: '600',
  },
  next60To90Days: {
    color: '#004684',
    fontWeight: '600',
  },
  highlightedText: {
    fontWeight: 'bold',
    fontSize: 23
  },
  switch: {
    width: 60,
    height: 30,
  },
  gotologin: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    width: 100,
    justifyContent: 'center',
    marginLeft:10
  },
});
