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
import axios from 'axios';

const Item = React.memo(({ item }: { item: FormData }) => {
  const { formdata, setFormData } = useCategoryDataContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorscheme = useColorScheme();
  
  const [modalState, setModalState] = useState<{isVisible:boolean,itemId:string|null}>({ isVisible: false, itemId: null });

  const handleDelete = useCallback(async () => {
    const filtered = formdata.filter(data => data.id !== item.id);
    setFormData(filtered);
    try{
      await axios.delete(`https://remindude.vercel.app/formdata/${item.id}`)
    }catch(e){
      console.log("error on axios:",e)
    }

    setModalState({ isVisible: false, itemId: null }); 
  }, [formdata, item.id]);

  const openModal = useCallback(() => setModalState({ isVisible: true, itemId: item.id }), [item.id]);
  const closeModal = useCallback(() => setModalState({ isVisible: false, itemId: null }), []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const backgroundColor = colorscheme === 'light' 
    ? 'white' 
    : Platform.OS === 'ios' 
      ? '$accentBackground' 
      : '$accentColor'; 

      const textColor = colorscheme === 'light' ? '#00796B' : '#FF5722'


  const renderContent = useCallback(() => {
    switch (item.category) {
      case 'Agreements':
        return (
          <XStack>
            <YStack>
              <XStack style={styles.itemText}>
                <User size={20} color={colorscheme === 'light' ? '#00796B' : 'orange'} />
                <Text style={[styles.text,{color:textColor}]}>{item.clientName}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <Tag size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={[styles.text,{color:textColor}]}>Vendor Code: {item.vendorCode}</Text>
              </XStack>
            </YStack>
            <YStack>
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={[styles.text,{color:textColor}]}>{item.endDate.toLocaleDateString()}</Text>
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
                <Text style={[styles.text,{color:textColor}]}>{item.clientName}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <CheckCircle size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={[styles.text,{color:textColor}]}>Consultant: {item.consultant}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <Tag size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={[styles.text,{color:textColor}]}>PO Number: {item.poNumber}</Text>
              </XStack>
            </YStack>
            <YStack>
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={[styles.text,{color:textColor}]}>{item.poEndDate.toLocaleDateString()}</Text>
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
                <Text style={[styles.text,{color:textColor}]}>{item.clientName}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <CheckCircle size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={[styles.text,{color:textColor}]}>Consultant: {item.consultantName}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <Tag size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={[styles.text,{color:textColor}]}>Visa Number: {item.visaNumber}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <CircleUser size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={[styles.text,{color:textColor}]}>Sponsor: {item.sponsor}</Text>
              </XStack>
            </YStack>
            <YStack>
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={[styles.text,{color:textColor}]}>{item.visaEndDate.toLocaleDateString()}</Text>
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
                <Text style={[styles.text,{color:textColor}]}>{item.employeeName}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <FileText size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={[styles.text,{color:textColor}]}>IQAMA Number: {item.iqamaNumber}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={[styles.text,{color:textColor}]}>Expiry Date: {item.expiryDate.toDateString()}</Text>
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
                <Text style={[styles.text,{color:textColor}]}>{item.employeeName}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <FileText size={20} color={colorscheme === 'light' ? '#FF9800' : '#FF5722'} />
                <Text style={[styles.text,{color:textColor}]}>Insurance Company: {item.insuranceCompany}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={[styles.text,{color:textColor}]}>Start: {item.insuranceStartDate.toDateString()}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colorscheme === 'light' ? '#00796B' : 'skyblue'} />
                <Text style={[styles.text,{color:textColor}]}>End: {item.insuranceEndDate.toDateString()}</Text>
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
        style={styles.cardStyle}
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

          <Modal visible={modalState.isVisible} onDismiss={closeModal}>
            <YStack space="$4" padding="$4" alignItems="center">
              <Text style={styles.modalTitle}>Are you sure?</Text>
              <Paragraph>This action cannot be undone. Do you want to delete this item?</Paragraph>
              <XStack space="$4">
                <Button theme="gray" onPress={closeModal} size="$3">Cancel</Button>
                <Button theme="red" onPress={async ()=>await handleDelete()} size="$3">Confirm Delete</Button>
              </XStack>
            </YStack>
          </Modal>
        </CardHeader>
        <Card.Background theme={'alt2'} style={[styles.cardBackground, {backgroundColor}]}>
          <Svg height="200" width="400" style={styles.svgTop}>
            <Path d="M0,100 C150,200 250,0 400,100 L400,200 L0,200 Z" fill={colorscheme === 'light' ? "blue" : '#CCE3F3'} />
          </Svg>
          <Svg height="100%" width="400" style={styles.svgBottom}>
            <Path d="M0,50 C100,150 300,-50 400,50 L400,200 L0,200 Z" fill={colorscheme === 'light' ? "purple" : 'white'} />
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
  cardStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  },
  cardBackground: {
    borderRadius: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    marginLeft: 6,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  svgTop: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.3
  },
  svgBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    opacity: 0.25
  }
});

export default React.memo(Item);
