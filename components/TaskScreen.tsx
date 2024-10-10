import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
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

const TaskPage: FunctionComponent = () => {
  const [refreshing, setRefreshing] = useState(false)
  const colorscheme = useColorScheme()
  const [isloading, setloading] = useState(true)
  const { loading, user, officeMode } = useUser()
  const { data: formData, isLoading, error: getFormDataError, refetch } = useGetFormData();
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation()


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected != null) {
        setIsConnected(state.isConnected);
        refetch()
        if (!state.isConnected) {
          Alert.alert('No Internet Connection', 'You are currently offline.');
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    refetch()
    setRefreshing(false)
  }, [])

  useEffect(() => {
    const checkPermissions = async () => {
      const hasRequested = await AsyncStorage.getItem('notificationPermissionsRequested');
      if (!hasRequested) {
        const { status } = await Notifications.requestPermissionsAsync();
        await AsyncStorage.setItem('notificationPermissionsRequested', 'true');
        await AsyncStorage.setItem('notificationPermissionsStatus', status === 'granted' ? 'true' : 'false');
      }
    };

    checkPermissions();

    const subscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification.request.identifier);
      }
    );
    setloading(false)

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const doRefetch = async () => {
      await refetch()
    }
    if (user) {
      setloading(true)
      doRefetch()
      setloading(false)
    }
  }, [user]);

  if (isloading || isLoading || loading || formData == undefined) {
    return (
      <ThemedView style={styles.container}>
        <Lottie
          source={require('../assets/Animation/Animation -loading1.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      </ThemedView>
    );
  }

  return <ScrollView style={styles.container}>
    <ThemedText style={{ paddingLeft: 15, color: '#969696' }}>you have 4 tasks due today</ThemedText>

    <View style={styles.searchContainer}>
      <TextInput style={styles.searchInput} placeholder="Search" />
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="options-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>

    <CurrentDate />

    <TaskCards />

    <AllTasks />
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

  // starts here,
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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



const CurrentDate = () => {
  const date = new Date().toDateString();

  return (
    <View style={stylesCurrentDate.dateContainer}>
      <Text style={stylesCurrentDate.todayText}>Today</Text>
      <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <TouchableOpacity>
          <Ionicons name='calendar-number-outline' size={24} color="black" />
        </TouchableOpacity>
        <Text>{date}</Text>
      </View>
    </View>
  );
};

const stylesCurrentDate = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  todayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});


const TaskCards = () => {
  const tasks = [
    {
      title: 'Website Designing',
      date: '19 August 2024',
      progress: '9/20 Finished',
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={stylesTaskCards.taskScroll}>
      {tasks.map((task, index) => (
        <View key={index} style={stylesTaskCards.card}>
          <View style={stylesTaskCards.logoContainer}>
            <View style={stylesTaskCards.logoBackground}>
              <Image source={{ uri: task.logo }} style={stylesTaskCards.logo} />
            </View>
          </View>

          <View style={stylesTaskCards.labelContainer}>
            <Text style={stylesTaskCards.labelText}>{task.label}</Text>
          </View>

          <Text style={stylesTaskCards.cardTitle}>{task.title}</Text>
          <Text>{task.date}</Text>

          <View style={stylesTaskCards.progressContainer}>
            <View style={stylesTaskCards.progressBar}>
              <View style={[stylesTaskCards.progress, { width: '45%' }]} />
            </View>
            <Text>{task.progress}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

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
    width: 250,
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
    fontSize: 16,
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


const AllTasks = () => {
  return (
    <View style={stylesAllTasks.allTasksContainer}>
      <Text style={stylesAllTasks.sectionTitle}>All Tasks</Text>
      <View style={stylesAllTasks.taskRow}>
        <Text>Ongoing</Text>
        <Text>10 Tasks</Text>
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
    marginBottom: 5
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
