import {Stack} from 'expo-router'

export default function Category(){
    return <Stack >
        <Stack.Screen name='index' options={{title:'Dashboard', headerShown:false}}/>
        <Stack.Screen name='edit' options={{title:'Edit', headerShown:false}}/>
        <Stack.Screen name='[id]' options={{title:'', headerShown:true}}/>
        <Stack.Screen name='task' options={{title:'', headerShown:false}}/>
    </Stack> 
}