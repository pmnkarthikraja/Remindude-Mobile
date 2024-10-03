import { ThemedText } from '@/components/ThemedText';
import { FormData } from '@/utils/category';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Modal, Platform, StyleSheet, Text, useColorScheme } from 'react-native';
import { Button, CardHeader, Paragraph, XStack, YStack } from 'tamagui';
import { Card } from 'tamagui';
import { router } from 'expo-router';
import { Path, Svg } from 'react-native-svg';
import { CalendarClock, Trash, User, FileText, Tag, CheckCircle, CircleUser } from '@tamagui/lucide-icons';
import { useCategoryDataContext } from '@/hooks/useCategoryData';

const Item = React.memo(({ item }: { item: FormData}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const {formdata, setFormData} = useCategoryDataContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorscheme = useColorScheme();

  const handleDelete = useCallback(() => {
    const filtered = formdata.filter(data => data.id !== item.id);
    setFormData(filtered);
    setModalVisible(false); 
  }, [formdata, item.id]);

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderContent = useCallback(() => {
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
      case 'IQAMA Renewals':
        return (
          <XStack>
            <YStack>
              <XStack style={styles.itemText}>
                <User size={20} color={colorscheme === 'light' ? '#00796B' : 'orange'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'orange' }}>
                  {item.employeeName}
                </Text>
              </XStack>

              <XStack style={styles.itemText}>
                <FileText size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#FF9800' : '#FF5722' }}>
                  IQAMA Number: {item.iqamaNumber}
                </Text>
              </XStack>
            {/* </YStack>
            <YStack> */}
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'skyblue' }}>
                  Expiry Date: {item.expiryDate.toDateString()}
                </Text>
              </XStack>
            </YStack>
          </XStack>
        );
      case 'Insurance Renewals':
        return (
          <XStack>
            <YStack>
              <XStack style={styles.itemText}>
                <User size={20} color={colorscheme === 'light' ? '#00796B' : 'orange'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'orange' }}>
                  {item.employeeName}
                </Text>
              </XStack>

              <XStack style={styles.itemText}>
                <FileText size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#FF9800' : '#FF5722' }}>
                  Insurance Company: {item.insuranceCompany}
                </Text>
              </XStack>
            {/* </YStack>
            <YStack> */}
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'skyblue' }}>
                  Start: {item.insuranceStartDate.toDateString()}
                </Text>
              </XStack>

              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={{ marginLeft: 6, fontWeight: 'bold', color: colorscheme === 'light' ? '#00796B' : 'skyblue' }}>
                  End: {item.insuranceEndDate.toDateString()}
                </Text>
              </XStack>
            </YStack>
          </XStack>
        );
      default:
        return <ThemedText style={styles.itemText}>No data available.</ThemedText>;
    }
  }, [item, colorscheme]);

  return (
    <XStack $sm={{ flexDirection: 'column' }} style={styles.itemContainer}>
      <Card
        style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
        onPress={() => router.navigate(`/(tabs)/category/edit/${item.id}`)}
      >
        <CardHeader>
          {renderContent()}
          <Button
            theme='red_active'
            onPress={openModal}
            size="$2"
            width={100}
            margin={'auto'}
            icon={Trash}
          >
            Delete
          </Button>

          <Modal visible={isModalVisible} onDismiss={closeModal}>
            <YStack space="$4" padding="$4" alignItems="center">
              <Text style={{ fontWeight: 'bold' }}>Are you sure?</Text>
              <Paragraph>This action cannot be undone. Do you want to delete this item?</Paragraph>
              <XStack space="$4">
                <Button theme="gray" onPress={closeModal} size="$3">Cancel</Button>
                <Button theme="red" onPress={handleDelete} size="$3">Confirm Delete</Button>
              </XStack>
            </YStack>
          </Modal>
        </CardHeader>
        <Card.Background theme={'alt2'} borderRadius={10} backgroundColor={colorscheme == 'light' ? 'white' : Platform.OS == 'ios' ? '$accentBackground' : '$accentColor'}>
          <Svg height="200" width="400" style={{ position: 'absolute', top: 0, right: 0, opacity: 0.3 }}>
            <Path d="M0,100 C150,200 250,0 400,100 L400,200 L0,200 Z" fill={colorscheme == 'light' ? "blue" : '#CCE3F3'} />
          </Svg>
          <Svg height="100%" width="400" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.25 }}>
            <Path d="M0,50 C100,150 300,-50 400,50 L400,200 L0,200 Z" fill={colorscheme == 'light' ? "purple" : 'white'} />
          </Svg>
        </Card.Background>
      </Card>
    </XStack>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 8,
    padding: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default React.memo(Item);
