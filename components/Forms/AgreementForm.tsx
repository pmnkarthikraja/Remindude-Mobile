import { calculateReminderDatesV2 } from "@/utils/calculateReminder"
import { FormData } from "@/utils/category"
import { debounce } from "lodash"
import React, { FunctionComponent, useCallback, useEffect, useMemo } from "react"
import { UseFormReturn } from "react-hook-form"
import { StyleSheet, useColorScheme, View } from "react-native"
import HolidayCalendarOffice from "../HolidayCalenderOffice"
import { ThemedText } from "../ThemedText"
import RenderInstanceDate from "./RenderInstantDate"
import RenderTextBoxInput from "./RenderTextBoxInput"
import RenderTextInput from "./RenderTextInput"
import RenderStatus from "./RenderStates"

export interface AgreementsFormProps {
  formState: UseFormReturn<FormData, any, undefined>
  renderCustomReminderDates:JSX.Element
}

const AgreementsForm: FunctionComponent<AgreementsFormProps> = ({ formState,renderCustomReminderDates }) => {
  const { control, formState: { errors }, setValue, watch,register } = formState;
  const category = watch("category");
  const endDate = watch("endDate");
  const startDate = watch("startDate");
  const completed = watch('completed')

  
    const debouncedSetReminderDates = useCallback(
    debounce((category, endDate) => {
      if (category) {
        const reminderDates = calculateReminderDatesV2(category, endDate);
        setValue("reminderDates", reminderDates, { shouldDirty: true });
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (endDate && category === "Agreements") {
      debouncedSetReminderDates(category,endDate);
    }
  }, [endDate, category]);


  const colorScheme = useColorScheme();

  const memoizedForm = useMemo(() => (
    <View>
      <RenderTextInput
        control={control}
        errorss={errors}
        isLightTheme={colorScheme === 'light'}
        label="Client Name"
        name="clientName"
        placeholder="Enter Client Name"
      />
      <RenderTextInput
        control={control}
        errorss={errors}
        isLightTheme={colorScheme === 'light'}
        label="Vendor Code"
        name="vendorCode"
        placeholder="Enter Vendor Code"
      />
      <RenderTextBoxInput
        control={control}
        errorss={errors}
        isLightTheme={colorScheme === 'light'}
        label="Remarks (if any)"
        name="remarks"
        placeholder="Enter Remarks"
      />
      <ThemedText style={styles.label}>Start Date:</ThemedText>
      <HolidayCalendarOffice
        datetime={startDate || new Date()} isEdit={false} setValue={setValue}
        fieldname='startDate' triggerReminderDates={()=>debouncedSetReminderDates(category,endDate)} />

      <ThemedText style={styles.label}>End Date:</ThemedText>

      <RenderInstanceDate fieldName="endDate" doSetReminderDates={()=>debouncedSetReminderDates(category, endDate)} setValue={setValue} />

     <HolidayCalendarOffice
        triggerReminderDates={()=>debouncedSetReminderDates(category, endDate)}
        datetime={endDate} isEdit={false} setValue={setValue} fieldname='endDate' />

      <ThemedText style={styles.label}>Status: </ThemedText>
      <RenderStatus completed={completed} 
      isLightTheme={colorScheme=='light'} onChange={status=>{ setValue('completed', status, { shouldValidate: true, shouldDirty: true });
    }}/>

    {renderCustomReminderDates}

    </View>
  ), [control, errors, colorScheme, endDate, completed]);

  return memoizedForm;
};


const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#0a7ea4', //colors.light.tint
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
})

export default AgreementsForm