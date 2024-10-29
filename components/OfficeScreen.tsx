import { Colors } from '@/constants/Colors';
import useBlinkingAnimation from '@/hooks/useAnimations';
import { categorizeData, Category, FormData } from '@/utils/category';
import { router } from 'expo-router';
import Lottie from 'lottie-react-native';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Easing, FlatList, Image, Animated as NativeAnimated, Platform, RefreshControl, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import type { CardProps } from 'tamagui';
import { Card, H3, Text as TextTamagui, XStack, YStack } from 'tamagui';
import NotificationBox from './NotificationBox';


interface AnimatedCountProps {
  finalCount: number,
  textcolor: string
}

const AnimatedCount: FunctionComponent<AnimatedCountProps> = ({ finalCount, textcolor }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const animatedValue = useRef(new NativeAnimated.Value(0)).current;

  useEffect(() => {
    NativeAnimated.timing(animatedValue, {
      toValue: finalCount,
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    animatedValue.addListener((v) => {
      setDisplayCount(Math.round(v.value));
    });

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [finalCount]);

  return (

    <TextTamagui style={{ marginTop: -10 }} padding={15} fontSize={'$8'}
      color={textcolor}>
      {displayCount}
    </TextTamagui>
  );
};



const categories: Category[] = [
  "Agreements",
  "Purchase Order",
  "Visa Details",
  // "Onboarding Consultant",
  // "Interview Schedule",
  // "VAT Submission",
  "IQAMA Renewals",
  "Insurance Renewals",
  'House Rental Renewal'
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
  Agreements: require('../assets/images/categories/Agreement.png'),
  Reimbursements: require('../assets/images/categories/Reimbursements.png'),
  Deduction: require('../assets/images/categories/Deduction.png'),
  "Purchase Order": require('../assets/images/categories/Purchase Order.png'),
  "Visa Details": require('../assets/images/categories/Visa.png'),
  "Onboarding Consultant": require('../assets/images/categories/Onboard Consultation.png'),
  "Interview Schedule": require('../assets/images/categories/Interview Schedule.png'),
  "VAT Submission": require('../assets/images/categories/VAT Submission.png'),
  "IQAMA Renewals": require('../assets/images/categories/IQAMA Renewal.png'),
  "Insurance Renewals": require('../assets/images/categories/Insurance Renewal.png'),
  "Bills Payments": require('../assets/images/categories/Bill Payments.png'),
  "Room Rent Collection": require('../assets/images/categories/Rental Collectin.png'),
  "Room Rent Pay": require('../assets/images/categories/Room Rent Pay.png'),
  "Saudi Salary Processing": require('../assets/images/categories/Saudi Salary Processing.png'),
  "WithHolding Tax": require('../assets/images/categories/WithHolding Tax.png'),
  "GOSI Payments": require('../assets/images/categories/Room Rent Pay.png'),
  "Saudization Payment collection": require('../assets/images/categories/Rental Collectin.png'),
  "Employee Issue Tracking": require('../assets/images/categories/Employment Issue.png'),
  'House Rental Renewal': require('../assets/images/categories/Rental Collectin.png'),
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
        // pressStyle={{ scale:8.3 }}
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
  const animatedStyle = useBlinkingAnimation()
  const image = categoryImagePaths[props.category];

  const getCardBackgroundColor = (index: number) => {
    const lightColors = ['#F0F4C3', '#FFCDD2', '#D1C4E9'];
    const darkColors = ['#4CAF50', '#E57373', '#9575CD'];

    return colorscheme === 'light' ? lightColors[index] : darkColors[index];
  };

  const getCountColor = (index: number) => {
    const darkColors = ['#F0F4C3', '#FFCDD2', '#D1C4E9'];
    const lightColors = ['#4CAF50', '#E57373', '#9575CD'];

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
      onPress={() => router.navigate(`/category/${category}`)}
      elevate
      size="$7"
      {...props}
    >
      <Card.Header >
        <View style={styles.cardHeader}>
          <Image source={image} style={styles.cardHeadImg} />
          <H3 theme={'alt2'}
            color={colorscheme == 'light' ? Colors.light.tint : 'white'}
            size={'$8'}>
            {props.category}
          </H3>
        </View>

        {renewal.length > 0 && <Animated.View style={[{ flexDirection: 'row', alignItems: 'center' }, animatedStyle]}>
          <Text adjustsFontSizeToFit
            style={{ fontSize: 12, color: colorscheme == 'light' ? 'orangered' : 'orange', paddingLeft: 10 }}>
            Renewal Pending:
          </Text>
          <Text style={{ fontWeight: 'bold', color: colorscheme == 'light' ? 'orangered' : 'orange', paddingLeft: 5, fontSize: 20 }}>{renewal.length}</Text>
        </Animated.View>}

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
              <TextTamagui fontSize={10} color={colorscheme == 'light' ? 'black' : 'white'} >{item.label}</TextTamagui>

              <AnimatedCount finalCount={item.count} textcolor={getCountColor(index)} />

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

export const wait = (timeout:
  number
) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export interface OfficeScreenProps {
  refreshing: boolean,
  onRefresh: () => void,
  formData: FormData[],
  isConnected: boolean
}

const OfficeScreen: FunctionComponent<OfficeScreenProps> = ({
  onRefresh,
  refreshing,
  formData,
  isConnected
}) => {

  return (
    <View>
      <View>
      <NotificationBox />
      </View>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={() => <View style={{ height: 150 }} />}
        ListHeaderComponentStyle={{
          flex: 1,
        }}
        ListHeaderComponent={() => (
          <>
            {isConnected && <>
              <Lottie
                source={require('../assets/Animation/Animation2.json')}
                autoPlay
                loop
                style={styles.animation2}
              />
              <Lottie
                source={require('../assets/Animation/Animation.json')}
                autoPlay
                loop
                style={styles.animation}
              />
              <Lottie
                source={require('../assets/Animation/Animation2.json')}
                autoPlay
                loop
                style={styles.animation2}
              />
            </>}

            {!isConnected && <>
              <Lottie
                source={require('../assets/Animation/Animation - no_internet.json')}
                autoPlay
                loop
                style={styles.animation}
              />
            </>}
          </>
        )}
        data={categories}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <CategoryCardWrapper key={item.length} items={formData} category={item} />}
      />

    </View>
  );
}

export default OfficeScreen

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
    fontSize: 14,
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
  loadingAnimation: {
    flex: 1,
    justifyContent: 'center',
    width: 'auto',
    height: 150
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
  highlightedText: {
    fontWeight: 'bold',
    fontSize: 23
  },
  switch: {
    width: 60,
    height: 30,
  },
});
