import {Stack} from 'expo-router'

export default function Category(){
    return <Stack >
        <Stack.Screen name='index' options={{title:'Dashboard', headerShown:false}}/>
        <Stack.Screen name='edit' options={{title:'Edit', headerShown:false}}/>
    </Stack> 
}