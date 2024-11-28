import LoadingWidget from "@/components/LoadingWidget"
import { useGetFormDataById } from "@/hooks/formDataHooks"
import { LinearGradient } from "expo-linear-gradient"
import { Stack, useLocalSearchParams } from "expo-router"
import { Alert, StyleSheet, useColorScheme, View } from "react-native"
import DynamicForm from "../../add"
import React, { useEffect, useState } from 'react'
import { getAgreementById } from "@/utils/database/agreementsDb"
import { FormData } from "@/utils/category"
import { getPurchaseOrderById } from "@/utils/database/purchaseOrderDb"
import { getVisaDetailById } from "@/utils/database/visaDetailsDb"
import { getIqamaRenewalById } from "@/utils/database/iqamaRenewalsDb"
import { getInsuranceRenewalById } from "@/utils/database/insuranceRenewals"
import { getHouseRentalRenewalById } from "@/utils/database/houseRentalRenewalDb"

const Item = () => {
    const { item } = useLocalSearchParams()
    const colorScheme = useColorScheme()
    const [isloading,setisloading]=useState(true)
    const [formData,setFormData]=useState<FormData| undefined>(undefined)
    // const { data: formData, isLoading: formDataLoading, error: getFormDataError, isError, refetch } = useGetFormDataById(item as string);

    // if (isError) {
    //     Alert.alert("Error", getFormDataError?.message)
    // }

    useEffect(()=>{
        const loadEditItem = async () => {
            const got =await getAgreementById(item as string) || await getPurchaseOrderById(item as string) || await getVisaDetailById(item as string) || await getIqamaRenewalById(item as string) || await getInsuranceRenewalById(item as string) || await getHouseRentalRenewalById(item as string)
            setFormData(got as unknown as FormData)
            setisloading(false)
        }
        loadEditItem()
    },[item])

    if (isloading) {
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