import LoadingWidget from '@/components/LoadingWidget';
import { wait } from '@/components/OfficeScreen';
import SectionItems, { HeaderTitle } from '@/components/SectionList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useGetFormData } from '@/hooks/formDataHooks';
import { categorizeData, Category, FormData, getEndDate, testAgreementsData } from '@/utils/category';
import { getAgreements } from '@/utils/database/agreementsDb';
import { getHouseRentalRenewals } from '@/utils/database/houseRentalRenewalDb';
import { getInsuranceRenewals } from '@/utils/database/insuranceRenewals';
import { getIqamaRenewals } from '@/utils/database/iqamaRenewalsDb';
import { getPurchaseOrders } from '@/utils/database/purchaseOrderDb';
import { getVisaDetails } from '@/utils/database/visaDetailsDb';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarRange, Filter } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import Lottie from 'lottie-react-native';
import React, { FunctionComponent, useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Button, Sheet, Text } from 'tamagui';

interface Section {
  title: HeaderTitle;
  data: FormData[];
  color: string;
}

interface State {
  initialData: FormData[]
  data: FormData[];
  modalVisible: boolean;
  startDate: Date | null;
  endDate: Date | null;
  showStartPicker: boolean;
  showEndPicker: boolean;
  refreshing: boolean;
  selectedTab: number;
}

type Action =
  | { type: 'SET_MODAL_VISIBLE'; payload: boolean }
  | { type: 'SET_START_DATE'; payload: Date | null }
  | { type: 'SET_END_DATE'; payload: Date | null }
  | { type: 'SET_SHOW_START_PICKER'; payload: boolean }
  | { type: 'SET_SHOW_END_PICKER'; payload: boolean }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_DATA'; payload: FormData[] }
  | { type: 'SET_INITIAL_DATA'; payload: FormData[] }
  | { type: 'SET_SELECTED_TAB'; payload: number };

const initialState: State = {
  initialData: [],
  data: [],
  modalVisible: false,
  startDate: null,
  endDate: null,
  showStartPicker: false,
  showEndPicker: false,
  refreshing: false,
  selectedTab: 0
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MODAL_VISIBLE':
      return { ...state, modalVisible: action.payload };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'SET_END_DATE':
      return { ...state, endDate: action.payload };
    case 'SET_SHOW_START_PICKER':
      return { ...state, showStartPicker: action.payload };
    case 'SET_SHOW_END_PICKER':
      return { ...state, showEndPicker: action.payload };
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_INITIAL_DATA':
      return { ...state, initialData: action.payload }
    case 'SET_SELECTED_TAB':
      return { ...state, selectedTab: action.payload }
    default:
      return state;
  }
};


// interface RenderCategoryListProps {
//   title: string, data: FormData[], index: number, color: string
// }
// const RenderCategoryList: FunctionComponent<RenderCategoryListProps> = ({
//   color,
//   data,
//   index,
//   title
// }) => {

//   const renderItem = useCallback(({ item }: { item: FormData }) => {
//     return <Item key={index} item={item} />;
//   }, []);

//   return (
//     // <View key={index}>
//     //   {data.length > 0 && <View key={index} style={{ gap: 5 }}>
//     //     {title == 'Renewal Pending' && <Animated.View style={animatedStyle}>
//     //       <ThemedText style={[styles.category, { color, fontWeight: 'bold' }]}>{title}</ThemedText>
//     //     </Animated.View>}
//     //     {title !== 'Renewal Pending' && <ThemedText style={[styles.category, { color, fontWeight: 'bold' }]}>{title}</ThemedText>
//     //     }

//     //     {title == 'Renewal Pending' ?
//     //       <FlatList
//     //         // removeClippedSubviews={true}
//     //         // onEndReachedThreshold={0.5}
//     //         // initialNumToRender={4}
//     //         // maxToRenderPerBatch={5}
//     //         // updateCellsBatchingPeriod={5}
//     //         // windowSize={1}
//     //         keyExtractor={(item) => item.id}
//     //         data={data}
//     //         renderItem={renderItem}
//     //       />
//     //       :
//     //       <FlatList
//     //         keyExtractor={(item) => item.id}
//     //         data={data}
//     //         renderItem={renderItem}
//     //       />}
//     //   </View>}
//     // </View>

