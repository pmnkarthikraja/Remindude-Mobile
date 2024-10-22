import { ThemedView } from "@/components/ThemedView"
import { useGetFormDataById } from "@/hooks/formDataHooks"
import { Stack, useLocalSearchParams } from "expo-router"
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native"
import DynamicForm from "../../add"

const Item = () => {
    const {item} = useLocalSearchParams()
    // const [target,setTarget]=useState<FormData|undefined>(undefined)
    console.log("id:",item)
    const { data:formData, isLoading:formDataLoading, error:getFormDataError, isError,refetch } = useGetFormDataById(item as string);

    // useEffect(()=>{
    //     const got =formData && formData.find(i=>i.id==item)
    //     setTarget(got)
    //     setloading(false)
    // },[item])

    if (isError){
        Alert.alert("Error",getFormDataError?.message)
    }

    if (formDataLoading){
        return <ThemedView style={styles.container}>
            <ActivityIndicator size={'large'}/>
        </ThemedView>
    }

    return <View>
        <Stack.Screen options={{
            title:'Edit ',
            headerShown:false
        }}/>
        {formData && <DynamicForm isEdit  editItem={formData}/>}
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