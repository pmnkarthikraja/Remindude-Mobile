import {Stack} from 'expo-router'

export default function Edit(){
    return <Stack >
         <Stack.Screen name='index' options={{title:'Dashboard', headerShown:false}}/>
        <Stack.Screen name='[taskid]' options={{title:'Edit',headerTintColor:'black', headerShown:true, headerStyle:{
            backgroundColor:'#a1c4fd',
        }}}/>
    </Stack> 
}