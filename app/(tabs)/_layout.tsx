import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useUser } from '@/components/userContext';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Tabs } from 'expo-router';
import Lottie from 'lottie-react-native';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomTabButton: FunctionComponent<{ children: any, onPress: any, color: string }> = ({ children, onPress, color }) => {
  return <TouchableOpacity style={{
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    ...styles.shadow

  }} onPress={onPress}>
    <View style={{
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: color
    }}>
      {children}
    </View>
  </TouchableOpacity>
}

export default function TabLayout() {
  const [loading, setloading] = useState(false)
  const { officeMode } = useUser()

  useEffect(() => {
    const verify = async () => {
      setloading(true)
      const user = await AsyncStorage.getItem('user')
      if (user == null) {
        router.replace('/login')
      }
      setloading(false)
    }
    verify()
  }, [])


  if (loading) {
    return <Lottie
      source={require('../../assets/Animation/Animation -loading1.json')}
      autoPlay
      loop
      style={styles.loadingAnimation}
    />
  }

  return (<Tabs
    screenOptions={{
      tabBarActiveTintColor: '#f9f9f9',
      headerShown: false,
      tabBarStyle: [(Platform.OS != 'ios' && styles.tabbarstyle), styles.shadow],
      tabBarShowLabel: false
    }}>
    <Tabs.Screen name='index' options={{ href: null, headerShown: false }} />
    <Tabs.Screen name='profile' options={{ href: null, headerShown: false }} />

    <Tabs.Screen
      name="category"
      options={{
        headerShown: false,
        title: 'Category',
        tabBarActiveTintColor: Colors.light.tint,
        tabBarIcon: ({ color, focused }) => (
          <>
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            <Text style={{
              fontSize: 10,
              color: color
            }}>Home</Text>
          </>
        ),
      }}
    />

    {<Tabs.Screen
      name="tasks"
      options={{
        title: 'Tasks',
        tabBarButton: officeMode ? undefined : () => null,
        tabBarActiveTintColor: Colors.light.tint,
        tabBarIcon: ({ color, focused }) => (
          <>
            <TabBarIcon name={focused ? 'file-tray-full' : 'file-tray-full-outline'} color={color} />
            <Text style={{
              fontSize: 10,
              fontWeight: focused ? 'bold' : 'normal',
              color: color
            }}>Tasks</Text>
          </>
        ),
      }}
    />}

    <Tabs.Screen
      name='add'
      options={{
        title: 'Add',
        tabBarShowLabel: false,
        tabBarIcon: ({ color, focused }) => (
          <Image source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/748/748113.png'
          }}
            resizeMode='contain'
            style={{
              width: 30,
              height: 30,
              tintColor: '#fff'
            }} />
        ),
        tabBarButton: (props) => (
          <CustomTabButton children={props.children} onPress={props.onPress} color={Colors.light.tint} />
        )
      }}
    />

    <Tabs.Screen
      name="calendar"
      options={{
        title: 'Calendar',
        tabBarButton: officeMode ? undefined : () => null,
        tabBarActiveTintColor: Colors.light.tint,
        tabBarIcon: ({ color, focused }) => (
          <>
            <TabBarIcon name={focused ? 'calendar-clear' : 'calendar-clear-outline'} color={color} />
            <Text style={{
              fontSize: 10,
              color: color
            }}>Calendar</Text>
          </>
        ),
      }}
    />

    <Tabs.Screen
      name="settings"
      options={{
        title: 'Setting',
        tabBarActiveTintColor: Colors.light.tint,
        tabBarIcon: ({ color, focused }) => (
          <>
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
            <Text style={{
              fontSize: 10,
              color: color
            }}>Settings</Text>
          </>
        ),
      }}
    />

  </Tabs>
  );
}

const styles = StyleSheet.create({
  tabbarstyle: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    borderRadius: 15,
    height: 60,
  },
  shadow: {
    shadowColor: '#7f5df0',
    shadowOffset: {
      height: 10,
      width: 0
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5,
  },
  loadingAnimation: {
    width: 80,
    height: 80,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center'
  },
})















// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// import { useUser } from '@/components/userContext';
// import { Colors } from '@/constants/Colors';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router, Tabs } from 'expo-router';
// import Lottie from 'lottie-react-native';
// import React, { FunctionComponent, useEffect, useState } from 'react';
// import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import IndexPage from './category';
// import TaskScreen from './tasks';
// import HolidayCalendar from './calendar';
// import DynamicForm from './add';
// import SettingsScreen from './settings';

// const CustomTabButton: FunctionComponent<{ children: any, onPress: any, color: string }> = ({ children, onPress, color }) => {
//   return (
//     <TouchableOpacity style={{ top: -30, justifyContent: 'center', alignItems: 'center', ...styles.shadow }} onPress={onPress}>
//       <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: color }}>
//         {children}
//       </View>
//     </TouchableOpacity>
//   );
// };

// const BottomTab = createBottomTabNavigator()
// const SwipeTab = createMaterialTopTabNavigator();

// export default function TabLayout() {
//   const [loading, setLoading] = useState(false);
//   const { officeMode } = useUser();

//   useEffect(() => {
//     const verify = async () => {
//       setLoading(true);
//       const user = await AsyncStorage.getItem('user');
//       if (!user) {
//         router.replace('/login');
//       }
//       setLoading(false);
//     };
//     verify();
//   }, []);

//   if (loading) {
//     return (
//       <Lottie
//         source={require('../../assets/Animation/Animation -loading1.json')}
//         autoPlay
//         loop
//         style={styles.loadingAnimation}
//       />
//     );
//   }

//   const SwipeTabs = () => (
//     <SwipeTab.Navigator
//       screenOptions={{
//         swipeEnabled: true,
//         tabBarIndicatorStyle: { backgroundColor: Colors.light.tint },
//       }}
//     >
//       <SwipeTab.Screen name="index" component={IndexPage} options={{ tabBarLabel: 'Home' }} />
//       <SwipeTab.Screen name="tasks" component={TaskScreen} options={{ tabBarLabel: 'Tasks' }} />
//       <SwipeTab.Screen name="calendar" children={()=><HolidayCalendar datetime={new Date()}  isEdit={false}/>} options={{ tabBarLabel: 'Calendar' }} />
//     </SwipeTab.Navigator>
//   );

//   return (
//     <SwipeTab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#f9f9f9',
//         swipeEnabled:true,
//         // headerShown: false,
//         tabBarStyle: [Platform.OS !== 'ios' && styles.tabbarstyle, styles.shadow],
//         tabBarShowLabel: false,
//       }}
//     >
//       <SwipeTab.Screen
//         name="SwipeTabs"
//         component={IndexPage}
//         options={{
//           title: 'Swipe Tabs',
//           tabBarActiveTintColor:Colors.light.tint,
//           tabBarIcon: ({ color }) => (
//             <>
//               <TabBarIcon name="home" color={color} />
//               <Text style={{ fontSize: 10, color }}>Home</Text>
//             </>
//           ),
//         }}
//       />
//       <SwipeTab.Screen
//         name="Add"
//         component={DynamicForm}
//         options={{
//           tabBarShowLabel: false,
//           tabBarIcon: ({ color }) => (
//             <Image
//               source={{ uri: 'https://cdn-icons-png.flaticon.com/128/748/748113.png' }}
//               resizeMode="contain"
//               style={{ width: 30, height: 30, tintColor: '#fff' }}
//             />
//           ),
//           // tabBarButton: (props) => <CustomTabButton {...props} color={Colors.light.tint} onPress={props.onPress}/>,
//         }}
//       />
//       <SwipeTab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//           title: 'Settings',
//           tabBarIcon: ({ color }) => (
//             <>
//               <TabBarIcon name="settings" color={color} />
//               <Text style={{ fontSize: 10, color }}>Settings</Text>
//             </>
//           ),
//         }}
//       />
//     </SwipeTab.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   tabbarstyle: {
//     position: 'absolute',
//     bottom: 10,
//     left: 20,
//     right: 20,
//     borderRadius: 15,
//     height: 60,
//   },
//   shadow: {
//     shadowColor: '#7f5df0',
//     shadowOffset: { height: 10, width: 0 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3.5,
//     elevation: 5,
//   },
//   loadingAnimation: {
//     width: 80,
//     height: 80,
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },
// });

