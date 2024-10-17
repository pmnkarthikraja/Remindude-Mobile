import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated as AnimatedNative, FlatList, Platform, StyleProp, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

const TaskScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const {tasks:contextTasks,setTasks:setcontexttasks} =useUser()
  const [tasks,setTasks]=useState<Task[]>(contextTasks)
  const [isMonthListVisible, setMonthListVisible] = useState(false);
  const [isYearListVisible, setYearListVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
  const [selectedTab, setSelectedTab] = useState(0);
  const colorscheme = useColorScheme()

  useEffect(()=>{
    setTasks(contextTasks)
  },[contextTasks])

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

  function searchItem(text: string, searchText: string): boolean {
    return text.toLowerCase().includes(searchText.toLowerCase())
  }

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
  };

  const filterTasks = () => {
    let dateFilteredTasks = contextTasks.filter(task => formatDate(task.datetime) === selectedDate);

    switch (selectedTab) {
      case 0:
        return dateFilteredTasks;    
      case 1:
        return dateFilteredTasks.filter(task => task.status === 'Pending');   
      case 2:
        return dateFilteredTasks.filter(task => task.status === 'Completed');  
      case 3:
        return dateFilteredTasks.filter(task => task.status === 'In-Progress');
      default:
        return [];
    }
  };

  const handleSearch = (text: string) => {
    const payload= filterTasks().filter(item => {
      return searchItem(item.title, text) || searchItem(item.kind ,text) || searchItem(item.priority,text) || searchItem(item.status,text)
     })
     setTasks(payload)
 }


 const handleFilters = (filters:Filters) => {
  
 }

  const getDatesForSelectedMonth = useCallback((tasks: Task[]) => {
    const startOfMonth = moment(selectedDate).startOf('month');
    const endOfMonth = moment(selectedDate).endOf('month');
  
    const dates = [];
    for (let date = startOfMonth; date.isBefore(endOfMonth) || date.isSame(endOfMonth); date.add(1, 'day')) {
      const formattedDate = date.format('YYYY-MM-DD'); 
      const isExist = tasks.some(task => {
        return moment(task.datetime).format('YYYY-MM-DD') === formattedDate}); 
  
      dates.push({ date: date.clone(), isExist });
    }
  
    return dates; 
  }, [selectedDate]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const iconColor = colorscheme=='light'?'black':'white'

  const linearGradientUnified = [
    colorscheme == 'light' ? '#a1c4fd' : '#252C39',
    colorscheme == 'light' ? 'white' : 'transparent']

    const handleTaskDelete = async (id:string)=>{
        setcontexttasks(items => {return items.filter(item=>item.taskId !== id)})
        setTasks(items => items.filter(item=>item.taskId !== id))
        await AsyncStorage.setItem('tasks',JSON.stringify(contextTasks))
    }

  return (
    <LinearGradient
      colors={linearGradientUnified}
      style={{ flex: 1 }}>
      <View style={{ height: 50 }}></View>

      <View style={styles.header}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <ThemedText style={styles.dateText}>{moment(selectedDate).format('DD MMM Y')}</ThemedText>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <ThemedText>{selectedMonth}</ThemedText>
              <TouchableOpacity onPress={toggleMonthList}>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={iconColor} />
              </TouchableOpacity>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <ThemedText>{selectedYear}</ThemedText>
              <TouchableOpacity onPress={toggleYearList}>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={iconColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {isMonthListVisible && (
        <View style={styles.monthListContainer}>
          <FlatList
            data={months}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectMonth(item)}>
                <ThemedText style={styles.monthText}>{item}</ThemedText>
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
                <ThemedText style={styles.monthText}>{item}</ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <FilterComponent onApplyFilters={(filters)=>{console.log("filters: ",filters)}}  onSearch={handleSearch}/>

      <RenderCalender getDatesForSelectedMonth={()=>getDatesForSelectedMonth(tasks)}
        handleDateChange={handleDateChange} selectedDate={selectedDate} tasks={tasks}/>

      <TaskTabs onChangeTab={(tab)=>{setSelectedTab(tab)}}/>

      <ListTasks tab={selectedTab} selectedDate={selectedDate} tasks={tasks} handleOnDelete={handleTaskDelete}/>
      {Platform.OS == 'android' && <View style={{ height: 60 }}></View>}

    </LinearGradient>
  );
};


interface RenderCalenderProps {
  getDatesForSelectedMonth: () => {isExist:boolean,date:moment.Moment}[],
  handleDateChange: (date: string) => void,
  selectedDate: string,
  tasks:Task[]
}

const RenderCalender: FunctionComponent<RenderCalenderProps> = ({
  getDatesForSelectedMonth,
  handleDateChange,
  selectedDate,
  tasks
}) => {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const dates = getDatesForSelectedMonth();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const todayIndex = dates.findIndex(date => date.date.isSame(moment(), 'day'));

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
          onPress={() => handleDateChange(date.date.format('YYYY-MM-DD'))}
          style={[
            styles.calendarDay,
            selectedDate === date.date.format('YYYY-MM-DD') ? styles.selectedDay : null,
          ]}
        >
          <View style={[styles.dateCard, selectedDate === date.date.format('YYYY-MM-DD') ?
            { backgroundColor: Colors.light.tint, borderRadius: 25 } : {}
          ]}>
            <ThemedText style={[
              styles.dayText,
              moment().format('YYYY-MM-DD') === date.date.format('YYYY-MM-DD') ? { color: 'green' } : {},
              selectedDate === date.date.format('YYYY-MM-DD') ? { color: 'white' } : {}
            ]}>
              {date.date.format('DD')}
            </ThemedText>
            <ThemedText style={[
              styles.weekDayText,
              moment().format('YYYY-MM-DD') === date.date.format('YYYY-MM-DD') ? { color: 'green' } : {},
              selectedDate === date.date.format('YYYY-MM-DD') ? { color: 'white' } : {}
            ]}>
              {date.date.format('ddd')}
            </ThemedText>
            {selectedDate === date.date.format('YYYY-MM-DD') && <ThemedText style={{ margin: 'auto', fontSize: 30, color: 'white' }}>.</ThemedText>}
            {(date.isExist && selectedDate!==date.date.format('YYYY-MM-DD')) && <ThemedText style={{ margin: 'auto', fontSize: 40, color:'orange' }}>.</ThemedText>}
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
    alignItems: 'center'
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
    position: 'absolute',
    zIndex: 2,
    right: 100,
    top: 100
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
    position: 'absolute',
    zIndex: 2,
    right: 10,
    top: 100,
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
    maxHeight: 100,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  calendarDay: {
    marginRight: 15,
    alignItems: 'center',
  },
  selectedDay: {
    borderBottomWidth: 2,
    borderBottomColor: '#24cc5e',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekDayText: {
    fontSize: 14,
    color: 'gray',
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
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 10,
  },
  animation_no_data: {
    width: 'auto',
    height: 250,
    flex: 1
  }
});

export default TaskScreen;

import { ThemedText } from '@/components/ThemedText';
import { useUser } from '@/components/userContext';
import { Colors } from '@/constants/Colors';
import { Task } from '@/utils/task';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Lottie from 'lottie-react-native';
import FilterComponent, { Filters } from '@/components/FilterTasks';

interface ListTasksProps{
  tab:number,
  selectedDate:string    //YYY-MM-DD
  tasks:Task[],
  handleOnDelete:(id:string)=>void
}

const ListTasks:FunctionComponent<ListTasksProps> = ({
  tab,
  selectedDate,
  tasks,
  handleOnDelete
}) => {
  const colorscheme = useColorScheme()
  const iconColor = colorscheme=='light'?'black':'white'

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; 
  };

  const filterTasks = () => {
    let dateFilteredTasks = tasks.filter(task => formatDate(task.datetime) === selectedDate);

    switch (tab) {
      case 0:
        return dateFilteredTasks;    
      case 1:
        return dateFilteredTasks.filter(task => task.status === 'Pending');   
      case 2:
        return dateFilteredTasks.filter(task => task.status === 'Completed');  
      case 3:
        return dateFilteredTasks.filter(task => task.status === 'In-Progress');
      default:
        return [];
    }
  };

    const cardBorderOnDark :StyleProp<ViewStyle> = colorscheme=='dark' ? {
   borderWidth:0.5,
    borderStyle:'solid',
    borderColor:'grey',
    }:{}

  return <>
    {filterTasks().length > 0 && <FlatList data={filterTasks()} renderItem={({ item: task, index }) => <>
      <TouchableOpacity activeOpacity={0.9} onPress={() => router.navigate(`/(tabs)/tasks/${task.taskId}`)}>
        <View key={index} style={[stylesTaskCards.card,cardBorderOnDark, colorscheme=='light'?{backgroundColor:'white'}:{}]}>
          <View style={stylesTaskCards.logoContainer}>
            <View style={stylesTaskCards.logoBackground}>
              {/* <Image source={task.logo} style={stylesTaskCards.logo} /> */}
              <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
              <ThemedText >{task.status}</ThemedText>
              {task.status=='Completed' && <MaterialIcons name='check' color={'green'} size={20}/>}
              {task.status == 'In-Progress' && <MaterialCommunityIcons name='progress-clock' color={'green'} size={20} />}
              {task.status == 'Pending' && <Ionicons name='pause-circle-outline' color={'orange'} size={20} />}
              </View>
            </View>
          </View>

          <View style={[stylesTaskCards.labelContainer,
          task.priority == 'Moderate' ?
            { backgroundColor: '#D1C4E9' } : task.priority == 'Urgent' ?
              { backgroundColor: '#FFCDD2' } : { backgroundColor: '#F0F4C3' }]}>
            <ThemedText style={stylesTaskCards.labelText}>{task.priority}</ThemedText>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

            <ThemedText style={stylesTaskCards.cardTitle}>{task.title}</ThemedText>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 30 }}>
              <TouchableOpacity onPress={() => router.navigate(`/(tabs)/tasks/${task.taskId}`)}>
                <MaterialIcons name="edit" size={15} color={'green'} style={{ padding: 5 }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Alert.alert("Confirm Delete?", "Do you want to delete it?", [
                {
                  text: 'confirm',
                  onPress:  () => {
                    // const filtered = contextTasks.filter(it=>it.taskId!=task.taskId)
                    // await AsyncStorage.setItem('tasks',JSON.stringify(filtered))
                    // setTasks(r=>{return r.filter(it=>it.taskId!=task.taskId)})
                    handleOnDelete(task.taskId)
                  },
                },
                {
                  text: 'cancel',
                  onPress:()=>{},
          
                }
              ],{
                cancelable:true
              })}>
                <AntDesign name="delete" size={15} color={'red'} style={{ padding: 5 }} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
              <AntDesign name='calendar' color={iconColor} />
              <ThemedText>{task.datetime.toLocaleDateString()}</ThemedText>
            </View>

            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
              <MaterialIcons name='access-time' color={iconColor} />
              <ThemedText>{task.datetime.toLocaleTimeString()}</ThemedText>
            </View>
          </View>

          <View style={stylesTaskCards.progressContainer}>
            <View style={stylesTaskCards.progressBar}>
              <View style={[stylesTaskCards.progress, { width: '45%' }]} />
            </View>
            <ThemedText>{`${task.subTasks?.length || 0} Checklists`}</ThemedText>
          </View>



        </View>
      </TouchableOpacity>
    </>} style={stylesTaskCards.taskScroll}>

    </FlatList>}
    {filterTasks().length == 0 &&
      <Lottie
        source={require('../../../assets/Animation/Animation-no_data.json')}
        autoPlay
        loop
        style={styles.animation_no_data}
      />}
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


