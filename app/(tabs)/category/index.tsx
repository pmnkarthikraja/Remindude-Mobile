import Header from '@/components/Header';
import LoadingWidget from '@/components/LoadingWidget';
import OfficeScreen from '@/components/OfficeScreen';
import TaskScreen from '@/components/TaskScreen';
import { NotificationContent, useUser } from '@/components/userContext';
import { useGetFormData } from '@/hooks/formDataHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, useColorScheme, View } from 'react-native';
import uuid from 'react-native-uuid';
import { getAgreements } from '@/utils/database/agreementsDb';
import { getPurchaseOrders } from '@/utils/database/purchaseOrderDb';
import { getVisaDetails } from '@/utils/database/visaDetailsDb';
import { getIqamaRenewals } from '@/utils/database/iqamaRenewalsDb';
import { getInsuranceRenewals } from '@/utils/database/insuranceRenewals';
import { getHouseRentalRenewals } from '@/utils/database/houseRentalRenewalDb';
import { FormData } from '@/utils/category';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const IndexPage = () => {
  const { officeMode, user, loading: getuserloading, setNotifications } = useUser()
  const colorscheme = useColorScheme()
  const [isloading, setloading] = useState(true)
  const [refreshing, setRefreshing] = useState(true)
  // const { data: formData, isLoading, error: getFormDataError, refetch } = useGetFormData();
  const [isConnected, setIsConnected] = useState(true)
  const navigation = useNavigation()
  const [formData,setFormData]=useState<FormData[] >([])


  const retrieveFromAsyncDb = async () =>{
    const allData: FormData[] = [];

    const agreementsData = await getAgreements()
    allData.push(...agreementsData)

    const poData = await getPurchaseOrders()

    allData.push(...poData)

    const visaDetailsData = await getVisaDetails()

    allData.push(...visaDetailsData)

    const iqamaRenewalsData = await getIqamaRenewals()
    allData.push(...iqamaRenewalsData)

    const insuranceRenewalsData = await getInsuranceRenewals()
    allData.push(...insuranceRenewalsData)

    const houseRentalRenewalsData = await getHouseRentalRenewals()
    allData.push(...houseRentalRenewalsData)

    setFormData(allData)
  }

  useEffect(()=>{
    //retrive all data from db.
    retrieveFromAsyncDb()
  },[])

  const removeTokenonsignedout = async () => {
    const fcmToken = await AsyncStorage.getItem('fcmToken')
    const BASE_URL = "https://remindude.vercel.app";
    if (fcmToken) {
      try {
        await axios.delete(`${BASE_URL}/fcmTokens`, {
          data: {
            email: user?.email,
            token: fcmToken,
          }
        });
      } catch (e) {
        console.log("error on removing the token: ", e)
      }
    }
  }

  const sendFCMTokensToBackend = async () => {
    const fcmToken = await AsyncStorage.getItem('fcmToken')
    const isTokenSent = await AsyncStorage.getItem('isFCMTokenSent');
    const BASE_URL = "https://remindude.vercel.app";

    if (!isTokenSent && fcmToken) {
      try {
        await axios.post(`${BASE_URL}/fcmTokens`, {
          email: user?.email,
          token: fcmToken,
        });

        await AsyncStorage.setItem('isFCMTokenSent', 'true'); //one time only we should send to backend
        console.log('FCM token sent to backend successfully');
      } catch (error) {
        console.error('Error sending FCM token to backend:', error);
      }
    } else {
      console.log('FCM token has already been sent or token is not available');
    }
  }


  const onRefresh = useCallback(async () => {
    // refetch()
    await retrieveFromAsyncDb()
    setRefreshing(false)
  }, [])


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected != null) {
        setIsConnected(state.isConnected);
        onRefresh()
        if (!state.isConnected) {
          Alert.alert('No Internet Connection', 'You are currently offline.');
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);


  useEffect(() => {
    const unsubscribeNotification = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived index!', JSON.stringify(remoteMessage));
      const notification: NotificationContent = {
        id: uuid.v4().toString(),
        title: remoteMessage.notification?.title || '',
        description: remoteMessage.notification?.body || ''
      }
      setNotifications(prev => [...prev, notification])
      // await AsyncStorage.setItem('notifications',JSON.stringify([...notifications,notification]))
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
        },
        trigger: null
      });
    });

    const checkPermissions = async () => {
      const hasRequested = await AsyncStorage.getItem('notificationPermissionsRequested');
      if (!hasRequested) {
        const { status } = await Notifications.requestPermissionsAsync();
        await AsyncStorage.setItem('notificationPermissionsRequested', 'true');
        await AsyncStorage.setItem('notificationPermissionsStatus', status === 'granted' ? 'true' : 'false');
      }
    };

    checkPermissions();
    sendFCMTokensToBackend()

    const subscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification.request.identifier);
      }
    );
    setloading(false)

    return () => {
      subscription.remove();
      unsubscribeNotification()
    };
  }, []);

  const linearGradientUnified = [
    colorscheme == 'light' ? '#a1c4fd' : '#252C39',
    colorscheme == 'light' ? 'white' : 'transparent']

  // const masterLoading = isloading || isLoading || formData == undefined || refreshing
  const masterLoading = isloading || refreshing

  if (getuserloading || masterLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={linearGradientUnified}
          style={{ flex: 1 }}>
          <Header user={user} isLoading={masterLoading} />
         <LoadingWidget/>
        </LinearGradient>
      </View>
    );
  }


  return <View style={styles.container}>
    <LinearGradient
      colors={linearGradientUnified}
      style={{ flex: 1 }}>
      <Header user={user} isLoading={masterLoading} />

      {(!officeMode && !masterLoading && !getuserloading) && <OfficeScreen
      onRefresh={onRefresh} refreshing={refreshing} isConnected={isConnected} formData={formData}/>}
      {(officeMode && !masterLoading && !getuserloading) && <TaskScreen />}

    </LinearGradient>
  </View>
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