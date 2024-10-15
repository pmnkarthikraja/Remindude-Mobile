import {Stack} from 'expo-router'

export default function Edit(){
    return <Stack >
         <Stack.Screen name='index' options={{title:'Dashboard', headerShown:false}}/>
        <Stack.Screen name='[taskid]' options={{title:'Edit', headerShown:true}}/>
    </Stack> 
}