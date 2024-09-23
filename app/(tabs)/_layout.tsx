import { router, Tabs } from 'expo-router';
import React, {  Children, FunctionComponent, useEffect, useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Login from '../login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View,StyleSheet, TouchableOpacity, Image, Text } from 'react-native';

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

  useEffect(()=>{
    const verify = async () =>{
      setloading(true)
      const token = await AsyncStorage.getItem('token')
      if (token!=null){
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

   {auth? <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle:[styles.tabbarstyle,styles.shadow],
        tabBarShowLabel:false
      }}>
        <Tabs.Screen name='index' options={{href:null, headerShown:false}} />
        <Tabs.Screen name='add' options={{href:null, headerShown:false}} />
      <Tabs.Screen
        name="category"
        options={{
          headerShown:false,
          title: 'Category',
          tabBarActiveTintColor:Colors.light.tint,
          tabBarIcon: ({ color, focused }) => (
           <> 
           <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
           <Text style={{
            fontSize:10,
            color:color
           }}>Home</Text>
           </>
          ),
        }}
      />
            <Tabs.Screen
        name='add2'
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
            <CustomTabButton  children={props.children} onPress={props.onPress} color={Colors.light.tint}/>
          )
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarActiveTintColor:Colors.light.tint,
          tabBarIcon: ({ color, focused }) => (
            <>
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            <Text style={{
              fontSize:10,
              color:color
             }}>Settings</Text>
             </>
          ),
        }}
      />

    </Tabs>:<Login  onlogin={()=>setAuth(true)}/>}
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
    elevation:0,
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
