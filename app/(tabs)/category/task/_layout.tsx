import { Colors } from '@/constants/Colors'
import {Stack} from 'expo-router'
import { useColorScheme } from 'react-native'

export default function Edit(){
    const colorscheme = useColorScheme()
    
    return <Stack>
       <Stack.Screen name='[taskid]' options={{title:'Edit',
       headerTintColor:colorscheme=='light'? 'black':'white', headerShown:true, headerStyle:{
            backgroundColor:colorscheme=='light'? '#a1c4fd':'#252C39',
        }}}/>
    </Stack> 
}