import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { agreementsData, insuranceRenewalData, onboardingData, purchaseOrderData, visaDetailsData } from '@/utils/datasets';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Item from './Item';

const categoryDataMap: Record<string, any[]> = {
  Agreements: agreementsData,
  "Purchase Order": purchaseOrderData,
  "Visa Details": visaDetailsData,
  "Onboarding Consultant": onboardingData,
  "Insurance Renewals": insuranceRenewalData,
};

const CategoryPage = () => {
  const { id: category } = useLocalSearchParams<{id:string}>();
  const data = categoryDataMap[category];
  return (
    <ThemedView style={styles.container}>
       <Stack.Screen options={{title:'Client Details'}}/>
       <ThemedText style={styles.itemText}>{category} Clients </ThemedText>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Item item={item} category={category} />}
                contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
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
  },
});

export default CategoryPage;
