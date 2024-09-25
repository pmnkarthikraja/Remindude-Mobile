import { Stack, useLocalSearchParams } from "expo-router"
import {  View } from "react-native"
import DynamicForm from "../../add"
import { useCategoryDataContext } from "@/hooks/useCategoryData"

const Item = () => {
    const {item} = useLocalSearchParams()
    const {formdata} = useCategoryDataContext()
    const got = formdata.find(i=>i.id==item)

    return <View>
        <Stack.Screen options={{
            title:'Edit ',
            headerShown:true
        }}/>
        {got && <DynamicForm isEdit  editItem={got}/>}
    </View>
}

export default Item