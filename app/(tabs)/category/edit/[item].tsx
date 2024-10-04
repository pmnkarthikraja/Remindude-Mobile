import { Stack, useLocalSearchParams } from "expo-router"
import {  ActivityIndicator, View,StyleSheet } from "react-native"
import DynamicForm from "../../add"
import { useCategoryDataContext } from "@/hooks/useCategoryData"
import { useEffect, useState } from "react"
import { FormData } from "@/utils/category"
import { ThemedView } from "@/components/ThemedView"

const Item = () => {
    const {item} = useLocalSearchParams()
    const {formdata} = useCategoryDataContext()
    const [target,setTarget]=useState<FormData|undefined>(undefined)
    const [isloading,setloading]=useState(true)

    useEffect(()=>{
        const got = formdata.find(i=>i.id==item)
        setTarget(got)
        setloading(false)
    },[item])

    if (isloading){
        return <ThemedView style={styles.container}>
            <ActivityIndicator size={'large'}/>
        </ThemedView>
    }

    return <View>
        <Stack.Screen options={{
            title:'Edit ',
            headerShown:true
        }}/>
        {target && <DynamicForm isEdit  editItem={target}/>}
    </View>
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:'center',
      padding: 16,
    },
})

export default Item