import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCategoryDataContext } from '@/hooks/useCategoryData';
import { categorizeData, FormData, getEndDate } from '@/utils/category';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarRange, Filter } from '@tamagui/lucide-icons';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { FunctionComponent, useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { ActivityIndicator, Platform, RefreshControl, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Button, ScrollView, Sheet, Text, } from 'tamagui';
import Item from './Item';
import Lottie from 'lottie-react-native';
import { useGetFormData } from '@/hooks/formDataHooks';
import { wait } from '@/components/OfficeScreen';
import useBlinkingAnimation from '@/hooks/useAnimations';


const BlinkingItem: FunctionComponent<{ item: FormData }> = ({ item }) => {
  const colorscheme = useColorScheme()
  const borderColor = useSharedValue(colorscheme == 'light' ? 'white' : 'transparent');

  React.useEffect(() => {
    borderColor.value = withRepeat(
      withTiming(colorscheme == 'light' ? '#ff7f50' : 'orange', { duration: 700, easing: Easing.linear,reduceMotion:ReduceMotion.Never }),
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
     { item && <Item item={item} key={item.id}/>}
    </Animated.View>
  );
};

 interface State {
  initialData:FormData[]
  data: FormData[];
  modalVisible: boolean;
  startDate: Date | null;
  endDate: Date | null;
  showStartPicker: boolean;
  showEndPicker: boolean;
  refreshing: boolean;
}
 type Action =
  | { type: 'SET_MODAL_VISIBLE'; payload: boolean }
  | { type: 'SET_START_DATE'; payload: Date | null }
  | { type: 'SET_END_DATE'; payload: Date | null }
  | { type: 'SET_SHOW_START_PICKER'; payload: boolean }
  | { type: 'SET_SHOW_END_PICKER'; payload: boolean }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_DATA'; payload: FormData[] }
  | { type: 'SET_INITIAL_DATA'; payload: FormData[] };

  const initialState: State = {
  initialData:[],
  data: [],
  modalVisible: false,
  startDate: null,
  endDate: null,
  showStartPicker: false,
  showEndPicker: false,
  refreshing: false,
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
      return {...state,  initialData: action.payload}
    default:
      return state;
  }
};

const CategoryPage = () => {
  const { id: category } = useLocalSearchParams<{ id: string }>();
  const [state, dispatch] = useReducer(reducer, { ...initialState});
  const { data:formData, isLoading:formDataLoading, error:getFormDataError,refetch } = useGetFormData();
  const {initialData:got,data,endDate,modalVisible,refreshing,showEndPicker,showStartPicker,startDate} = state
  const colourscheme = useColorScheme();
  const [isLoading,setIsLoading]=useState(true)
  const navigation = useNavigation()
  const animatedStyle = useBlinkingAnimation()

  useEffect(() => {
   const doRefetch = async () =>{
      const result = await refetch()
      if (result.data){
        const filteredFormData = result.data.filter(d => d.category === category);
        dispatch({type:'SET_INITIAL_DATA',payload:filteredFormData || []})
        dispatch({type:'SET_DATA',payload:filteredFormData || []})
        setIsLoading(false)
      }
   }
   doRefetch()
  }, [category, colourscheme, navigation]);

  const onRefresh= useCallback(()=>{
    dispatch({type:'SET_REFRESHING',payload:true})
    wait(2000).then(() => dispatch({ type: 'SET_REFRESHING', payload: false }));
  },[])

  const hasFilterApplied = startDate && endDate && (!modalVisible || got.length!==data.length)

  function searchItem(text: string, searchText: string): boolean {
    return text.toLowerCase().includes(searchText.toLowerCase())
  }

  const handleSearch = (text: string) => {
    const payload= got.filter(item => {
       if (item.category == 'Agreements') {
         return searchItem(item.clientName, text) || searchItem(item.vendorCode, text)
       } else if (item.category == 'Insurance Renewals') {
         return searchItem(item.employeeName, text) || searchItem(item.insuranceCategory, text) || searchItem(item.insuranceCompany, text) || searchItem(item.value, text)
       } else if (item.category == 'IQAMA Renewals') {
         return searchItem(item.employeeName, text) || searchItem(item.iqamaNumber, text)
       } else if (item.category == 'Purchase Order') {
         return searchItem(item.clientName, text) || searchItem(item.consultant, text) || searchItem(item.poNumber, text)
       } else {
         return searchItem(item.clientName, text) || searchItem(item.consultantName, text) || searchItem(item.sponsor, text) || searchItem(item.visaNumber, text)
       }
     })
   dispatch({type:'SET_DATA',payload:payload})
 }

  useLayoutEffect(() => {
    if (Platform.OS=='ios'){
      navigation.setOptions({
        title: `${category} Details`,
        headerSearchBarOptions: {
          placeholder: 'search..',
          headerIconColor: colourscheme === 'light' ? 'black' : 'white',
          textColor: colourscheme === 'light' ? 'black' : 'white',
          shouldShowHintSearchIcon: true,
          placement: 'stacked',
          onChangeText: (e:any) => handleSearch(e.nativeEvent.text),
        },
        headerRight: () => (
          <Button
            onPress={() => dispatch({ type: 'SET_MODAL_VISIBLE', payload: true })}
            icon={
              <>
                {!hasFilterApplied && <Filter color={colourscheme === 'light' ? 'black' : 'white'} />}
                {hasFilterApplied && <Filter fill={colourscheme === 'light' ? 'black' : 'white'} color={colourscheme === 'light' ? 'black' : 'white'} />}
                {hasFilterApplied && <Text style={{ color: colourscheme === 'light' ? 'black' : 'white' }}>1</Text>}
              </>
            }
            style={{ marginRight: 10, backgroundColor: 'transparent' }}
          />
        ),
      });
    }
    
  }, [navigation, category, colourscheme,hasFilterApplied,handleSearch]);

  const handleFilter = (startDate: Date | null, endDate: Date | null) => {
    const filteredData = got.filter(item => {
      const itemDate = getEndDate(item)
      if (itemDate && startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      }
    });
    dispatch({type:'SET_DATA', payload:filteredData})
    dispatch({type:'SET_MODAL_VISIBLE',payload:false})
  };
  
  const {
    next30Days,
    next30to60Days,
    next60to90Days,
    laterThan90Days,
    renewal
  } =  categorizeData(data);

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
          <Item key={item.id} item={item} />
        )
      ))}
    </ThemedView>
  );



  function onClearFilter(){
    dispatch({type:'SET_START_DATE',payload:null})
    dispatch({type:'SET_END_DATE',payload:null})
    dispatch({type:'SET_DATA',payload:got})
    dispatch({type:'SET_MODAL_VISIBLE',payload:false})
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{
        title: `${category} Details`,
        headerSearchBarOptions:Platform.OS=='android' ? {
          placeholder: 'search..',
          headerIconColor: colourscheme == 'light' ? 'black' : 'white',
          textColor: colourscheme == 'light' ? 'black' : 'white',
          shouldShowHintSearchIcon: true,
          disableBackButtonOverride:true,
          placement: 'automatic',
          obscureBackground:true,
          onChangeText: (e) => { handleSearch(e.nativeEvent.text) }
        }:undefined,
        headerRight:Platform.OS=='android' ? () => <Button
          onPress={() => dispatch({type:'SET_MODAL_VISIBLE',payload:true})}
          icon={
          <>
          {!hasFilterApplied && <Filter color={colourscheme=='light'?'black':'white'} />} 
          {hasFilterApplied && <Filter fill={colourscheme=='light'?'black':'white'} color={colourscheme=='light'?'black':'white'} />} 
         {hasFilterApplied && <Text color={colourscheme=='light'?'black':'white'}>1</Text>}
          </>
          }
          style={{ marginRight: 10 ,backgroundColor:'transparent'}}
        /> : undefined
      }} /> 

      <Sheet modal open={modalVisible} onOpenChange={() => dispatch({type:'SET_MODAL_VISIBLE',payload:false})} snapPointsMode='fit' >
        <ThemedView style={styles.sheetContainer}>
          <Text>Select Date Range:</Text>

          <ThemedView style={styles.datePickerRow}>
            <CalendarRange />
            <Button onPress={() => dispatch({type:'SET_SHOW_START_PICKER',payload:true})}>
              From: {startDate ? startDate.toLocaleDateString(): <Text>-</Text>}
            </Button>
            <Text>-</Text>
            <Button onPress={() =>dispatch({type:'SET_SHOW_END_PICKER',payload:true})}>
              To: {endDate ? endDate.toLocaleDateString(): <Text>-</Text>}
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
            dispatch({type:'SET_SHOW_START_PICKER',payload:!showStartPicker});
            if (selectedDate) dispatch({type:'SET_START_DATE',payload:selectedDate})
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            dispatch({type:'SET_SHOW_END_PICKER',payload:false});
            if (selectedDate) dispatch({type:'SET_END_DATE',payload:selectedDate})
          }}
        />
      )}


      {!isLoading && data.length>0 && <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
        {categories.map(({ title, data, color }, index) => data.length > 0 && 
        renderCategoryList(title, data, index, color))}
      </ScrollView>}
      {!isLoading && data.length==0 && <>
        <Lottie
                source={require('../../../assets/Animation/Animation-no_data.json')}
                autoPlay
                loop
                style={styles.animation_no_data}
              />
      </>}
      {(isLoading || formDataLoading || formData==undefined) && <Lottie
                source={require('../../../assets/Animation/Animation -loading1.json')}
                autoPlay
                loop
                style={styles.animation}
              />}
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
    backgroundColor: '#fff',
    gap:10
  },
  clearButton: {
    marginVertical: 10,
    backgroundColor: '#ff6600',
    color: '#fff',
  },
  loadingContainer: {
    padding: 16,
  },
  skeletonContainer:{
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'white',
  },
  animation: {
    width: 'auto',
    height: 250,
  },
  animation_no_data:{
    width: 'auto',
    height: 250,
    flex:1
  }
});

export default CategoryPage;




