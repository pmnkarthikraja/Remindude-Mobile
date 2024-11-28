import { ThemedView } from '@/components/ThemedView';
import { useUser } from '@/components/userContext';
import { Colors } from '@/constants/Colors';
import { filterTasks, filterTasksCategory, Task } from '@/utils/task';
import { AntDesign, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Lottie from 'lottie-react-native';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, FlatList, ScrollView, StyleProp, StyleSheet, Text, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import FilterComponent, { Filters } from './FilterTasks';
import TaskTimer from './TaskTimer';
import { ThemedText } from './ThemedText';
import { useTimeElapseAnimation } from './TimeAnimationProvider';

const TaskPage: FunctionComponent = () => {
  const colorscheme = useColorScheme()
  const [isloading, setloading] = useState(false)
  const { loading, user, officeMode, tasks: contextTasks, setTasks: contextSetTasks } = useUser()
  const [tasks, setTasks] = useState(contextTasks)

  useEffect(() => {
    setTasks(contextTasks)
  }, [contextTasks, contextSetTasks])

  // const { data: formData, isLoading, error: getFormDataError, refetch } = useGetFormData();

  const { thisMonthTasks, thisWeekTasks, todayTasks, tomorrowTasks } = filterTasks(tasks)

  const linearGradientUnified = [
    colorscheme == 'light' ? '#a1c4fd' : '#252C39',
    colorscheme == 'light' ? 'white' : 'transparent']


  if (isloading || loading ) {
    return (
      <LinearGradient
        colors={linearGradientUnified}
        style={{ flex: 1 }}>
        <Lottie
          source={require('../assets/Animation/Animation -loading1.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      </LinearGradient>
    );
  }

  const handleFilters = (filters: Filters) => {
    const filtered = filterTasksCategory(contextTasks, filters)
    setTasks(filtered);
  };

  return <ScrollView style={styles.container} showsVerticalScrollIndicator>
    <View style={styles.caution}>
      <Ionicons name='alert-circle' size={21} color={'yellow'} />
      <ThemedText style={{ color: 'grey' }}>You have {todayTasks.length} tasks due today</ThemedText>
    </View>


    <FilterComponent onApplyFilters={handleFilters} onSearch={(text) => { console.log("searching...", text) }} />
    <View style={{ height: 20 }} />


    <CurrentDate />
    <TaskCards tasks={todayTasks} />
    <TaskCarousel1 tasks={tasks} />
    <View style={{ height: 20 }}></View>

    <AllTasks title='Tomorrow' taskCount={tomorrowTasks.length} />
    <AllTasks title='This Week' taskCount={thisWeekTasks.length} />
    <AllTasks title='This Month' taskCount={thisMonthTasks.length} />
    <View style={{ height: 100 }}></View>
  </ScrollView>
}

export default TaskPage


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  caution: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 10
  },
  loadingAnimation: {
    flex: 1,
    justifyContent: 'center',
    width: 'auto',
    height: 150
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent'
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    // elevation: 5,
  },
  filterButton: {
    marginLeft: 10,
    // backgroundColor: '#4CAF50',
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 10,
  },
  animation_no_data: {
    width: 'auto',
    height: 100,
    // marginLeft: 100,
    marginTop: -80
    // flex:1
  }
});

const CurrentDate = () => {
  const date = new Date().toDateString();
  const colorscheme = useColorScheme()

  return (
    <ThemedView style={stylesCurrentDate.dateContainer}>
      <ThemedText style={stylesCurrentDate.todayText}>Today Tasks/Meetings</ThemedText>
      {/* <Switch /> */}
      <ThemedView style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'transparent' }}>
        <TouchableOpacity onPress={() => router.navigate('/calendar')}>
          <Ionicons name='calendar-number-outline' size={24} color={colorscheme == 'light' ? 'black' : 'white'} />
        </TouchableOpacity>
        <ThemedText>{date}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const stylesCurrentDate = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: 'transparent'
  },

  todayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

interface TaskCardsProps {
  tasks: Task[]
}

