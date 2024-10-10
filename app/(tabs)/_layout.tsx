import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useUser } from '@/components/userContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Tabs } from 'expo-router';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Login from '../login';

const CustomTabButton:FunctionComponent<{children:any,onPress:any,color:string}> = ({children,onPress,color})=>{
  return <TouchableOpacity style={{
    top:-30,
    justifyContent:'center',
    alignItems:'center',
    ...styles.shadow

  }} onPress={onPress}>
    <View style={{
      width:70,
      height:70,
      borderRadius:35,
      backgroundColor:color
    }}>
      {children}
    </View>
  </TouchableOpacity>
}


export default function TabLayout() {
  const [auth,setAuth]=useState(false)
  const [loading,setloading]=useState(false)
  const colorScheme = useColorScheme();
  const {officeMode} = useUser()

  useEffect(()=>{
    const verify = async () =>{
      setloading(true)
      const user = await AsyncStorage.getItem('user')
      if (user!=null){
        setAuth(true)
      }else{
        router.replace('/login')
      }
      setloading(false)
    }
    verify()
  },[])

   return (<>
    {loading && <View><ActivityIndicator size="large" color="#007BFF" /></View>}

    {!loading && <>

   {auth ? <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f9f9f9',
        headerShown: false,
        tabBarStyle:[(Platform.OS!='ios' && styles.tabbarstyle),styles.shadow],
        tabBarShowLabel:false
      }}>
        <Tabs.Screen name='index' options={{href:null, headerShown:false}} />
        <Tabs.Screen name='profile' options={{href:null, headerShown:false}} />

      <Tabs.Screen
        name="category"
        options={{
          headerShown:false,
          title: 'Category',
          tabBarActiveTintColor:Colors.light.tint,
          tabBarIcon: ({ color, focused }) => (
           <> 
           <TabBarIcon name={focused ? 'home' : 'home-outline'} color={officeMode ? '#4CAF50' : color} />
           <Text style={{
            fontSize:10,
            color:officeMode ? '#4CAF50' : color
           }}>Home</Text>
           </>
          ),
        }}
      />
      { <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarButton: officeMode ? undefined : () => null, 
          tabBarActiveTintColor:Colors.light.tint,
          tabBarIcon: ({ color, focused }) => (
            <>
            <TabBarIcon name={focused ? 'file-tray-full' : 'file-tray-full-outline'} color={officeMode ? '#4CAF50' : color} />
            <Text style={{
              fontSize:10,
              fontWeight:focused ? 'bold' : 'normal',
              color:officeMode ? '#4CAF50' : color
             }}>Tasks</Text>
             </>
          ),
        }}
      />}
           <Tabs.Screen
        name='add'
        options={{
          title: 'Add',
          tabBarShowLabel:false,
          tabBarIcon: ({ color, focused }) => (
            <Image source={{
              uri:'https://cdn-icons-png.flaticon.com/128/748/748113.png'
            }} 
            resizeMode='contain' 
            style={{
              width:30,
              height:30,
              tintColor:'#fff'
            }}/>
          ),
          tabBarButton:(props)=>(
            <CustomTabButton  children={props.children} onPress={props.onPress} color={officeMode ? '#4CAF50' : Colors.light.tint}/>
          )
        }}
      />
             <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarButton: officeMode ? undefined : () => null, 
          tabBarActiveTintColor:Colors.light.tint,
          tabBarIcon: ({ color, focused }) => (
            <>
            <TabBarIcon name={focused ? 'calendar-clear' : 'calendar-clear-outline'} color={officeMode ? '#4CAF50' : color} />
            <Text style={{
              fontSize:10,
              color:officeMode ? '#4CAF50' : color
             }}>Calendar</Text>
             </>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Setting',
          tabBarActiveTintColor:Colors.light.tint,
          tabBarIcon: ({ color, focused }) => (
            <>
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={officeMode ? '#4CAF50' : color} />
            <Text style={{
              fontSize:10,
              color:officeMode ? '#4CAF50' : color
             }}>Settings</Text>
             </>
          ),
        }}
      />
    </Tabs>:<Login  />}
    </>}
    </>
  );
}

const styles = StyleSheet.create({
  tabbarstyle:{
    position:'absolute',
    bottom:10,
    left:20,
    right:20,
    borderRadius:15,
    height:60,
  },
  shadow:{
    shadowColor:'#7f5df0',
    shadowOffset:{
      height:10,
      width:0
    },
    shadowOpacity:0.3,
    shadowRadius:3.5,
    elevation:5,
  }
})
