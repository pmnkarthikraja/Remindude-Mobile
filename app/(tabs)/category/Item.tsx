// app/category/Item.tsx
import { ThemedText } from '@/components/ThemedText';
import { FormData } from '@/utils/category';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, useColorScheme } from 'react-native';
import { CardHeader, XStack, YStack } from 'tamagui';

import { Card } from 'tamagui';

import { router } from 'expo-router';

import { Path, Svg } from 'react-native-svg';

import {CalendarClock, CheckCircle, CircleUser, Tag, User } from '@tamagui/lucide-icons';

const Item = ({ item }: { item: FormData }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorscheme = useColorScheme()

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderContent = () => {
    switch (item.category) {
      case 'Agreements':
        return (
          <XStack>
            <YStack>
              <XStack style={styles.itemText}>
                <User size={20} color={colorscheme === 'light' ? '#00796B' : 'orange'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'orange' }}>
                  {item.clientName}
                </Text>
              </XStack>

              <XStack style={styles.itemText}>
                <Tag size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#FF9800' : '#FF5722' }}>
                  Vendor Code: {item.vendorCode}
                </Text>
              </XStack>
            </YStack>


            <YStack>
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'skyblue' }}>
                  {item.endDate.toLocaleDateString()}
                </Text>
              </XStack>
            </YStack>
          </XStack>
        );
      case 'Purchase Order':
        return (
          <XStack>
            <YStack>
              <XStack style={styles.itemText}>
                <User size={20} color={colorscheme === 'light' ? '#00796B' : 'orange'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'orange' }}>
                  {item.clientName}
                </Text>
              </XStack>

              <XStack style={styles.itemText}>
                <CheckCircle size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#FF9800' : '#FF5722' }}>
                  Consultant: {item.consultant}
                </Text>
              </XStack>

              <XStack style={styles.itemText}>
                <Tag size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#FF9800' : '#FF5722' }}>
                  PO Number: {item.poNumber}
                </Text>
              </XStack>
            </YStack>
            <YStack>
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'skyblue' }}>
                  {item.poEndDate.toLocaleDateString()}
                </Text>
              </XStack>
            </YStack>
          </XStack>
        );
      case 'Visa Details':
        return (
            <XStack>
            <YStack>
              <XStack style={styles.itemText}>
                <User size={20} color={colorscheme === 'light' ? '#00796B' : 'orange'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'orange' }}>
                  {item.clientName}
                </Text>
              </XStack>

              <XStack style={styles.itemText}>
                <CheckCircle size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#FF9800' : '#FF5722' }}>
                  Consultant: {item.consultantName}
                </Text>
              </XStack>

              <XStack style={styles.itemText}>
                <Tag size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#FF9800' : '#FF5722' }}>
                  Visa Number: {item.visaNumber}
                </Text>
              </XStack>

              <XStack style={styles.itemText}>
                <CircleUser size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#FF9800' : '#FF5722' }}>
                  Sponsor: {item.sponsor}
                </Text>
              </XStack>
            </YStack>
            <YStack>
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'skyblue' }}>
                  {item.visaEndDate.toLocaleDateString()}
                </Text>
              </XStack>
            </YStack>
          </XStack>
        );
      case 'Onboarding Consultant':
        return (
          <>
            <ThemedText style={styles.itemText}>Employee Name: {item.employeeName}</ThemedText>
            <ThemedText style={styles.itemText}>IQAMA Number: {item.iqamaNumber}</ThemedText>
            <ThemedText style={styles.itemText}>Expiry Date: {item.expiryDate.toDateString()}</ThemedText>
          </>
        );
      case 'Insurance Renewals':
        return (
          <>
            <ThemedText style={styles.itemText}>Employee Name: {item.employeeName}</ThemedText>
            <ThemedText style={styles.itemText}>Insurance Start Date: {item.insuranceStartDate.toDateString()}</ThemedText>
            <ThemedText style={styles.itemText}>Insurance End Date: {item.insuranceEndDate.toDateString()}</ThemedText>
            <ThemedText style={styles.itemText}>Insurance Company: {item.insuranceCompany}</ThemedText>
            <ThemedText style={styles.itemText}>Category: {item.category}</ThemedText>
            <ThemedText style={styles.itemText}>Value: {item.value}</ThemedText>
          </>
        );
      default:
        return <ThemedText style={styles.itemText}>No data available.</ThemedText>;
    }
  };

  return (
    <XStack $sm={{ flexDirection: 'column' }} style={styles.itemContainer} >
      <Card
        style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
        onPress={() => router.navigate(`/(tabs)/category/edit/${item.id}`)}
      >
        <CardHeader>
          {renderContent()}
        </CardHeader>
        

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
              top: 0,
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
            height="100%"
            width="400"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              opacity: 0.25,
              // transform: [{ rotate: '180deg' }], 
            }}
          >
            <Path
              d="M0,50 C100,150 300,-50 400,50 L400,200 L0,200 Z"
              fill={colorscheme == 'light' ? "purple" : 'white'}
            />
          </Svg>

        </Card.Background>
      </Card>
    </XStack>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 8,
    padding: 10,
    // marginVertical: 8,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
  },
  itemText: {
    fontSize: 16,
    // color: '#333',
    marginBottom: 4,
  },
});

export default Item;
