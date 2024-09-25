import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { agreementsData, insuranceRenewalData, onboardingData, purchaseOrderData, visaDetailsData } from '@/utils/datasets';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableHighlight, TouchableOpacity, useColorScheme } from 'react-native';
import Item from './Item';
import { useCategoryDataContext } from '@/hooks/useCategoryData';

// const categoryDataMap: Record<string, any[]> = {
//   Agreements: agreementsData,
//   "Purchase Order": purchaseOrderData,
//   "Visa Details": visaDetailsData,
//   "Onboarding Consultant": onboardingData,
//   "Insurance Renewals": insuranceRenewalData,
// };

const CategoryPage = () => {
  const { id: category } = useLocalSearchParams<{ id: string }>();
  const { formdata } = useCategoryDataContext();
  const got = formdata.filter(d => d.category === category);
  const [data,setData]=useState<FormData[]>(got)
  const colourscheme = useColorScheme()

  const {
    next30Days,
    next30to60Days,
    next60to90Days,
    laterThan90Days,
    renewal
  } = categorizeData(data);

  const categories = [
    { title: 'Renewal Pending', data:renewal },
    { title: 'Next 30 days', data: next30Days },
    { title: 'Next 30 - 60 days', data: next30to60Days },
    { title: 'Next 60 - 90 days', data: next60to90Days },
    { title: 'Later 90 days', data: laterThan90Days },
  ];

  const renderCategoryList = (title: string, data: FormData[],index:number) => (
    <ThemedView key={index}>
      <ThemedText style={[styles.category, title=='Renewal Pending' ? {color:'red'}:[]]}>{title}</ThemedText>
      {data.map((item, index) => (
      <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={()=>router.navigate(`/(tabs)/category/edit/${item.id}`)}>
        <Item key={index} item={item} />
        </TouchableOpacity>
      ))}
    </ThemedView>
  );

  function searchItem(text:string,searchText:string):boolean{
    return text.toLowerCase().includes(searchText.toLowerCase())
  }

  const handleSearch = (text:string)=>{
    setData(
      got.filter(item=>{
        if (item.category=='Agreements'){
          return searchItem(item.clientName,text) || searchItem(item.vendorCode,text)
        }else if (item.category == 'Insurance Renewals'){
          return searchItem(item.employeeName,text) || searchItem(item.insuranceCategory,text) || searchItem(item.insuranceCompany, text) || searchItem(item.value,text)
        }else if (item.category=='Onboarding Consultant'){
          return searchItem(item.employeeName,text) || searchItem(item.iqamaNumber,text)
        }else if (item.category=='Purchase Order') {
          return searchItem(item.clientName,text) || searchItem(item.consultant,text) || searchItem(item.poNumber,text)
        }else{ //visa details
          return searchItem(item.clientName,text) || searchItem(item.consultantName,text) || searchItem(item.sponsor,text) || searchItem(item.visaNumber,text)
        }
      })
    )
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: `${category} Details`, headerSearchBarOptions:{
        placeholder:'search..',
        headerIconColor: colourscheme=='light'?'black':'white',
        textColor:colourscheme=='light'?'black':'white',
        shouldShowHintSearchIcon:true,
        placement:'stacked',
        onChangeText:(e)=>{handleSearch(e.nativeEvent.text)}

      } }} />
      <ThemedText style={styles.itemText}>{category} Clients</ThemedText>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {categories.map(({ title, data },index) => data.length>0 && renderCategoryList(title, data,index))}
      </ScrollView>
      <ThemedView style={{height:80}}></ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  category:{
    color:'grey',
    padding:10
  },
  listContent: {
    paddingBottom: 0,
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



const getEndDate = (item: FormData): Date | null => {
  if ('endDate' in item) return item.endDate;
  if ('poEndDate' in item) return item.poEndDate;
  if ('visaEndDate' in item) return item.visaEndDate;
  if ('expiryDate' in item) return item.expiryDate;
  if ('insuranceEndDate' in item) return item.insuranceEndDate;
  return null;
};

import { differenceInDays } from 'date-fns';
import { FormData } from '@/utils/category';
import { ScrollView, View } from 'tamagui';

const categorizeData = (data: FormData[]): {
  next30Days: FormData[],
  next30to60Days: FormData[],
  next60to90Days: FormData[],
  laterThan90Days: FormData[],
  renewal:FormData[]
} => {
  const today = new Date();

  const renewal = data.filter(item=>{
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) < 1
  })

  const next30Days = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate,today) > 1 && endDate && differenceInDays(endDate, today) <= 30;
  });

  const next30to60Days = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) > 30 && differenceInDays(endDate, today) <= 60;
  });

  const next60to90Days = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) > 60 && differenceInDays(endDate, today) <= 90;
  });

  const laterThan90Days = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) > 90;
  });

  return { next30Days, next30to60Days, next60to90Days, laterThan90Days, renewal };
};


type SortType = 'newest' | 'oldest' | 'renewal';

const sortData = (data: FormData[], sortBy: SortType): FormData[] => {
  switch (sortBy) {
    case 'newest':
      return [...data].sort((a, b) => {
        const endDateA = getEndDate(a)?.getTime() || 0;
        const endDateB = getEndDate(b)?.getTime() || 0;
        return endDateB - endDateA;
      });
    case 'oldest':
      return [...data].sort((a, b) => {
        const endDateA = getEndDate(a)?.getTime() || 0;
        const endDateB = getEndDate(b)?.getTime() || 0;
        return endDateA - endDateB;
      });
    case 'renewal':
      return data.filter(item => {
        const endDate = getEndDate(item);
        return endDate && differenceInDays(endDate, new Date()) < 0; 
      });
    default:
      return data;
  }
};

const handleSort = (data:FormData[],sortBy: 'newest' | 'oldest' | 'renewal') => {
  const sorted = sortData(data, sortBy);
};
