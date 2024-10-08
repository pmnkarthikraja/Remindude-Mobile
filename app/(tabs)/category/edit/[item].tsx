import { Stack, useLocalSearchParams } from "expo-router"
import {  ActivityIndicator, View,StyleSheet } from "react-native"
import DynamicForm from "../../add"
import { useEffect, useState } from "react"
import { FormData } from "@/utils/category"
import { ThemedView } from "@/components/ThemedView"
import { useGetFormData } from "@/hooks/formDataHooks"

const Item = () => {
    const {item} = useLocalSearchParams()
    const [target,setTarget]=useState<FormData|undefined>(undefined)
    const [isloading,setloading]=useState(true)
    const { data:formData, isLoading:formDataLoading, error:getFormDataError,refetch } = useGetFormData();

    useEffect(()=>{
        const got =formData && formData.find(i=>i.id==item)
        setTarget(got)
        setloading(false)
    },[item])

    if (isloading || formDataLoading){
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