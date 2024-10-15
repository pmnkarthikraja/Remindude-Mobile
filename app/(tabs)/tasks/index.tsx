import React, { useState, useCallback, useRef, useEffect, FunctionComponent } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, Image, TextInput, Platform, Pressable } from 'react-native';
import moment from 'moment';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useAnimatedScrollHandler, useSharedValue, withTiming } from 'react-native-reanimated';
import {Animated as AnimatedNative} from 'react-native'

const TaskScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [tasks, setTasks] = useState(dummyTasks[selectedDate] || []);
  const [isMonthListVisible, setMonthListVisible] = useState(false);
  const [isYearListVisible, setYearListVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
 

  const months = moment.months();
  const years = Array.from({ length: 15 }, (_, index) => (moment().year() + index).toString());

  const toggleMonthList = () => {
    setMonthListVisible(!isMonthListVisible);
  };

  const toggleYearList = () => {
    setYearListVisible(!isYearListVisible);
  };

  const selectMonth = (month: string) => {
    const newDate = moment(selectedDate).month(month).toDate();
    setSelectedDate(moment(newDate).format('YYYY-MM-DD'));
    setSelectedMonth(month);
    setMonthListVisible(false); 
  };

  const selectYear = (year: string) => {
    const newDate = moment(selectedDate).year(Number(year)).toDate();
    setSelectedDate(moment(newDate).format('YYYY-MM-DD'));
    setSelectedYear(year);
    setYearListVisible(false);
  };

  const getDatesForSelectedMonth = useCallback(() => {
    const startOfMonth = moment(selectedDate).startOf('month');
    const endOfMonth = moment(selectedDate).endOf('month');
    
    const dates = [];
    for (let date = startOfMonth; date.isBefore(endOfMonth) || date.isSame(endOfMonth); date.add(1, 'day')) {
      dates.push(date.clone());
    }
    return dates;
  }, [selectedDate]);


  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setTasks(dummyTasks[date] || []);
  };


  return (
    <View style={styles.container}>
      <View style={{ height: 50 }}></View>

      <View style={styles.header}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={styles.dateText}>{moment(selectedDate).format('DD MMM Y')}</Text>

        <View style={{flexDirection:'row',gap:10}}>
          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <Text>{selectedMonth}</Text>
            <TouchableOpacity onPress={toggleMonthList}>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <Text>{selectedYear}</Text>
            <TouchableOpacity onPress={toggleYearList}>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
            </TouchableOpacity>
          </View>
          </View>
        </View>
        {/* <Text style={styles.taskCount}>{tasks.length} tasks today</Text> */}
      </View>

      {isMonthListVisible && (
        <View style={styles.monthListContainer}>
          <FlatList
            data={months}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectMonth(item)}>
                <Text style={styles.monthText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

{isYearListVisible && (
        <View style={styles.yearListContainer}>
          <FlatList
            scrollEnabled={true}
            data={years}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectYear(item)}>
                <Text style={styles.monthText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}


      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <RenderCalender getDatesForSelectedMonth={getDatesForSelectedMonth}
       handleDateChange={handleDateChange} selectedDate={selectedDate}/>

      <TaskTabs/>
      <ListTasks />
      {Platform.OS == 'android' && <View style={{ height: 60 }}></View>}

    </View>
  );
};


interface RenderCalenderProps{
  getDatesForSelectedMonth: () => moment.Moment[],
  handleDateChange: (date: string) => void,
  selectedDate:string
}

const RenderCalender:FunctionComponent<RenderCalenderProps> = ({
  getDatesForSelectedMonth,
  handleDateChange,
  selectedDate

}) => {
  const scrollViewRef = useRef<Animated.ScrollView>(null); 
  const scrollX = useSharedValue(0);
  const dates = getDatesForSelectedMonth();
  const [isFirstLoad, setIsFirstLoad] = useState(true);  

  const todayIndex = dates.findIndex(date => date.isSame(moment(), 'day'));

  useEffect(() => {
    if (isFirstLoad && todayIndex !== -1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: todayIndex * 78, 
          animated: true,
        });
      }, 300);
      
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, todayIndex]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  });

  return (
    <Animated.ScrollView
    ref={scrollViewRef}
    horizontal
    onScroll={onScroll}
    scrollEventThrottle={16}
    showsHorizontalScrollIndicator={false}
    style={styles.calendarContainer}
  >
    {dates.map((date, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleDateChange(date.format('YYYY-MM-DD'))}
        style={[
          styles.calendarDay,
          selectedDate === date.format('YYYY-MM-DD') ? styles.selectedDay : null,
        ]}
      >
        <View style={[styles.dateCard, selectedDate === date.format('YYYY-MM-DD') ? { backgroundColor: '#4CAF50', borderRadius: 25 } : {}]}>
          <Text style={[
            styles.dayText,
            moment().format('YYYY-MM-DD') === date.format('YYYY-MM-DD') ? { color: 'green' } : {},
            selectedDate === date.format('YYYY-MM-DD') ? { color: 'white' } : {}
          ]}>
            {date.format('DD')}
          </Text>
          <Text style={[
            styles.weekDayText,
            moment().format('YYYY-MM-DD') === date.format('YYYY-MM-DD') ? { color: 'green' } : {},
            selectedDate === date.format('YYYY-MM-DD') ? { color: 'white' } : {}
          ]}>
            {date.format('ddd')}
          </Text>
          {selectedDate === date.format('YYYY-MM-DD') && <Text style={{ margin: 'auto', fontSize: 30, color: 'white' }}>.</Text>}
        </View>
      </TouchableOpacity>
    ))}
  </Animated.ScrollView>
  );
};