interface TaskTabsProps{
  onChangeTab:(tab:number)=>void
}

const TaskTabs:FunctionComponent<TaskTabsProps> = ({
  onChangeTab
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const underlinePosition = useRef(new AnimatedNative.Value(0)).current;

  useEffect(()=>{
    onChangeTab(selectedTab)
  },[selectedTab])

  const handleTabPress = (index: number) => {
    setSelectedTab(index);

    AnimatedNative.timing(underlinePosition, {
      toValue: index * 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={{marginBottom:15}}>
      <View style={stylesTab.tabsContainer}>
        <TouchableOpacity onPress={() => handleTabPress(0)} style={stylesTab.tab}>
          <ThemedText style={[stylesTab.tabText, selectedTab === 0 && stylesTab.activeTabText]}>All Tasks</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress(1)} style={stylesTab.tab}>
          <ThemedText style={[stylesTab.tabText, selectedTab === 1 && stylesTab.activeTabText]}>Pending</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress(2)} style={stylesTab.tab}>
          <ThemedText style={[stylesTab.tabText, selectedTab === 2 && stylesTab.activeTabText]}>Completed</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress(3)} style={stylesTab.tab}>
          <ThemedText style={[stylesTab.tabText, selectedTab === 3 && stylesTab.activeTabText]}>In-Progress</ThemedText>
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
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
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

