import { CalendarRange, Check, Plus, X } from "@tamagui/lucide-icons";
import React, { FunctionComponent } from "react"
import { Checkbox, Text, XStack, YStack } from "tamagui";
import { ThemedText } from "../ThemedText";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, View } from "react-native";
import { FormData } from "@/utils/category";
import { UseFormSetValue } from "react-hook-form";


const buildMaxDate = (currentFormData: FormData): Date | undefined => {
    switch (currentFormData.category) {
      case 'Agreements':
        return currentFormData.endDate
      case 'Insurance Renewals':
        return currentFormData.insuranceEndDate
      case 'IQAMA Renewals':
        return currentFormData.expiryDate
      case 'Purchase Order':
        return currentFormData.poEndDate
      case 'Visa Details':
        return currentFormData.visaEndDate
      case 'House Rental Renewal':
        return currentFormData.endDate
      default:
        return undefined
    }
  }


  type AcceptedDateFields = 'startDate' | 'endDate' | 'poIssueDate' | 'poEndDate' | 'entryDate' | 'visaEndDate' | 'visaEntryDate' | 'visaExpiryDate' | 'expiryDate' | 'insuranceStartDate' | 'insuranceEndDate' | 'customReminderDate'


export interface RenderCustomReminderDatesProps{
    isLightTheme:boolean,
    isEdit:boolean,
    // manualReminders:boolean,
    // setManualReminders:(isTrue:boolean)=>void
    data: FormData; 
    setValue: UseFormSetValue<FormData>;
    toggleDatePickerVisibility: (fieldName: AcceptedDateFields, isOpen: boolean) => void;
    datePickerVisibility: {
        startDate: boolean;
        endDate: boolean;
        poIssueDate: boolean;
        poEndDate: boolean;
        entryDate: boolean;
        visaEndDate: boolean;
        visaEntryDate: boolean;
        visaExpiryDate: boolean;
        expiryDate: boolean;
        insuranceStartDate: boolean;
        insuranceEndDate: boolean;
        customReminderDate: boolean;
    }
    setDatePickerVisibility: React.Dispatch<React.SetStateAction<{
        startDate: boolean;
        endDate: boolean;
        poIssueDate: boolean;
        poEndDate: boolean;
        entryDate: boolean;
        visaEndDate: boolean;
        visaEntryDate: boolean;
        visaExpiryDate: boolean;
        expiryDate: boolean;
        insuranceStartDate: boolean;
        insuranceEndDate: boolean;
        customReminderDate: boolean;
    }>>
    manualReminders?: boolean;
    setManualReminders: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

const RenderCustomReminderDates:FunctionComponent<RenderCustomReminderDatesProps> = ({
    isLightTheme,
    isEdit,
    manualReminders,
    setManualReminders,
    data,
    datePickerVisibility,
    setDatePickerVisibility,
    setValue,
    toggleDatePickerVisibility
}) => {
    
    return <>
      <XStack alignItems="center" gap={'$2'} marginBottom={10}>
     <Checkbox size="$4" backgroundColor={'#0a7ea4'}
          checked={manualReminders}
          onCheckedChange={e => {
            setManualReminders(e => !e);
            if (data.wantsCustomReminders && isEdit) {
              setValue('customReminderDates', [])
              setValue('wantsCustomReminders', !data.wantsCustomReminders)
            } else {
              setValue('wantsCustomReminders', true)
            }
          }}>
          <Checkbox.Indicator >
            <Check color={'white'} />
          </Checkbox.Indicator>
        </Checkbox>
        <ThemedText  >
          would you like to recieve custom reminders?
        </ThemedText>
      </XStack>

      {manualReminders && <>
        <ThemedText >Please mention the dates you wants to recieve reminders</ThemedText>
        <Plus color={isLightTheme ? '#0a7ea4' : 'white'}
          onPress={() => setDatePickerVisibility((prev) => ({
            ...prev,
            ['customReminderDate']: true,
          }))} />

        {Platform.OS !== 'ios' && datePickerVisibility['customReminderDate'] && (
          <DateTimePicker
            id='customReminderDate'
            value={new Date()}
            mode="date"
            display="default"
            maximumDate={buildMaxDate(data)}
            minimumDate={new Date()}
            onChange={(e, date) => {
              if (date) {
                toggleDatePickerVisibility('customReminderDate', false);
                const dates = data.customReminderDates || []
                if (e.type == 'set') {
                  const newDate = new Date(date.setHours(10, 0, 0))
                  dates.push(newDate)
                  setValue('customReminderDates', dates)
                }
              }
              toggleDatePickerVisibility('customReminderDate', false);
            }}
          />
        )}

        {/* {Platform.OS == 'ios' && datePickerVisibility['customReminderDate'] && (
          <>
            <Sheet
              modal
              dismissOnSnapToBottom
              open={datePickerVisibility['customReminderDate']}
              onOpenChange={(open: boolean) => toggleDatePickerVisibility('customReminderDate', open)}
              snapPoints={[50, 100]}
            >
              <Sheet.Frame padding="$4"
                backgroundColor={colorScheme == 'light' ? "#a1c4fd" : 'black'}>
                <Sheet.Handle />
                <YStack space>
                  <DateTimePicker
                    id='customReminderDateIos'
                    value={iosDate || new Date()}
                    mode="date"
                    display="spinner"
                    maximumDate={buildMaxDate(data)}
                    minimumDate={new Date()}
                    onChange={(e, date) => {
                      if (date && Platform.OS == 'ios' && e.type == 'set') {
                        const newDate = new Date(date.setHours(10, 0, 0))
                        setIosDate(newDate)
                      }
                    }}
                  />
                  <Button style={{ backgroundColor: Colors.light.tint }} onPress={confirmCustomIosDate}>Confirm</Button>
                </YStack>
              </Sheet.Frame>
            </Sheet>
          </>)} */}


        <YStack>
          {data.customReminderDates?.length > 0 && (
            <XStack flexWrap="wrap" justifyContent="space-between">
              {data.customReminderDates.map((date, idx) => (
                <XStack
                  key={idx}
                  width="48%"
                  paddingVertical={5}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      backgroundColor: 'orange',
                      borderRadius: 10,
                      padding: 5,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <CalendarRange size={20} color={'white'} marginHorizontal={10} />
                    <Text color={'white'}>{date.toLocaleDateString()}</Text>
                    <X
                      size={20}
                      color={'red'}
                      onPress={() => {
                        const dates = data.customReminderDates;
                        setValue(
                          'customReminderDates',
                          dates.filter((_, index) => index !== idx)
                        );
                      }}
                    />
                  </View>
                </XStack>
              ))}
            </XStack>
          )}
        </YStack>
      </>}
    </>
}


export default RenderCustomReminderDates