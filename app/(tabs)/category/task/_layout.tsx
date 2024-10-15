import {Stack} from 'expo-router'
import { Text } from 'react-native'

export default function Edit(){
    return <Stack>
        <Stack.Screen name='[taskid]' options={{title:'Edit', headerShown:true,
          headerStyle:{
            backgroundColor:'#a1c4fd'
          }
    }}/>
    </Stack> 
}