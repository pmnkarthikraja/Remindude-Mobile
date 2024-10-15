import { Alert, Animated, Dimensions, Easing, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import Lottie from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useUser } from '@/components/userContext';
import { useGetFormData } from '@/hooks/formDataHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';
import { ThemedText } from './ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';
import 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Switch } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


const TaskPage: FunctionComponent = () => {
  const colorscheme = useColorScheme()
  const [isloading, setloading] = useState(false)
  const { loading, user, officeMode } = useUser()
  const { data: formData, isLoading, error: getFormDataError, refetch } = useGetFormData();
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation()
  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     if (state.isConnected != null) {
  //       setIsConnected(state.isConnected);
  //       refetch()
  //       if (!state.isConnected) {
  //         Alert.alert('No Internet Connection', 'You are currently offline.');
  //       }
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [navigation]);


  // useEffect(() => {
  //   const checkPermissions = async () => {
  //     const hasRequested = await AsyncStorage.getItem('notificationPermissionsRequested');
  //     if (!hasRequested) {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       await AsyncStorage.setItem('notificationPermissionsRequested', 'true');
  //       await AsyncStorage.setItem('notificationPermissionsStatus', status === 'granted' ? 'true' : 'false');
  //     }
  //   };

  //   checkPermissions();

  //   const subscription = Notifications.addNotificationReceivedListener(
  //     notification => {
  //       console.log('Notification received:', notification.request.identifier);
  //     }
  //   );
  //   setloading(false)

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  // useEffect(() => {
  //   const doRefetch = async () => {
  //     await refetch()
  //   }
  //   if (user) {
  //     setloading(true)
  //     doRefetch()
  //     setloading(false)
  //   }
  // }, [user]);

  const linearGradientUnified = [
    colorscheme == 'light' ? '#a1c4fd' : '#252C39',
    colorscheme == 'light' ? 'white' : 'transparent']


  if (isloading || isLoading || loading || formData == undefined) {
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

  return <ScrollView style={styles.container} showsVerticalScrollIndicator>
    <ThemedText style={{ paddingLeft: 15, color: '#969696' }}>you have 4 tasks due today</ThemedText>

    <ThemedView style={styles.searchContainer}>
      <TextInput style={[styles.searchInput, colorscheme=='light'?{color:'black',backgroundColor:'white'}:{color:'white', backgroundColor:'black'}]} placeholder="Search"  />
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="options-outline" size={24} color="white" />
      </TouchableOpacity>
    </ThemedView>

    <CurrentDate />
    <TaskCards />
    <TaskCarousel1/>
    <View style={{height:20}}></View>

    <AllTasks title='Tomorrow'/>
    <AllTasks title='This Week' />
    <AllTasks title='This Month'/>
    <View style={{height:100}}></View>
  </ScrollView>
}

export default TaskPage


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor:'transparent'
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
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

const CurrentDate = () => {
  const date = new Date().toDateString();
  const colorscheme= useColorScheme()

  return (
    <ThemedView style={stylesCurrentDate.dateContainer}>
      <ThemedText style={stylesCurrentDate.todayText}>Today Tasks</ThemedText>
      <Switch />
      <ThemedView style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor:'transparent' }}>
        <TouchableOpacity onPress={()=>router.navigate('/calendar')}>
          <Ionicons name='calendar-number-outline' size={24} color={colorscheme=='light' ? 'black':'white'}/>
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
    backgroundColor:'transparent'
  },

  todayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const TaskCards = () => {
  const colorscheme = useColorScheme()
  const tasks = [
    {
      title: 'Website Designing',
      date: '19 August 2024',
      progress: 'In 1 hour',
      logo: 'https://example.com/logo1.png',
      label: 'Agreements'
    },
    {
      title: 'It Staff Landing Page',
      date: '19 August 2024',
      progress: '5/10 Finished',
      logo: 'https://example.com/logo2.png',
      label: 'Interview Scheduling'
    },
    {
      title: 'Website Designing',
      date: '19 August 2024',
      progress: '9/20 Finished',
      logo: 'https://example.com/logo1.png',
      label: 'Visa Processing'
    },
    {
      title: 'It Staff Landing Page',
      date: '19 August 2024',
      progress: '5/10 Finished',
      logo: 'https://example.com/logo2.png',
      label: 'Website'
    },
  ]

  return (
    <>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={stylesTaskCards.taskScroll}>
      {tasks.map((task, index) => (
        <TouchableOpacity onPress={()=>router.navigate(`/(tabs)/category/task/${task.title}`)} activeOpacity={0.8} 
        key={index}
        >
        <View key={index} style={[stylesTaskCards.card, colorscheme=='light'?{backgroundColor:'#fff'}:{backgroundColor:'transparent'}]}>
          <View style={stylesTaskCards.logoContainer}>
            <View style={stylesTaskCards.logoBackground}>
              <Image source={{ uri: task.logo }} style={stylesTaskCards.logo} />
            </View>
          </View>

          <Svg
          height="160"
          width="250"
          style={{
            position: 'absolute',
            // top: 35,
            // right: 0,
            borderRadius:20,
            bottom:0,
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


          <View style={stylesTaskCards.labelContainer}>
            <ThemedText style={stylesTaskCards.labelText}>{task.label}</ThemedText>
          </View>

          <ThemedText style={stylesTaskCards.cardTitle}>{task.title}</ThemedText>
          <ThemedText>{task.date}</ThemedText>

          <View style={stylesTaskCards.progressContainer}>
            <View style={stylesTaskCards.progressBar}>
              <View style={[stylesTaskCards.progress, { width: '45%' }]} />
            </View>
            <ThemedText>{task.progress}</ThemedText>
          </View>
        </View>
        </TouchableOpacity>
      ))}
    </ScrollView>

   <TouchableOpacity onPress={()=>router.navigate('/(tabs)/tasks')} style={{position:'absolute',right:10,top:'34%',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:5}}>
    <ThemedText >See All</ThemedText>
    <AntDesign  name='right' color={colorscheme=='light'?'black':'white'}/>
    </TouchableOpacity>
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
    fontWeight:'400',
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

interface AllTasksProps{
  title:string
}

const AllTasks:FunctionComponent<AllTasksProps> = ({
  title
}) => {
  return (
    <View style={stylesAllTasks.allTasksContainer}>
      <View style={stylesCurrentDate.dateContainer}>
      <Text style={stylesCurrentDate.todayText}>{title}</Text>
     {title=='Tomorrow' && <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <TouchableOpacity>
          <Ionicons name='calendar-number-outline' size={24} color="black" />
        </TouchableOpacity>
        <Text>{new Date().toLocaleDateString()}</Text>
      </View>}
    </View>
      <View style={stylesAllTasks.taskRow}>
        <Text style={{marginLeft:17}}>10 Tasks</Text>
        <Ionicons name="arrow-forward-outline" size={24} color="black" />
      </View>
    </View>
  );
};

const stylesAllTasks = StyleSheet.create({
  allTasksContainer: {
    borderRadius: 20,
    backgroundColor: '#fff',
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

  const handleScroll = (event:any) => {
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
          <Text style={stylesTaskComponent.title}>{item.category}</Text>
          <Text style={stylesTaskComponent.analytics}>
            {item.completed}/{item.tasks} Tasks Completed
          </Text>
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
    marginVertical:20,
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


const testTasks = [
  {
    id: 1,
    category: 'Urgent',
    tasks: [
      { title: 'Submit report', dueDate: '2024-10-12', status: 'In progress', progress: 0.4, count:3 },
    ],
    color: '#F0F4C3', 
  },
  {
    id: 2,
    category: 'Moderate',
    tasks: [
      { title: 'Review code', dueDate: '2024-10-15', status: 'In progress', progress: 0.6, count:1 },
    ],
    color: '#FFCDD2', 
  },
  {
    id: 3,
    category: 'Normal',
    tasks: [
      { title: 'Write documentation', dueDate: '2024-10-17', status: 'Not started', progress: 0.0,count:2 },
    ],
    color: '#D1C4E9', 
  },
];


const AnimatedCount = ({ finalCount }:any) => {
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
    <Text style={[stylesNew.title, stylesNew.count]}>
      {displayCount}
    </Text>
  );
};


const TaskCarousel1 = () => {
  const renderItem = ({ item }:any) => (
    <TouchableOpacity activeOpacity={0.8}>
    <View style={[stylesNew.card, { backgroundColor: item.color }]}>
      <Text style={stylesNew.title}>{item.category}</Text>

      {item.tasks.map((task:any, index:any) => (
        <View key={index} style={stylesNew.taskContainer}>
      <AnimatedCount finalCount={task.count} />
           <Ionicons name='arrow-forward-outline' 
           style={{margin:'auto',}} size={15} color="black" />
          </View>
      ))}
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
    width: screenWidth / 3.5, 
    height: 150,
    marginHorizontal: 10,
    borderRadius: 15,
    padding: 15,
  },
  title: {
    fontSize: 14,
    // fontWeight: 'bold',
    textAlign:'center',
    color: 'black',
    marginBottom: 10,
  },
  count:{
   fontSize:35,
   fontWeight:'200'
  },
  taskContainer: {
    marginTop: 10,
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