//     <FlatList
//       keyExtractor={(item) => item.id}
//       data={data}
//       renderItem={renderItem}
//     />
//   )
// }


const getCateogirizedData = async (category:Category) =>{
  switch (category){
    case 'Agreements':
      return await getAgreements()
    case 'Purchase Order':
      console.log("case po ?")
      return await getPurchaseOrders()
    case 'Visa Details':
      return await getVisaDetails()
    case 'IQAMA Renewals':
      return await getIqamaRenewals()
    case 'Insurance Renewals':
      return await getInsuranceRenewals()
    case 'House Rental Renewal':
      return await getHouseRentalRenewals()
    default:
      return []
  }
}


const CategoryPage = () => {
  const { id: category } = useLocalSearchParams<{ id: string }>();
  const [state, dispatch] = useReducer(reducer, { ...initialState });
  // const { data: formData, isLoading: formDataLoading, error: getFormDataError, refetch } = useGetFormData();
  const { initialData: got, selectedTab, data, endDate, modalVisible, refreshing, showEndPicker, showStartPicker, startDate } = state
  const colourscheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true)
  const navigation = useNavigation()


  useEffect(() => {
    const doRefetch = async () => {
      // const result = await refetch()
      // const deviceId = await DeviceInfo.getUniqueId();

      // console.log("device id:",deviceId)

      // const dummyAgreementsData = testAgreementsData
      const dbCategorizedData = await getCateogirizedData(category as Category)

      dispatch({ type: 'SET_INITIAL_DATA', payload: dbCategorizedData || [] })
      dispatch({ type: 'SET_DATA', payload: dbCategorizedData || [] })
      setIsLoading(false)

      // if (result.data) {
      //   const filteredFormData = result.data.filter(d => d.category === category);
      //   dispatch({ type: 'SET_INITIAL_DATA', payload: filteredFormData || [] })
      //   dispatch({ type: 'SET_DATA', payload: filteredFormData || [] })
      //   setIsLoading(false)
      // }
    }
    doRefetch()
  }, [category]);

  const onRefresh = useCallback(() => {
    dispatch({ type: 'SET_REFRESHING', payload: true })
    wait(2000).then(() => dispatch({ type: 'SET_REFRESHING', payload: false }));
  }, [])

  const hasFilterApplied = startDate && endDate && (!modalVisible || got.length !== data.length)

  function searchItem(text: string, searchText: string): boolean {
    return text.toLowerCase().includes(searchText.toLowerCase())
  }

  const handleSearch = (text: string) => {
    const payload = got.filter(item => {
      if (item.category == 'Agreements') {
        return searchItem(item.clientName, text) || searchItem(item.vendorCode, text)
      } else if (item.category == 'Insurance Renewals') {
        return searchItem(item.employeeName, text) || searchItem(item.insuranceCategory, text) || searchItem(item.insuranceCompany, text) || searchItem(item.value, text)
      } else if (item.category == 'IQAMA Renewals') {
        return searchItem(item.employeeName, text) || searchItem(item.iqamaNumber, text)
      } else if (item.category == 'Purchase Order') {
        return searchItem(item.clientName, text) || searchItem(item.consultant, text) || searchItem(item.poNumber, text)
      } else if (item.category == 'House Rental Renewal') {
        return searchItem(item.houseOwnerName, text) || searchItem(item.consultantName, text) || searchItem(item.rentAmount, text)
      }
      else {
        return searchItem(item.clientName, text) || searchItem(item.consultantName, text) || searchItem(item.sponsor, text) || searchItem(item.visaNumber, text)
      }
    })
    dispatch({ type: 'SET_DATA', payload: payload })
  }

  // useLayoutEffect(() => {
  //   if (Platform.OS == 'ios') {
  //     navigation.setOptions({
  //       title: `${category} Details`,
  //       headerSearchBarOptions: {
  //         placeholder: 'search..',
  //         headerIconColor: colourscheme === 'light' ? 'black' : 'white',
  //         textColor: colourscheme === 'light' ? 'black' : 'white',
  //         shouldShowHintSearchIcon: true,
  //         placement: 'stacked',
  //         onChangeText: (e: any) => handleSearch(e.nativeEvent.text),
  //       },
  //       headerRight: () => (
  //         <Button
  //           onPress={() => dispatch({ type: 'SET_MODAL_VISIBLE', payload: true })}
  //           icon={
  //             <>
  //               {!hasFilterApplied && <Filter color={colourscheme === 'light' ? 'black' : 'white'} />}
  //               {hasFilterApplied && <Filter fill={colourscheme === 'light' ? 'black' : 'white'} color={colourscheme === 'light' ? 'black' : 'white'} />}
  //               {hasFilterApplied && <Text style={{ color: colourscheme === 'light' ? 'black' : 'white' }}>1</Text>}
  //             </>
  //           }
  //           style={{ marginRight: 10, backgroundColor: 'transparent' }}
  //         />
  //       ),
  //     });
  //   }
  // }, [navigation, category, colourscheme, hasFilterApplied, handleSearch]);


  const handleFilter = (startDate: Date | null, endDate: Date | null) => {
    const filteredData = got.filter(item => {
      const itemDate = getEndDate(item);

      if (!!itemDate && startDate && endDate) {
        const newItemDate = new Date(itemDate)
        newItemDate.setHours(0, 0, 0, 0)

        const normalizedStartDate = new Date(startDate);
        normalizedStartDate.setHours(0, 0, 0, 0);

        const normalizedEndDate = new Date(endDate);
        normalizedEndDate.setHours(23, 59, 59, 999);

        const isTrue = newItemDate >= normalizedStartDate && newItemDate <= normalizedEndDate;
        return isTrue
      }
      return false;
    });

    dispatch({ type: 'SET_DATA', payload: filteredData });
    dispatch({ type: 'SET_MODAL_VISIBLE', payload: false });
  };


  function onClearFilter() {
    dispatch({ type: 'SET_START_DATE', payload: null })
    dispatch({ type: 'SET_END_DATE', payload: null })
    dispatch({ type: 'SET_DATA', payload: got })
    dispatch({ type: 'SET_MODAL_VISIBLE', payload: false })
  }

  const linearGradientUnified = [
    colourscheme == 'light' ? '#a1c4fd' : '#252C39',
    colourscheme == 'light' ? 'white' : 'transparent']

  const {
    next30Days,
    next30to60Days,
    next60to90Days,
    laterThan90Days,
    renewal,
    assignedTasksToOthers,
    assignedTasksToYou,
    completed
  } = categorizeData(data);



  const categories: Section[] = [
    { title: 'Renewal Pending', data: renewal, color: '#ff6600' },
    { title: 'Next 30 days', data: next30Days, color: 'green' },
    { title: 'Next 30 - 60 days', data: next30to60Days, color: 'red' },
    { title: 'Next 60 - 90 days', data: next60to90Days, color: 'purple' },
    { title: 'Later 90 days', data: laterThan90Days, color: 'grey' },
    { title: 'Assigned To Others', data: assignedTasksToOthers, color: 'blue' },
    { title: 'Assigned To You', data: assignedTasksToYou, color: 'brown' },
  ];

  const flatteningData = (sections: Section[]): (FormData | HeaderTitle)[] => {
    const output = sections.map((section, index) => {
      const out: (HeaderTitle | FormData)[] = []
      if (section.data.length != 0) {
        const title: HeaderTitle = section.title
        const data = section.data
        out.push(title)
        out.push(...data)
      }
      return out
    }).flatMap(r => r)

    return output
  }

  const flattenedData = flatteningData(categories)

  return (
    <LinearGradient colors={linearGradientUnified} style={styles.container}>
      <Stack.Screen options={{
        title: `${category}`,
        headerSearchBarOptions: Platform.OS == 'android' ? {
          placeholder: 'search..',
          headerIconColor: colourscheme == 'light' ? 'black' : 'white',
          textColor: colourscheme == 'light' ? 'black' : 'white',
          shouldShowHintSearchIcon: true,
          disableBackButtonOverride: true,
          placement: 'automatic',
          obscureBackground: true,
          hintTextColor: colourscheme == 'light' ? 'black' : 'white',
          tintColor: colourscheme == 'light' ? 'black' : 'white',
          onChangeText: (e) => { handleSearch(e.nativeEvent.text) }
        } : undefined,
        headerStyle: {
          backgroundColor: colourscheme == 'light' ? '#a1c4fd' : '#252C39',
        },
        headerRight: Platform.OS == 'android' ? () => <Button
          onPress={() => dispatch({ type: 'SET_MODAL_VISIBLE', payload: true })}
          icon={
            <>
              {!hasFilterApplied && <Filter color={colourscheme == 'light' ? 'black' : 'white'} />}
              {hasFilterApplied && <Filter fill={colourscheme == 'light' ? 'black' : 'white'} color={colourscheme == 'light' ? 'black' : 'white'} />}
              {hasFilterApplied && <Text color={colourscheme == 'light' ? 'black' : 'white'}>1</Text>}
            </>
          }
          style={{ marginRight: 10, backgroundColor: 'transparent' }}
        /> : undefined
      }} />

      <Sheet modal open={modalVisible} onOpenChange={() => dispatch({ type: 'SET_MODAL_VISIBLE', payload: false })} snapPointsMode='fit' >
        <ThemedView style={styles.sheetContainer}>
          <Text>Select Date Range:</Text>

          <ThemedView style={styles.datePickerRow}>
            <CalendarRange />
            <Button onPress={() => dispatch({ type: 'SET_SHOW_START_PICKER', payload: true })}>
              From: {startDate ? startDate.toLocaleDateString() : <Text>-</Text>}
            </Button>
            <Text>-</Text>
            <Button onPress={() => dispatch({ type: 'SET_SHOW_END_PICKER', payload: true })}>
              To: {endDate ? endDate.toLocaleDateString() : <Text>-</Text>}
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
            dispatch({ type: 'SET_SHOW_START_PICKER', payload: !showStartPicker });
            if (selectedDate) dispatch({ type: 'SET_START_DATE', payload: selectedDate })
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            dispatch({ type: 'SET_SHOW_END_PICKER', payload: false });
            if (selectedDate) dispatch({ type: 'SET_END_DATE', payload: selectedDate })
          }}
        />
      )}

      {hasFilterApplied && (<View style={styles1.container}>
        <Text style={styles1.filterText}>
          {data.length} {data.length === 1 ? 'Item' : 'Items'} Found through filter
        </Text>

      </View>
      )}

      <TaskTabs onChangeTab={(tab) => {
        dispatch({
          type: 'SET_SELECTED_TAB',
          payload: tab
        })
      }} isColorLight={colourscheme == 'light'} />


      {!isLoading && data.length > 0 && selectedTab == 0 && (
        <SectionItems flattenedData={flattenedData} renewal={renewal} />
      )}

      {!isLoading &&selectedTab == 0 && flattenedData.length == 0 && (
       <LoadingWidget/>
      )}

      {!isLoading && data.length > 0 && selectedTab == 1 && (
        <SectionItems flattenedData={completed} renewal={renewal} />
      )}

      {!isLoading &&selectedTab == 1 && completed.length == 0 && (
        <Lottie
          source={require('../../../assets/Animation/Animation-no_data.json')}
          autoPlay
          loop
          style={[styles.animation_no_data, { flexGrow: 10 }]}
        />
      )}

      {!isLoading && data.length > 0 && selectedTab == 2 && (
        <SectionItems flattenedData={assignedTasksToYou} renewal={renewal} />
      )}

      {!isLoading &&selectedTab == 2 && assignedTasksToYou.length == 0 && (
        <Lottie
          source={require('../../../assets/Animation/Animation-no_data.json')}
          autoPlay
          loop
          style={[styles.animation_no_data, { flexGrow: 10 }]}
        />
      )}

      {!isLoading && data.length > 0 && selectedTab == 3 && (
        <SectionItems flattenedData={assignedTasksToOthers} renewal={renewal} />
      )}

      {!isLoading &&selectedTab == 3 && assignedTasksToOthers.length == 0 && (
        <Lottie
          source={require('../../../assets/Animation/Animation-no_data.json')}
          autoPlay
          loop
          style={[styles.animation_no_data, { flexGrow: 10 }]}
        />
      )}


      {!isLoading && data.length == 0 && <>
        <Lottie
          source={require('../../../assets/Animation/Animation-no_data.json')}
          autoPlay
          loop
          style={styles.animation_no_data}
        />
      </>}
      {/* {(isLoading || formDataLoading || formData == undefined) && <LoadingWidget/>} */}
      {isLoading && <LoadingWidget />}
      <View style={{ height: 80 }}></View>
    </LinearGradient>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: Platform.OS == 'ios' ? 80 : 0,
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
    // backgroundColor: '#fff',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    // backgroundColor: '#fff',
    gap: 10
  },
  clearButton: {
    marginVertical: 10,
    backgroundColor: '#ff6600',
    color: '#fff',
  },
  loadingContainer: {
    padding: 16,
  },
  skeletonContainer: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    // backgroundColor: 'white',
  },
  animation: {
    width: 'auto',
    height: 250,
  },
  animation_no_data: {
    width: 'auto',
    height: 250,
    flex: 1
  }
});


