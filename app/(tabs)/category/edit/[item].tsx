import LoadingWidget from "@/components/LoadingWidget"
import { useGetFormDataById } from "@/hooks/formDataHooks"
import { LinearGradient } from "expo-linear-gradient"
import { Stack, useLocalSearchParams } from "expo-router"
import { Alert, StyleSheet, useColorScheme, View } from "react-native"
import DynamicForm from "../../add"

const Item = () => {
    const { item } = useLocalSearchParams()
    const colorScheme = useColorScheme()
    const { data: formData, isLoading: formDataLoading, error: getFormDataError, isError, refetch } = useGetFormDataById(item as string);

    if (isError) {
        Alert.alert("Error", getFormDataError?.message)
    }

    if (formDataLoading) {
        return <LinearGradient
            style={styles.container}
            colors={[colorScheme == 'light' ? '#a1c4fd' : '#252C39', colorScheme == 'light' ? 'white' : 'transparent']}
        >
            <LoadingWidget />
        </LinearGradient>
    }

    return <View>
        <Stack.Screen options={{
            title: 'Edit ',
            headerShown: false
        }} />
        {formData && <DynamicForm isEdit editItem={formData} />}
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
})

export default Item