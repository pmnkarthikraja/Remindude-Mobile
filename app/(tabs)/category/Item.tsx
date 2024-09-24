// app/category/Item.tsx
import { ThemedText } from '@/components/ThemedText';
import { Category } from '@/utils/category';
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Card } from 'tamagui';
import { FormData } from '../add';

const Item = ({ item }: { item: FormData}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity

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
          <Card theme={'dark'} backgroundColor={'white'}>
            <ThemedText style={styles.itemText}>Client Name: {item.clientName}</ThemedText>
            <ThemedText style={styles.itemText}>Vendor Code: {item.vendorCode}</ThemedText>
            <ThemedText style={styles.itemText}>Start Date: {item.startDate.toLocaleDateString()}</ThemedText>
            <ThemedText style={styles.itemText}>End Date: {item.endDate.toLocaleDateString()}</ThemedText>
          </Card>
        );
      case 'Purchase Order':
        return (
          <>
            <ThemedText style={styles.itemText}>Client Name: {item.clientName}</ThemedText>
            <ThemedText style={styles.itemText}>Consultant: {item.consultant}</ThemedText>
            <ThemedText style={styles.itemText}>PO Number: {item.poNumber}</ThemedText>
            <ThemedText style={styles.itemText}>PO Issue Date: {item.poIssueDate.toDateString()}</ThemedText>
            <ThemedText style={styles.itemText}>PO End Date: {item.poEndDate.toDateString()}</ThemedText>
            <ThemedText style={styles.itemText}>Entry Date: {item.entryDate.toDateString()}</ThemedText>
          </>
        );
      case 'Visa Details':
        return (
          <>
            <ThemedText style={styles.itemText}>Client Name: {item.clientName}</ThemedText>
            <ThemedText style={styles.itemText}>Visa Number: {item.visaNumber}</ThemedText>
            <ThemedText style={styles.itemText}>Sponsor: {item.sponsor}</ThemedText>
            <ThemedText style={styles.itemText}>Consultant Name: {item.consultantName}</ThemedText>
            <ThemedText style={styles.itemText}>Visa End Date: {item.visaEndDate.toDateString()}</ThemedText>
            <ThemedText style={styles.itemText}>Visa Entry Date: {item.visaEntryDate.toDateString()}</ThemedText>
          </>
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
    <Animated.View style={[styles.itemContainer, { opacity: fadeAnim }]}>
      {renderContent()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});

export default Item;