const styles1 = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center'
  },
});

export default React.memo(CategoryPage);




interface TaskTabsProps {
  onChangeTab: (tab: number) => void,
  isColorLight: boolean
}

const TaskTabs: FunctionComponent<TaskTabsProps> = React.memo(({
  onChangeTab,
  isColorLight
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const tabWidth = 100;

  useEffect(() => {
    onChangeTab(selectedTab)
  }, [selectedTab])

  const handleTabPress = (index: number) => {
    setSelectedTab(index);

    const xOffset = index * tabWidth - (tabWidth/2 ); 
    if (scrollViewRef.current){
      scrollViewRef.current.scrollTo({ x: xOffset, animated: true });
    }
  };
  const iconColor = isColorLight ? 'black' : 'white'

  return (
    <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false}
    scrollsToTop
      style={{ flexGrow: 0 }}>
      <View style={stylesTab.tabsContainer}>
        <TouchableOpacity onPress={() => handleTabPress(0)} style={[stylesTab.tab, selectedTab === 0 && stylesTab.activeTab]}>
          <ThemedText style={[stylesTab.tabText, selectedTab === 0 && stylesTab.activeTabText]}>All Tasks </ThemedText>
          <FontAwesome5 name="tasks" color={iconColor} style={[stylesTab.tabText, selectedTab === 0 && stylesTab.activeTabText]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress(1)} style={[stylesTab.tab, selectedTab === 1 && stylesTab.activeTab]}>
          <ThemedText style={[stylesTab.tabText, selectedTab === 1 && stylesTab.activeTabText]}>Completed</ThemedText>
          <MaterialIcons name='check' color={iconColor} style={[stylesTab.tabText, selectedTab === 1 && stylesTab.activeTabText]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress(2)} style={[stylesTab.tab, selectedTab === 2 && stylesTab.activeTab]}>
          <ThemedText style={[stylesTab.tabText, selectedTab === 2 && stylesTab.activeTabText]}>Assigned To You </ThemedText>
          <MaterialCommunityIcons name="account-arrow-left" size={20} color={iconColor} style={[stylesTab.tabText, selectedTab === 2 && stylesTab.activeTabText]} />

        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress(3)} style={[stylesTab.tab, selectedTab === 3 && stylesTab.activeTab]}>
          <ThemedText style={[stylesTab.tabText, selectedTab === 3 && stylesTab.activeTabText]}>Assigned To Others </ThemedText>
          <MaterialCommunityIcons name="account-arrow-right" size={20} color={iconColor} style={[stylesTab.tabText, selectedTab === 3 && stylesTab.activeTabText]} />

        </TouchableOpacity>
      </View>

      {/* <AnimatedNative.View
        style={[
          stylesTab.underline,
          {
            left: underlinePosition,
          },
        ]}
      /> */}
    </ScrollView>
  );
});


const stylesTab = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    height: 55,
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: 'row'
  },
  activeTab: {
    backgroundColor: Colors.light.tint,
    borderRadius: 20,

  },
  tabText: {
    // fontSize: 13,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: 'white',
    // fontSize: 14,
  },
  underline: {
    height: 3,
    width: 100,
    backgroundColor: Colors.light.tint,
    position: 'absolute',
    bottom: 0,
  },
});