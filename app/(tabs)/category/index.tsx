import { Alert, useColorScheme, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Header from '@/components/Header';
import { useUser } from '@/components/userContext';
import OfficeScreen from '@/components/OfficeScreen';
import TaskScreen from '@/components/TaskScreen';
import { useGetFormData } from '@/hooks/formDataHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';
import { ThemedView } from '@/components/ThemedView';
import Lottie from 'lottie-react-native';
import { useNavigation } from 'expo-router';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const IndexPage = () => {
  const {officeMode,user,loading:getuserloading}= useUser()
  const colorscheme = useColorScheme()
  const [isloading,setloading]=useState(true)
  const [refreshing,setRefreshing]=useState(false)
  const { data:formData, isLoading, error:getFormDataError ,refetch} = useGetFormData();
  const [isConnected,setIsConnected]=useState(true)
  const navigation = useNavigation()

  const onRefresh= useCallback(async ()=>{
    setRefreshing(true)
    refetch()
    setRefreshing(false)
  },[])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
     if (state.isConnected!=null){ 
      setIsConnected(state.isConnected);
      onRefresh()
      if (!state.isConnected) {
        Alert.alert('No Internet Connection', 'You are currently offline.');
      }}
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

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

  const masterLoading = isloading || isLoading || formData==undefined

  if (getuserloading) {
    return (
        <ThemedView style={styles.container}>
        <Lottie
                source={require('../../../assets/Animation/Animation -loading1.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
        </ThemedView>
    );
  }

  const linearGradient = [
     colorscheme == 'light' ? (officeMode ?'#f9f9f9' :'#a1c4fd') : '#252C39',
     colorscheme == 'light' ? 'white' : 'transparent']

  const linearGradientUnified = [
    colorscheme == 'light' ? '#a1c4fd' : '#252C39',
    colorscheme == 'light' ? 'white' : 'transparent']

  return <>
   <View style={styles.container}>
      <LinearGradient
        colors={linearGradientUnified}
        style={{ flex: 1 }}>
        <Header user={user}/>

        {masterLoading &&   <Lottie
                source={require('../../../assets/Animation/Animation -loading1.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />}

        {!officeMode && !masterLoading && <OfficeScreen formData={formData} onRefresh={onRefresh} refreshing={refreshing} isConnected={isConnected}/>}
        {officeMode && <TaskScreen/>}

      </LinearGradient>
    </View>
  </>
}

export default IndexPage

const styles = StyleSheet.create({
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cloudContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cloud: {
    position: 'absolute',
    width: 150,
    height: 100,
    top: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  cardHeadImg: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  animation: {
    width: 'auto',
    height: 150,
  },
  loadingAnimation:{
    flex:1,
    justifyContent:'center',
    width:'auto',
    height:150
  },
  animation2: {
    width: 'auto',
    height: 20
  },
  bannerImage: {
    resizeMode: 'cover',
    width: '100%',
    height: 250,
  },
  listContainer: {
    gap: 10,
    padding: 20,
  },
  themeSwitch: {
    color: 'grey'
  },
  paragraphContainer: {
    marginTop: 10,
  },
  paragraph: {
    marginVertical: 3,
    fontSize: 16,
  },
  next30Days: {
    color: '#FF6600',
    fontWeight: '600',
  },
  next30To60Days: {
    color: '#FFBF04',
    fontWeight: '600',
  },
  next60To90Days: {
    color: '#004684',
    fontWeight: '600',
  },
  highlightedText: {
    fontWeight: 'bold',
    fontSize: 23
  },
  switch: {
    width: 60,
    height: 30,
  },
});