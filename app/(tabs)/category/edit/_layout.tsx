import {Stack} from 'expo-router'

export default function Edit(){
    return <Stack screenOptions={{
        title:'Edit',
        headerShown:false
    }}>
        <Stack.Screen name='[item]' options={{title:'Edit', headerShown:false}}/>
    </Stack> 
}