const TaskCards: FunctionComponent<TaskCardsProps> = ({
  tasks
}) => {
  const colorscheme = useColorScheme()
  const iconName = useTimeElapseAnimation()

  const linearGradientColor = colorscheme == 'light' ? [Colors.light.tint, Colors.light.background] :
    [Colors.light.tint, Colors.dark.background]

  const priorityColor = colorscheme == 'light' ? {
    Urgent: '#FCECEF',
    Moderate: '#F1ECFA',
    Normal: '#E6F7F7'
  } : {
    Urgent: '#CF3F6C',
    Moderate: '#703FC7',
    Normal: '#22A79F'
  }

  return (
    <>
      {tasks.length > 0 &&

        <View style={{ flexDirection: 'column', alignItems: tasks.length == 1 ? 'center' : 'stretch' }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={stylesTaskCards.taskScroll}>
            {tasks.map((task, index) => {
              const difference = task.datetime.getTime() - new Date().getTime();

              //calculate progress percentage
              const totalsubtasks = task.subTasks?.length || 0
              const completed = task.subTasks?.filter(check => check.isCompleted).length || 0
              const progressPercentage = (completed / totalsubtasks) * 100

              return (
                <TouchableOpacity onPress={() => router.navigate(`/(tabs)/category/task/${task.taskId}`)}
                  activeOpacity={0.8}
                  key={index}
                >
                  <View key={index} style={[stylesTaskCards.card, colorscheme == 'light' ? { backgroundColor: '#fff' } : { backgroundColor: 'transparent' }]}>
                    <View style={stylesTaskCards.logoContainer}>
                      <View style={stylesTaskCards.logoBackground}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <ThemedText>{task.status}</ThemedText>
                          {task.status == 'Completed' && <MaterialIcons name='check' color={'green'} size={20} />}
                          {task.status == 'In-Progress' && <MaterialCommunityIcons name='progress-clock' color={'green'} size={20} />}
                          {task.status == 'Pending' && <Ionicons name='pause-circle-outline' color={'orange'} size={20} />}

                        </View>
                      </View>
                    </View>

                    <Svg
                      height="160"
                      width="250"
                      style={{
                        position: 'absolute',
                        borderRadius: 20,
                        bottom: 0,
                        opacity: 0.3,
                      }}
                    >
                      <Path
                        d="M0,100 C150,200 250,0 400,100 L400,200 L0,200 Z"
                        fill={colorscheme == 'light' ? "blue" : '#CCE3F3'}
                      />
                    </Svg>

                    <Svg
                      height="200"
                      width="250"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        opacity: 0.15,
                      }}
                    >
                      <Path
                        d="M0,50 C100,150 300,-50 400,50 L400,200 L0,200 Z"
                        fill={colorscheme == 'light' ? "purple" : 'transparent'}
                      />
                    </Svg>

                    <View style={[stylesTaskCards.labelContainer,
                    task.priority == 'Moderate' ?
                      { backgroundColor: priorityColor.Moderate } : task.priority == 'Urgent' ?
                        { backgroundColor: priorityColor.Urgent } : { backgroundColor: priorityColor.Normal }]}>
                      <ThemedText style={stylesTaskCards.labelText}>{task.priority}</ThemedText>
                    </View>

                    <ThemedText style={stylesTaskCards.cardTitle}>{task.title}</ThemedText>
                    {/* <ThemedText>{task.datetime.toLocaleString()}</ThemedText> */}
                    <View style={{ flexDirection: 'row', gap: 10 }}>


                      <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                        <MaterialIcons name='access-time' color={colorscheme == 'light' ? 'black' : 'white'} />
                        <ThemedText>{task.datetime.toLocaleTimeString()}</ThemedText>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Animated.View>
                          <MaterialCommunityIcons 
                          name={iconName} size={13} color={difference > 0 ? 'green' : 'red'} />
                        </Animated.View>
                        <TaskTimer task={task} />
                      </View>

                    </View>

                    <View style={stylesTaskCards.progressContainer}>
                      <View style={stylesTaskCards.progressBar}>
                        <View style={[stylesTaskCards.progress,
                        { width: `${progressPercentage}%` }
                        ]} />
                      </View>
                      {task.subTasks && task.subTasks.length > 0 && (
                        <ThemedText>
                          {`${task.subTasks.filter(subTask => subTask.isCompleted).length}/${task.subTasks.length} Check's`}
                        </ThemedText>
                      )}
                      {task.subTasks && task.subTasks.length == 0 && (<ThemedText>No Check's</ThemedText>)}

                    </View>
                  </View>
                </TouchableOpacity>
              )
            }
            )}

          </ScrollView>

          <TouchableOpacity onPress={() => router.navigate('/(tabs)/tasks')}
            style={{
              flexDirection: 'row', justifyContent: 'flex-end',
              alignItems: 'center', gap: 5, marginTop: -40, marginBottom: 10,
            }} >
            <ThemedText style={{ padding: 7, borderRadius: 20 }}>See All
              <AntDesign name='right' color={colorscheme == 'light' ? 'black' : 'white'} />
            </ThemedText>
          </TouchableOpacity>
        </View>}

      {tasks.length == 0 && <>
        <View style={{ flexDirection: 'column', alignItems: 'center', borderRadius: 10 }}>
          <LinearGradient colors={linearGradientColor} style={{ borderRadius: 20, marginBottom: 20 }}>
            <View style={[stylesTaskCards.card, { height: 100 }]}>
              <View style={stylesTaskCards.logoBackground}>
                <ThemedText style={{ fontWeight: '400', fontSize: 18, color: 'white', textAlign: 'center' }}>No Tasks Today</ThemedText>
              </View>
            </View>
            <Lottie
              source={require('../assets/Animation/Animation-no_data.json')}
              autoPlay
              loop
              style={styles.animation_no_data}
            />
          </LinearGradient>
        </View>
      </>}
    </>
  );
};

const stylesTaskCards = StyleSheet.create({
  taskScroll: {
    marginBottom: 30,
    marginHorizontal: 5,
    padding: 5,
    backgroundColor: 'transparent',
  },
  card: {
    // backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginRight: 10,
    marginBottom: 10,
    width: 250,
    // elevation: 2,
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  logoBackground: {
    // backgroundColor: '#f0f0f0',
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
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '400',
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

interface AllTasksProps {
  title: string,
  taskCount: number
}

const AllTasks: FunctionComponent<AllTasksProps> = ({
  title,
  taskCount
}) => {
  const colorscheme = useColorScheme()
  const iconColor = colorscheme == 'light' ? 'black' : 'white'
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);


  return (
    <ThemedView style={stylesAllTasks.allTasksContainer}>
      <View style={stylesCurrentDate.dateContainer}>
        <ThemedText style={stylesCurrentDate.todayText}>{title}</ThemedText>
        {title == 'Tomorrow' &&
          <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <TouchableOpacity>
              <Ionicons name='calendar-number-outline' size={24} color={iconColor} />
            </TouchableOpacity>
            <ThemedText>{tomorrow.toLocaleDateString()}</ThemedText>
          </View>}
        {title == 'This Week' &&
          <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <TouchableOpacity>
              <Ionicons name='calendar-number-outline' size={24} color={iconColor} />
            </TouchableOpacity>
            <ThemedText>{`(${firstDayOfWeek.toLocaleDateString()} - ${lastDayOfWeek.toLocaleDateString()})`}</ThemedText>
          </View>}
        {title == 'This Month' &&
          <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <TouchableOpacity>
              <Ionicons name='calendar-number-outline' size={24} color={iconColor} />
            </TouchableOpacity>
            <ThemedText>{`(${firstDayOfMonth.toLocaleDateString()} - ${lastDayOfMonth.toLocaleDateString()})`}</ThemedText>
          </View>}
      </View>
      <View style={stylesAllTasks.taskRow}>
        <ThemedText style={{ marginLeft: 17 }}>{taskCount} Tasks</ThemedText>
        <Ionicons name="arrow-forward-outline" size={24} color={iconColor} />
      </View>
    </ThemedView>
  );
};

const stylesAllTasks = StyleSheet.create({
  allTasksContainer: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 10,
    elevation: 3,
    marginVertical: 5
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const tasks = {
  urgent: [
    { id: '1', name: 'Submit Project Report', status: 'inProgress' },
    { id: '2', name: 'Client Meeting Preparation', status: 'done' },
  ],
  moderate: [
    { id: '3', name: 'Code Review', status: 'inProgress' },
    { id: '4', name: 'Team Standup', status: 'done' },
  ],
  normal: [
    { id: '5', name: 'Update Documentation', status: 'done' },
    { id: '6', name: 'Fix Minor Bugs', status: 'inProgress' },
  ],
  yesterday: [
    { id: '7', name: 'Finish Design Mockups', status: 'done' },
    { id: '8', name: 'Email Client for Feedback', status: 'inProgress' },
  ],
  tomorrow: [
    { id: '9', name: 'Plan Sprint Meeting', status: 'inProgress' },
    { id: '10', name: 'Prepare for Presentation', status: 'inProgress' },
  ],
  thisWeek: [
    { id: '11', name: 'Deploy New Version', status: 'done' },
    { id: '12', name: 'Optimize Database', status: 'inProgress' },
  ],
  thisMonth: [
    { id: '13', name: 'Organize Team Workshop', status: 'inProgress' },
    { id: '14', name: 'Refactor Codebase', status: 'inProgress' },
  ],
};

const { width: screenWidth } = Dimensions.get('window');

const categories = [
  { category: 'Urgent', tasks: 10, completed: 7 },
  { category: 'Moderate', tasks: 8, completed: 5 },
  { category: 'Normal', tasks: 12, completed: 6 },
  { category: 'Yesterday', tasks: 9, completed: 9 },
  { category: 'Tomorrow', tasks: 5, completed: 1 },
  { category: 'This Week', tasks: 15, completed: 10 },
  { category: 'This Month', tasks: 20, completed: 12 },
];


const TaskCarousel = () => {
  const translateX = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(translateX.value) }],
    };
  });

  const handleScroll = (event: any) => {
    translateX.value = -event.nativeEvent.contentOffset.x;
  };

  return (
    <ScrollView
      horizontal
      onScroll={handleScroll}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={10}
    >
      {categories.map((item, index) => (
        <View key={index} style={stylesTaskComponent.card}>
          <ThemedText style={stylesTaskComponent.title}>{item.category}</ThemedText>
          <ThemedText style={stylesTaskComponent.analytics}>
            {item.completed}/{item.tasks} Tasks Completed
          </ThemedText>
        </View>
      ))}
    </ScrollView>
  );
};

const stylesTaskComponent = StyleSheet.create({
  card: {
    width: screenWidth * 0.8,
    height: 200,
    marginHorizontal: 10,
    marginVertical: 20,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  analytics: {
    fontSize: 16,
    color: '#555',
  },
});



interface AnimatedCountProps {
  finalCount: number,
  textcolor: string
}

const AnimatedCount: FunctionComponent<AnimatedCountProps> = ({ finalCount, textcolor }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: finalCount,
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    animatedValue.addListener((v) => {
      setDisplayCount(Math.round(v.value));
    });

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [finalCount]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 5, marginTop: 7 }}>
      <Text style={[stylesNew.count, { color: textcolor }]}>
        {displayCount}
      </Text>
      <Text style={{ color: textcolor }}>Tasks</Text>
    </View>
  );
};


