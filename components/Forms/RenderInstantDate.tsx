import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FunctionComponent } from 'react'
import { addDays } from "@/utils/calculateReminder";
import { UseFormSetValue } from "react-hook-form";
import { FormData } from "@/utils/category";

type AcceptedDateFields = 'startDate' | 'endDate' | 'poIssueDate' | 'poEndDate' | 'entryDate' | 'visaEndDate' | 'visaEntryDate' | 'visaExpiryDate' | 'expiryDate' | 'insuranceStartDate' | 'insuranceEndDate' | 'customReminderDate'

export interface RenderInstanceDateProps{
    fieldName:AcceptedDateFields
    setValue:UseFormSetValue<FormData>
    doSetReminderDates:()=>void
}

const RenderInstanceDate:FunctionComponent<RenderInstanceDateProps> = ({
    fieldName,
    setValue,
    doSetReminderDates
}) => {
    return <>
     {fieldName !== 'customReminderDate' && <View style={{marginBottom:20,display:'flex', flexDirection:'row',}}>
        <TouchableOpacity style={styles.box} activeOpacity={0.7}
          onPress={async () => {
            setValue(fieldName, addDays(new Date(), 30));
            doSetReminderDates()
          }}>
          <Text style={styles.text} >+30days</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} activeOpacity={0.7}
          onPress={() => {
            setValue(fieldName, addDays(new Date(), 60));
            doSetReminderDates()
          }}>
          <Text style={styles.text}  >+60days</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} activeOpacity={0.7}
          onPress={() => {
            setValue(fieldName, addDays(new Date(), 90));
            doSetReminderDates()
          }}>
          <Text style={styles.text}  >+90days</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, { backgroundColor: 'orange', borderColor: 'white' }]} activeOpacity={0.7}
          onPress={() => {
            setValue(fieldName, addDays(new Date(), 0));
            doSetReminderDates()
          }}>
          <Text style={styles.text} >Reset</Text>
        </TouchableOpacity>
      </View>}
    </>
}

const styles = StyleSheet.create({
    box: {
        width: 'auto',
        height: 'auto',
        backgroundColor: 'skyblue',
        padding: 6,
        borderRadius: 25,
        elevation: 3,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#0a7ea4',
        justifyContent: 'center',
        marginRight: 10,
      },
text:{
    padding:1
}
})


export default RenderInstanceDate