const dummyTasks: { [key: string]: any[] } = {
  '2024-10-07': [
    { id: 1, project: 'Project', task: 'Research process', time: '07:00 - 09:00', participants: 4 },
    { id: 2, project: 'Project', task: 'Moodboard Search', time: '09:00 - 12:00', participants: 4 },
    { id: 3, project: 'Project', task: 'Wireframing Design', time: '13:00 - 16:00', participants: 4 },
    { id: 4, project: 'Project', task: 'Landing Page', time: '19:00 - 21:00', participants: 4 },
    { id: 5, project: 'Project', task: 'Landing Page', time: '19:00 - 21:00', participants: 4 },
    { id: 6, project: 'Project', task: 'Landing Page', time: '19:00 - 21:00', participants: 4 },
  ],
  '2024-10-08': [
    { id: 1, project: 'Project', task: 'Client Meeting', time: '08:00 - 09:00', participants: 2 },
  ],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  dateCard: {
    padding: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthListContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3,
    shadowRadius: 3,
    position:'absolute',
    zIndex:2,
    right:100,
    top:100
  },
  yearListContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3,
    shadowRadius: 3,
    position:'absolute',
    zIndex:2,
    right:10,
    top:100,
  },
  monthText: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  taskCount: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  calendarContainer: {
    height: 120,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  calendarDay: {
    marginRight: 15,
    alignItems: 'center',
  },
  selectedDay: {
    // borderBottomWidth: 2,
    // borderBottomColor: '#24cc5e',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekDayText: {
    fontSize: 14,
    color: 'gray',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubTitle: {
    fontSize: 16,
    color: '#000',
  },
  cardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  cardParticipants: {
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    elevation: 5,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
});

export default TaskScreen;

import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import { router } from 'expo-router';

const ListTasks = () => {
  const tasks = [
    {
      title: 'Website Designing',
      date: '19 August 2024',
      time: '09:10 AM',
      progress: '9/20 Finished',
      logo: require('../../../assets/images/categories/Agreement.png'),
      label: 'Agreements'
    },
    {
      title: 'It Staff Landing Page',
      date: '19 August 2024',
      time: '08:10 AM',
      progress: '5/10 Finished',
      logo: require('../../../assets/images/categories/Deduction.png'),
      label: 'Interview Scheduling'
    },
    {
      title: 'Website Designing',
      date: '19 August 2024',
      time: '10:55 PM',
      progress: '9/20 Finished',
      logo: require('../../../assets/images/categories/Visa.png'),
      label: 'Visa Processing'
    },
    {
      title: 'It Staff Landing Page',
      date: '19 August 2024',
      time: '03:10 PM',
      progress: '5/10 Finished',
      logo: require('../../../assets/images/categories/Agreement.png'),
      label: 'Website'
    },
  ]
  return <>
    <FlatList data={tasks} renderItem={({ item: task, index }) => <>
    <TouchableOpacity activeOpacity={0.8} onPress={()=>router.navigate(`/(tabs)/tasks/${task.title}`)}>
      <View key={index} style={stylesTaskCards.card}>
        <View style={stylesTaskCards.logoContainer}>
          <View style={stylesTaskCards.logoBackground}>
            <Image source={task.logo} style={stylesTaskCards.logo} />
          </View>
        </View>

        <View style={stylesTaskCards.labelContainer}>
          <Text style={stylesTaskCards.labelText}>{task.label}</Text>
        </View>

       <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
        <Text style={stylesTaskCards.cardTitle}>{task.title}</Text>
        <View style={{flexDirection:'row',gap:10, marginTop:30}}>
          <TouchableOpacity  onPress={()=>router.navigate('/(tabs)')}>
        <MaterialIcons name="edit" size={15}  color={'green'} style={{padding:5}}/>
        </TouchableOpacity>

        <TouchableOpacity  onPress={()=>router.navigate('/(tabs)')}>
        <AntDesign name="delete" size={15} color={'red'}  style={{padding:5}}/>
        </TouchableOpacity>
        </View>
        </View>

        <View style={{flexDirection:'row',gap:10}}>
        <View style={{flexDirection:'row',gap:5, alignItems:'center'}}>
        <AntDesign name='calendar' color={'black'}/>
        <Text>{task.date}</Text>
        </View>

        <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
        <MaterialIcons name='access-time' color={'black'}/>
        <Text>{task.time}</Text>
        </View>
        </View>

        <View style={stylesTaskCards.progressContainer}>
          <View style={stylesTaskCards.progressBar}>
            <View style={[stylesTaskCards.progress, { width: '45%' }]} />
          </View>
          <Text>{task.progress}</Text>
        </View>



      </View>
      </TouchableOpacity>
    </>} style={stylesTaskCards.taskScroll}>

    </FlatList>
  </>
}

const stylesTaskCards = StyleSheet.create({
  taskScroll: {
    marginBottom: 30,
    marginHorizontal: 20,
    padding: 5,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginRight: 10,
    marginBottom: 10,
    width: '100%',
    elevation: 2,
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  logoBackground: {
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 5,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  labelContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  labelText: {
    fontSize: 12,
    color: '#333',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginRight: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
});



const TaskTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const underlinePosition = useRef(new AnimatedNative.Value(0)).current;

  const handleTabPress = (index: number) => {
      setSelectedTab(index);

      AnimatedNative.timing(underlinePosition, {
          toValue:index *100, 
          duration: 300,
          useNativeDriver: false,
      }).start();
  };

  return (
      <View>
          <View style={stylesTab.tabsContainer}>
              <TouchableOpacity onPress={() => handleTabPress(0)} style={stylesTab.tab}>
                  <Text style={[stylesTab.tabText, selectedTab === 0 && stylesTab.activeTabText]}>All Tasks</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleTabPress(1)} style={stylesTab.tab}>
                  <Text style={[stylesTab.tabText, selectedTab === 1 && stylesTab.activeTabText]}>Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleTabPress(2)} style={stylesTab.tab}>
                  <Text style={[stylesTab.tabText, selectedTab === 2 && stylesTab.activeTabText]}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleTabPress(3)} style={stylesTab.tab}>
                  <Text style={[stylesTab.tabText, selectedTab === 3 && stylesTab.activeTabText]}>In-Progress</Text>
              </TouchableOpacity>
          </View>

          <AnimatedNative.View
              style={[
                  stylesTab.underline,
                  {
                      left: underlinePosition, 
                  },
              ]}
          />
      </View>
  );
};

const stylesTab = StyleSheet.create({
  tabsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      marginTop:-25
  },
  tab: {
      flex: 1,
      alignItems: 'center',
  },
  tabText: {
      fontSize: 16,
      color: '#333',
  },
  activeTabText: {
      fontWeight: 'bold',
  },
  underline: {
      height: 3,
      width: 100, 
      backgroundColor: 'green',
      position: 'absolute',
      bottom: 0,
  },
});