interface TaskCarouselProps {
  tasks: Task[]
}
const TaskCarousel1: FunctionComponent<TaskCarouselProps> = ({
  tasks
}) => {
  const colorscheme = useColorScheme()
  const borderOnDarkMode = (borderColor: string): StyleProp<ViewStyle> => colorscheme == 'dark' ? {
    borderStyle: 'solid',
    borderWidth: 0.7,
    borderColor: borderColor
  } : {}
  const { urgent, moderate, normal } = tasks.reduce(
    (prev, curr) => {
      if (curr.priority === 'Urgent') {
        prev.urgent += 1;
      } else if (curr.priority === 'Moderate') {
        prev.moderate += 1;
      } else if (curr.priority === 'Normal') {
        prev.normal += 1;
      }
      return prev;
    },
    { urgent: 0, moderate: 0, normal: 0 }
  );

  const testTasks = [
    {
      id: 1,
      category: 'Urgent',
      count: urgent,
      color: colorscheme == 'light' ? '#FCECEF' : 'transparent', //#FCECEF   //text: #CF3F6C  //old: #FFCDD2
      textcolor: '#CF3F6C'
    },
    {
      id: 2,
      category: 'Moderate',
      count: moderate,
      color: colorscheme == 'light' ? '#F1ECFA' : 'transparent', //#F1ECFA  //text: #703FC7   //old: #D1C4E9
      textcolor: '#703FC7'
    },
    {
      id: 3,
      category: 'Normal',
      count: normal,
      color: colorscheme == 'light' ? '#E6F7F7' : 'transparent', //#E6F7F7  //text: #22A79F  //old: #F0F4C3
      textcolor: '#22A79F'
    },
  ];

  const renderItem = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.8}>
      <View style={[stylesNew.card, borderOnDarkMode(item.textcolor), { backgroundColor: item.color }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', gap: 5 }}>
          {item.category == 'Urgent' && <Feather name='alert-circle' size={15} color={item.textcolor} />}
          {item.category == 'Moderate' && <Feather name='clock' size={15} color={item.textcolor} />}
          {item.category == 'Normal' && <MaterialCommunityIcons name='dots-horizontal' size={15} color={item.textcolor} />}
          <Text style={[stylesNew.title, { color: item.textcolor }]}>{item.category}</Text>
        </View>

        <AnimatedCount finalCount={item.count} textcolor={item.textcolor} />

      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={testTasks}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      horizontal

      showsHorizontalScrollIndicator={false}
    />
  );
};

const stylesNew = StyleSheet.create({
  card: {
    // width: screenWidth / 3.5,
    // minWidth:screenWidth/3.7,
    height: 110,
    marginHorizontal: 10,
    borderRadius: 15,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    // marginBottom: 10,
  },
  count: {
    fontSize: 36,
    fontWeight: '600',
  },
  taskContainer: {
    // marginTop: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  dueDate: {
    fontSize: 14,
    color: '#fff',
  },
  progressBar: {
    marginTop: 5,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#fff', // White background for progress bar
  },
  status: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

