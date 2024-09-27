import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCategoryDataContext } from '@/hooks/useCategoryData';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { FunctionComponent, useState } from 'react';
import { Modal, Platform, StyleSheet, useColorScheme } from 'react-native';
import Item from './Item';
import { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';


const BlinkingItem: FunctionComponent<{ item: FormData }> = ({ item }) => {
  const colorscheme = useColorScheme()
  const borderColor = useSharedValue(colorscheme == 'light' ? 'white' : 'transparent');

  React.useEffect(() => {
    borderColor.value = withRepeat(
      withTiming(colorscheme == 'light' ? '#ff7f50' : 'orange', { duration: 700, easing: Easing.linear }),
      -1,
      true
    );
  }, [borderColor]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value,
      borderWidth: 0.9,
      borderRadius: 10
    };
  });

  return (
    <Animated.View style={animatedBorderStyle}>
      <Item item={item} />
    </Animated.View>
  );
};


const CategoryPage = () => {
  const { id: category } = useLocalSearchParams<{ id: string }>();
  const { formdata } = useCategoryDataContext();
  const got = formdata.filter(d => d.category === category);
  const [data, setData] = useState<FormData[]>(got)
  const colourscheme = useColorScheme()
  const opacity = useSharedValue(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date| null>(null);
  const [endDate, setEndDate] = useState<Date|null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);


  const handleFilter = (startDate: Date | null, endDate: Date | null) => {
    const filteredData = got.filter(item => {
      const itemDate = getEndDate(item)
      if (itemDate && startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      }
    });
    setData(filteredData);
    setModalVisible(false);
  };



  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(0, { duration: 500, easing: Easing.linear }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      borderColor: 'red',
    };
  });

  const {
    next30Days,
    next30to60Days,
    next60to90Days,
    laterThan90Days,
    renewal
  } = categorizeData(data);

  const categories = [
    { title: 'Renewal Pending', data: renewal, color: '#ff6600' },
    { title: 'Next 30 days', data: next30Days, color: 'green' },
    { title: 'Next 30 - 60 days', data: next30to60Days, color: 'orange' },
    { title: 'Next 60 - 90 days', data: next60to90Days, color: '#bdb76b' },
    { title: 'Later 90 days', data: laterThan90Days, color: 'grey' },
  ];

  const renderCategoryList = (title: string, data: FormData[], index: number, color: string) => (
    <ThemedView key={index} style={{ gap: 5 }}>
      {title == 'Renewal Pending' && <Animated.View style={animatedStyle}>
        <ThemedText style={[styles.category, { color, fontWeight: 'bold' }]}>{title}</ThemedText>
      </Animated.View>}
      {title !== 'Renewal Pending' && <ThemedText style={[styles.category, { color, fontWeight: 'bold' }]}>{title}</ThemedText>
      }
      {data.map((item, index) => (
        title === 'Renewal Pending' ? (
          <BlinkingItem key={index} item={item} />
        ) : (
          <Item key={index} item={item} />
        )
      ))}
    </ThemedView>
  );

  function searchItem(text: string, searchText: string): boolean {
    return text.toLowerCase().includes(searchText.toLowerCase())
  }

  const handleSearch = (text: string) => {
    setData(
      got.filter(item => {
        if (item.category == 'Agreements') {
          return searchItem(item.clientName, text) || searchItem(item.vendorCode, text)
        } else if (item.category == 'Insurance Renewals') {
          return searchItem(item.employeeName, text) || searchItem(item.insuranceCategory, text) || searchItem(item.insuranceCompany, text) || searchItem(item.value, text)
        } else if (item.category == 'Onboarding Consultant') {
          return searchItem(item.employeeName, text) || searchItem(item.iqamaNumber, text)
        } else if (item.category == 'Purchase Order') {
          return searchItem(item.clientName, text) || searchItem(item.consultant, text) || searchItem(item.poNumber, text)
        } else {
          return searchItem(item.clientName, text) || searchItem(item.consultantName, text) || searchItem(item.sponsor, text) || searchItem(item.visaNumber, text)
        }
      })
    )
  }

  function onClearFilter(){
    setStartDate(null)
    setEndDate(null)
    setData(got)
    setModalVisible(false)
  }

  const hasFilterApplied = startDate && endDate && (!modalVisible || got.length!==data.length)
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{
        title: `${category} Details`,
        headerSearchBarOptions: {
          placeholder: 'search..',
          headerIconColor: colourscheme == 'light' ? 'black' : 'white',
          textColor: colourscheme == 'light' ? 'black' : 'white',
          shouldShowHintSearchIcon: true,
          placement: 'stacked',
          onChangeText: (e) => { handleSearch(e.nativeEvent.text) }
        },
        // headerStyle:{backgroundColor:'#a1c4fd'},
        headerRight: () => <Button
          onPress={() => setModalVisible(true)}
          icon={
          <>
          {!hasFilterApplied && <Filter color={colourscheme=='light'?'black':'white'} />} 
          {hasFilterApplied && <Filter fill={colourscheme=='light'?'black':'white'} color={colourscheme=='light'?'black':'white'} />} 
         {hasFilterApplied && <Text color={colourscheme=='light'?'black':'white'}>1</Text>}
          </>
          }
          style={{ marginRight: 10 ,backgroundColor:'transparent'}}
        />
      }} />


      <Sheet modal open={modalVisible} onOpenChange={() => setModalVisible(false)} snapPointsMode='fit' >
        <ThemedView style={styles.sheetContainer}>
          <Text>Select Date Range:</Text>

          <ThemedView style={styles.datePickerRow}>
            <CalendarRange />
            <Button onPress={() => setShowStartPicker(true)}>
              From Date: {startDate ? startDate.toLocaleDateString(): <Text>-</Text>}
            </Button>
          </ThemedView>
          <ThemedView style={styles.datePickerRow}>
            <CalendarRange />
            <Button onPress={() =>setShowEndPicker(true)}>
              To Date: {endDate ? endDate.toLocaleDateString(): <Text>-</Text>}
            </Button>
          </ThemedView>

          <Button onPress={() => handleFilter(startDate, endDate)} style={styles.clearButton}>
            Apply Filter
          </Button>
          <Button onPress={onClearFilter} variant='outlined'>
            Clear Filter
          </Button>
        </ThemedView>
      </Sheet>


      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}



      <ScrollView contentContainerStyle={styles.scrollContent}>
        {categories.map(({ title, data, color }, index) => data.length > 0 && renderCategoryList(title, data, index, color))}
      </ScrollView>
      <ThemedView style={{ height: 80 }}></ThemedView>
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
    paddingTop:Platform.OS=='ios' ? 80:0
  },
  category: {
    color: 'grey',
    padding: 10
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
  sheetContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#fff'
  },
  clearButton: {
    marginVertical: 10,
    backgroundColor: '#ff6600',
    color: '#fff',
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

import { FormData } from '@/utils/category';
import { differenceInDays } from 'date-fns';
import { Button, ScrollView, Sheet, Text } from 'tamagui';
import Animated from 'react-native-reanimated';
import { CalendarRange, Filter, FilterX } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';

const categorizeData = (data: FormData[]): {
  next30Days: FormData[],
  next30to60Days: FormData[],
  next60to90Days: FormData[],
  laterThan90Days: FormData[],
  renewal: FormData[]
} => {
  const today = new Date();

  const renewal = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) < 1
  })

  const next30Days = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) > 1 && endDate && differenceInDays(endDate, today) <= 30;
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

const handleSort = (data: FormData[], sortBy: 'newest' | 'oldest' | 'renewal') => {
  const sorted = sortData(data, sortBy);
};
