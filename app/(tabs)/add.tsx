import HolidayCalendarOffice from '@/components/HolidayCalenderOffice';
import { categoryImagePaths } from '@/components/OfficeScreen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useUser } from '@/components/userContext';
import { Colors } from '@/constants/Colors';
import { useCreateFormDataMutation, useUpdateFormDataMutation } from '@/hooks/formDataHooks';
import { addDays, calculateReminderDates } from '@/utils/calculateReminder';
import { Category, FormData } from '@/utils/category';
import { buildNotifications } from '@/utils/pushNotifications';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, CalendarRange, Check, Plus, X } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useNavigation } from 'expo-router';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Control, Controller, FieldErrors, FieldPath, useForm } from 'react-hook-form';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import uuid from 'react-native-uuid';
import { Button, Checkbox, H4, H6, Image, Input, ScrollView, Sheet, Text, TextArea, View, XStack, YStack } from 'tamagui';
import TaskEditScreen from './tasks/[taskid]';

const categories: { label: string; value: Category }[] = [
  { label: 'Agreements', value: 'Agreements' },
  { label: 'Purchase Order', value: 'Purchase Order' },
  { label: 'Visa Details', value: 'Visa Details' },
  { label: 'IQAMA Renewals', value: 'IQAMA Renewals' },
  { label: 'Insurance Renewals', value: 'Insurance Renewals' },
  { label: 'House Rental Renewal', value: 'House Rental Renewal' },
];

type AcceptedDateFields = 'startDate' | 'endDate' | 'poIssueDate' | 'poEndDate' | 'entryDate' | 'visaEndDate' | 'visaEntryDate' | 'visaExpiryDate' | 'expiryDate' | 'insuranceStartDate' | 'insuranceEndDate' | 'customReminderDate'

export interface DynamicFormProps {
  isEdit?: boolean,
  editItem?: FormData
}
const DynamicForm: React.FC<DynamicFormProps> = ({
  isEdit,
  editItem
}) => {
  // const [isLoading, setLoading] = useState(false)
  const { control, handleSubmit, setValue, watch, reset, formState, trigger } = useForm<FormData>({
    defaultValues: !!isEdit ? editItem : {
      category: 'Agreements',
      clientName: '',
      endDate: new Date(),
      startDate: new Date(),
      vendorCode: '',
      wantsCustomReminders: false,
      customReminderDates: [],
      completed:false,
    }
  });
  const { loading, user, officeMode } = useUser()
  const [isSheetOpen,setIsSheetOpen]=useState(false)
  const navigation = useNavigation()
  const [datePickerVisibility, setDatePickerVisibility] = useState<{ [key in AcceptedDateFields]: boolean }>({
    startDate: false,
    endDate: false,
    poIssueDate: false,
    poEndDate: false,
    entryDate: false,
    visaEndDate: false,
    visaEntryDate: false,
    expiryDate: false,
    insuranceStartDate: false,
    insuranceEndDate: false,
    customReminderDate: false,
    visaExpiryDate:false,
  });
  const [manualReminders, setManualReminders] = useState(!isEdit ? false : editItem?.wantsCustomReminders && editItem.wantsCustomReminders)
  const [iosDate, setIosDate] = useState<Date | undefined>(undefined)
  const { isLoading: addFormDataLoading, isError: isAddFormdataErr, mutateAsync: addFormData } = useCreateFormDataMutation()
  const { isLoading: updateFormDataLoading, isError: isUpdateFormdataErr, mutateAsync: updateFormData } = useUpdateFormDataMutation()
  const { errors } = formState

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isEdit && !officeMode) {
        setIsSheetOpen(true)
        setManualReminders(false)
      }
    });
    return unsubscribe;
  }, [navigation]);

  const toggleDatePickerVisibility = (fieldName: AcceptedDateFields, isOpen: boolean) => {
    setDatePickerVisibility((prev) => ({
      ...prev,
      [fieldName]: isOpen,
    }));
  };

  const data = watch()

  const doSetReminderDates = () => {
    const newWatch = watch()
    const reminderDates = calculateReminderDates(newWatch).reminderDates
    setValue('reminderDates', reminderDates)
  }

  const debouncedReset = debounce((category: Category) => {
    if (!isEdit) {
      switch (category) {
        case 'Agreements':
          reset({
            category: 'Agreements',
            clientName: '',
            startDate: new Date(),
            endDate: new Date(),
            vendorCode: '',
            wantsCustomReminders: false,
            customReminderDates: [],
            completed:false,
          });
          break;
        case 'Insurance Renewals':
          reset({
            category: 'Insurance Renewals',
            employeeName: '',
            insuranceCompany: '',
            insuranceStartDate: new Date(),
            insuranceEndDate: new Date(),
            wantsCustomReminders: false,
            customReminderDates: [],
            remarks: '',
            reminderDates: [],
            completed:false,
          });
          break;
        case 'IQAMA Renewals':
          reset({
            category: 'IQAMA Renewals',
            employeeName: '',
            expiryDate: new Date(),
            iqamaNumber: '',
            wantsCustomReminders: false,
            customReminderDates: [],
            remarks: '',
            reminderDates: [],
            completed:false,
          });
          break;
        case 'Purchase Order':
          reset({
            category: 'Purchase Order',
            clientName: '',
            consultant: '',
            entryDate: new Date(),
            poIssueDate: new Date(),
            poEndDate: new Date(),
            wantsCustomReminders: false,
            customReminderDates: [],
            remarks: '',
            reminderDates: [],
            completed:false,
          });
          break;
        case 'House Rental Renewal':  
          reset({
            category:'House Rental Renewal',
            consultantName:'',
            houseOwnerName:'',
            customReminderDates:[],
            email:'',
            endDate:new Date(),
            location:'',
            remarks:'',
            reminderDates:[],
            rentAmount:'',
            startDate:new Date(),
            wantsCustomReminders:false,
            completed:false,
          })
        break;
        default:
          reset({
            category: 'Visa Details',
            clientName: '',
            consultantName: '',
            sponsor: '',
            visaEntryDate: new Date(),
            visaEndDate: new Date(),
            wantsCustomReminders: false,
            customReminderDates: [],
            remarks: '',
            reminderDates: [],
            completed:false,
          });
          break;
      }
    }
  }, 300);

  useEffect(() => {
    debouncedReset(data.category);
  }, [data.category]);

  const colorScheme = useColorScheme()


  if (officeMode) {
    return <TaskEditScreen />
  }

  if (loading) {
    return <ActivityIndicator size={'large'} />
  }

  /////////-----------------------------------FORM SUBMISSION-----------------------------------------------
  const onSubmit = async (data: FormData) => {
    if (user != null) {
      if (!isEdit) {
        const id = uuid.v4().toString()
        const withId: FormData = { ...data, id, email: user.email }
        // const withReminderDates = calculateReminderDates(withId)
        await buildNotifications(withId, 'Add')
        try {
          await addFormData(withId)
        } catch (e) {
          console.log("error on axios:", e)
        }
      } else {
        // const withReminderDates = calculateReminderDates(data)
        await buildNotifications(data, 'Update')
        const updateData: FormData = { ...data, email: user.email }

        try {
          await updateFormData(updateData)
        } catch (e) {
          console.log("error on axios:", e)
        }
      }
    }
    setTimeout(() => {
      reset()
      router.navigate('/')
    }, 1000)
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  type FieldName = FieldPath<FormData>

  const renderTextInput = (
    name: FieldName,
    control: Control<FormData>,
    label: string,
    placeholder: string,
    errorss: FieldErrors<FormData>,
    rules?: object
  ) => {
    return (
      <>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <Controller
          control={control}
          name={name}
          rules={{
            required: 'This field is required',
            ...rules,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'light' ? 'white' : 'transparent',
                  color: colorScheme === 'light' ? 'black' : 'white',
                },
              ]}
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={typeof value === 'string' ? value : ''}
            />
          )}
        />

        {errorss[name as keyof FieldErrors<FormData>] && (
          <ThemedText style={styles.errorText}>
            {errorss[name as keyof FieldErrors<FormData>]?.message || ''}
          </ThemedText>
        )}
      </>
    );
  };

  const renderTextBoxInput = (
    name: FieldName,
    control: Control<FormData>,
    label: string,
    placeholder: string,
    rules?: object
  ) => {
    return (
      < >
        <ThemedText style={styles.label}>{label}</ThemedText>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              {(typeof value == 'string' || typeof value == 'undefined') && <TextArea
                style={[styles.textAreaInput, { backgroundColor: colorScheme == 'light' ? 'white' : 'transparent', color: colorScheme == 'light' ? 'black' : 'white' }]}
                placeholder={placeholder}
                rows={4}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />}
            </>
          )}
        />
      </>
    );
  };

  const confirmIosDate = (fieldName: AcceptedDateFields) => {
    if (fieldName !== 'customReminderDate' && iosDate) {
      setValue(fieldName, iosDate)
      toggleDatePickerVisibility(fieldName, false)
    }
  }

  const confirmCustomIosDate = () => {
    if (iosDate) {
      toggleDatePickerVisibility('customReminderDate', false);
      const dates = data.customReminderDates || []
      dates.push(iosDate)
      setValue('customReminderDates', dates)
      setIosDate(undefined)
    }
  }

  const renderDatePicker = (selectedDate: Date, fieldName: AcceptedDateFields) => {
    return <>
      <TouchableOpacity onPress={() => toggleDatePickerVisibility(fieldName, true)}>
        <ThemedText style={styles.dateDisplay}>
          {formatDate(selectedDate || new Date())}
        </ThemedText>

        {datePickerVisibility[fieldName] && fieldName != 'customReminderDate' && Platform.OS == 'ios' && (
          <Sheet
            modal
            dismissOnOverlayPress
            dismissOnSnapToBottom
            open={datePickerVisibility[fieldName]}
            onOpenChange={(open: boolean) => toggleDatePickerVisibility(fieldName, false)}
            snapPoints={[50, 100]}
          >
            <Sheet.Frame padding="$4"
              backgroundColor={colorScheme == 'light' ? "#a1c4fd" : 'black'}>
              <Sheet.Handle />
              <YStack space>
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode='date'
                  display='spinner'
                  onChange={(e, date) => {
                    if (Platform.OS == 'ios' && date) {
                      date.setHours(10, 0, 0, 0) //set 10 am
                      setIosDate(date)
                    } else {
                      if (date) {
                        date.setHours(10, 0, 0, 0) //set 10 am
                        toggleDatePickerVisibility(fieldName, false);
                        setValue(fieldName, date)
                        // const updatedform = calculateReminderDates(data)
                        // setValue('reminderDates',updatedform.reminderDates)
                        doSetReminderDates()
                      }
                      toggleDatePickerVisibility(fieldName, false);
                    }
                  }}
                />
                <Button style={{ backgroundColor: Colors.light.tint }} onPress={() => confirmIosDate(fieldName)}>Confirm</Button>
              </YStack>
            </Sheet.Frame>
          </Sheet>
        )}

        {datePickerVisibility[fieldName] && fieldName != 'customReminderDate' && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode='date'
            display='default'
            onChange={(e, date) => {
              if (date) {
                date.setHours(10, 0, 0, 0) //set 10 am
                toggleDatePickerVisibility(fieldName, false);
                setValue(fieldName, date)
                // const updatedform = calculateReminderDates(data)
                // setValue('reminderDates',updatedform.reminderDates)
                doSetReminderDates()
              }
              toggleDatePickerVisibility(fieldName, false);
            }}
          />
        )}
      </TouchableOpacity>
    </>
  }

  const renderInstantDate = (fieldName: AcceptedDateFields) => {
    return <>
      {fieldName !== 'customReminderDate' && <XStack marginBottom={20}>
        <TouchableOpacity style={styles.box} activeOpacity={0.7}
          onPress={async () => {
            setValue(fieldName, addDays(new Date(), 30));
            doSetReminderDates()
          }}>
          <Text fontSize={10} textAlign='center' color={Colors.light.tint} fontWeight={'bold'}>+30days</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} activeOpacity={0.7}
          onPress={() => {
            setValue(fieldName, addDays(new Date(), 60));
            doSetReminderDates()
          }}>
          <Text fontSize={10} textAlign='center' color={Colors.light.tint} fontWeight={'bold'}>+60days</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} activeOpacity={0.7}
          onPress={() => {
            setValue(fieldName, addDays(new Date(), 90));
            doSetReminderDates()
          }}>
          <Text fontSize={10} textAlign='center' color={Colors.light.tint} fontWeight={'bold'}>+90days</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, { backgroundColor: 'orange', borderColor: 'white' }]} activeOpacity={0.7}
          onPress={() => {
            setValue(fieldName, addDays(new Date(), 0));
            doSetReminderDates()
          }}>
          <Text fontSize={11} textAlign='center' color={'red'} fontWeight={'bold'}>Reset</Text>
        </TouchableOpacity>
      </XStack>}
    </>
  }

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

  const renderCustomReminderDates = () => {
    return <>
      <XStack alignItems="center" gap={'$2'} marginBottom={10}>
        <Checkbox size="$4" backgroundColor={Colors.light.tint}
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
        <Plus color={colorScheme == 'light' ? Colors.light.tint : 'white'}
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

        {Platform.OS == 'ios' && datePickerVisibility['customReminderDate'] && (
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
          </>)}


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

  const renderFormFields = () => {
    switch (data.category) {
      case 'Agreements':
        return <>
          {renderTextInput('clientName', control, 'Client Name', 'Enter Client Name', errors)}
          {renderTextInput('vendorCode', control, 'Vendor Code', 'Enter Vendor Code', errors)}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}
          {/* <ThemedText style={styles.label}>Start Date and End Date</ThemedText> */}
          {/* <ThemedView style={styles.dateDisplayContainer}>
            <CalendarRange size={20} marginVertical={10} paddingHorizontal={20} color={Colors.light.tint} />
            {renderDatePicker(new Date(data.startDate), 'startDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            color: '#007BFF',
            {renderDatePicker(new Date(data.endDate), 'endDate')}
          </ThemedView> */}


          <ThemedText style={styles.label}>Start Date:</ThemedText>

          <HolidayCalendarOffice
            datetime={data.startDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='startDate' triggerReminderDates={doSetReminderDates} />

          <ThemedText style={styles.label}>End Date:</ThemedText>

          {renderInstantDate('endDate')}

          <HolidayCalendarOffice
            triggerReminderDates={doSetReminderDates}
            datetime={data.endDate} isEdit={!!isEdit} setValue={setValue} fieldname='endDate' />

          {renderCustomReminderDates()}


          <View style={styles.caution}>
            <Ionicons name='alert-circle' size={21} color={'yellow'} />
            <ThemedText style={{ color: 'grey' }}>You will get notified on these dates below.</ThemedText>
          </View>

          {data.reminderDates?.concat(data.customReminderDates).map((value, index) =>
            <ThemedText style={{ paddingHorizontal: 30 }} key={index}>{index + 1}{'.'}{moment(value).format('ddd DD-MM-YYYY HH:00:SS a')}</ThemedText>
          )}
        </>
      case 'Purchase Order':
        return <>
          {renderTextInput('clientName', control, 'Client Name', 'Enter Client Name', errors)}
          {renderTextInput('consultant', control, 'Consultant', 'Enter Consultant Name', errors)}
          {renderTextInput('poNumber', control, 'PO Value', 'Enter PO Number', errors)}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}
          <ThemedText style={styles.label}>PO Start Date and End Date</ThemedText>
          {renderInstantDate('poEndDate')}
          <ThemedView style={styles.dateDisplayContainer}>
            <CalendarRange size={20} marginVertical={10} paddingHorizontal={20} color={Colors.light.tint} />
            {renderDatePicker(new Date(data.poIssueDate), 'poIssueDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            {renderDatePicker(new Date(data.poEndDate), 'poEndDate')}
          </ThemedView>
          {renderCustomReminderDates()}
          <ThemedText style={{ color: 'red' }}>You will get notified on these dates.</ThemedText>
          {data.reminderDates?.map((value, index) =>
            <ThemedText key={index}>{moment(value).format('ddd DD-MM-YYYY HH:00:SS a')}</ThemedText>
          )}
          {data.customReminderDates?.map((value, index) =>
            <ThemedText key={index}>{moment(value).format('ddd DD-MM-YYYY HH:00:SS a')}</ThemedText>
          )}
        </>
      case 'IQAMA Renewals':
        return <>
          {renderTextInput('employeeName', control, 'Employee Name', 'Enter Employee Name', errors)}
          {renderTextInput('iqamaNumber', control, 'IQAMA Number', 'Enter IQAMA Number', errors)}
          {renderTextInput('iqamaNumber', control, 'Contract Start Date', 'Enter IQAMA Number', errors)}
          {renderTextInput('iqamaNumber', control, 'Contract End Date', 'Enter IQAMA Number', errors)}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}

          <ThemedText style={styles.label}>IQAMA Expiry Date</ThemedText>
          {renderInstantDate('expiryDate')}
          <ThemedView style={styles.dateDisplayContainer}>
            <CalendarRange size={20} marginVertical={10} paddingHorizontal={20} color={Colors.light.tint} />
            {renderDatePicker(new Date(data.expiryDate), 'expiryDate')}
          </ThemedView>

          {renderCustomReminderDates()}
          <ThemedText style={{ color: 'red' }}>You will get notified on these dates.</ThemedText>
          {data.reminderDates?.map((value, index) =>
            <ThemedText key={index}>{moment(value).format('ddd DD-MM-YYYY HH:00:SS a')}</ThemedText>
          )}
          {data.customReminderDates?.map((value, index) =>
            <ThemedText key={index}>{moment(value).format('ddd DD-MM-YYYY HH:00:SS a')}</ThemedText>
          )}
        </>
      case 'Visa Details':
        return <>
          {renderTextInput('clientName', control, 'Client Name', 'Enter Client Name', errors)}
          {renderTextInput('visaNumber', control, 'Visa Number', 'Enter Visa Number', errors)}
          {renderTextInput('sponsor', control, 'Sponsor', 'Enter Sponsor', errors)}
          {renderTextInput('consultantName', control, 'Consultant Name', 'Enter Consultant Name', errors)}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}

          <ThemedText style={styles.label}>Visa Expiry Date: </ThemedText>
          {renderDatePicker(new Date(), 'visaExpiryDate')}

          <ThemedText style={styles.label}>Visa Entry Date and Exit Before Date</ThemedText>
          {renderInstantDate('visaEndDate')}
          <ThemedView style={styles.dateDisplayContainer}>
            <CalendarRange size={20} marginVertical={10} paddingHorizontal={20} color={Colors.light.tint} />
            {renderDatePicker(new Date(data.visaEntryDate), 'visaEntryDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            {renderDatePicker(new Date(data.visaEndDate), 'visaEndDate')}
          </ThemedView>
          {renderCustomReminderDates()}
          <ThemedText style={{ color: 'red' }}>You will get notified on these dates.</ThemedText>
          {data.reminderDates?.map((value, index) =>
            <ThemedText key={index}>{moment(value).format('DD-MM-YYYY HH:00:SS a')}</ThemedText>
          )}
          {data.customReminderDates?.map((value, index) =>
            <ThemedText key={index}>{moment(value).format('ddd DD-MM-YYYY HH:00:SS a')}</ThemedText>
          )}
        </>
      case 'Insurance Renewals':
        return <>
          {renderTextInput('employeeName', control, 'Employee Name', 'Enter Employee Name', errors)}
          {renderTextInput('insuranceCompany', control, 'Insurance Company', 'Enter Insurance Company', errors)}
          {renderTextInput('insuranceCategory', control, 'Insurance Category', 'Enter Insurance Category', errors)}
          {renderTextInput('value', control, 'Insurance Value', 'Enter Insurance Value', errors)}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}

          <ThemedText style={styles.label}>Insurance Start Date and End Date</ThemedText>
          {renderInstantDate('insuranceEndDate')}
          <ThemedView style={styles.dateDisplayContainer}>
            <CalendarRange size={20} marginVertical={10} paddingHorizontal={20} color={Colors.light.tint} />
            {renderDatePicker(new Date(data.insuranceStartDate), 'insuranceStartDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            {renderDatePicker(new Date(data.insuranceEndDate), 'insuranceEndDate')}
          </ThemedView>
          {renderCustomReminderDates()}
          <ThemedText style={{ color: 'red' }}>You will get notified on these dates.</ThemedText>
          {data.reminderDates?.map((value, index) =>
            <ThemedText key={index}>{moment(value).format('DD-MM-YYYY HH:00:SS a')}</ThemedText>
          )}
          {data.customReminderDates?.map((value, index) =>
            <ThemedText key={index}>{moment(value).format('ddd DD-MM-YYYY HH:00:SS a')}</ThemedText>
          )}
        </>
      case 'House Rental Renewal':
      return <>
        {renderTextInput('houseOwnerName', control, 'House Owner Name', 'Enter House Owner Name', errors)}
        {renderTextInput('location', control, 'Location', 'Enter Location', errors)}
        {renderTextInput('consultantName', control, 'Consultant Name', 'Enter Consultant Name', errors)}
        {renderTextInput('rentAmount', control, 'Rent Amount', 'Enter Rent Amount', errors)}
        {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}

        <ThemedText style={styles.label}>Rental Start Date and End Date</ThemedText>
        {renderInstantDate('endDate')}
        <ThemedView style={styles.dateDisplayContainer}>
          <CalendarRange size={20} marginVertical={10} paddingHorizontal={20} color={Colors.light.tint} />
          {renderDatePicker(new Date(data.startDate), 'startDate')}
          <ThemedText style={styles.dateDisplay}> - </ThemedText>
          {renderDatePicker(new Date(data.endDate), 'endDate')}
        </ThemedView>
        {renderCustomReminderDates()}
        <ThemedText style={{ color: 'red' }}>You will get notified on these dates.</ThemedText>
        {data.reminderDates?.map((value, index) =>
          <ThemedText key={index}>{moment(value).format('DD-MM-YYYY HH:00:SS a')}</ThemedText>
        )}
        {data.customReminderDates?.map((value, index) =>
          <ThemedText key={index}>{moment(value).format('ddd DD-MM-YYYY HH:00:SS a')}</ThemedText>
        )}
      </>
      default:
        return <></>
    }
  }

  return (
    <LinearGradient
      colors={[colorScheme == 'light' ? '#a1c4fd' : '#252C39', colorScheme == 'light' ? 'white' : 'transparent']}
    >
      <Stack.Screen options={{
        headerShown: false
      }} />
      <ScrollView style={{ padding: 30, marginVertical: 30, paddingBottom: 150 }}>
      <XStack
      style={{
        alignItems: 'center',
        padding: 10,
        backgroundColor: colorScheme=='light' ? '#F0F0F0' : '#1A1A1A',
        borderRadius: 8, 
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4, 
        shadowOffset: { width: 0, height: 2 }, 
        elevation: 3,
        marginBottom:10,
      }}
      onPress={() => router.back()}
      space={10} 
    >
      <ArrowLeft color={colorScheme=='light' ? 'black' : 'white'} size={25} />
      <ThemedText
        style={{
          color: colorScheme=='light' ? 'black' : 'white',
          fontSize: 16, 
          fontWeight: '600', 
        }}
      >
        Back
      </ThemedText>
    </XStack>
        <YStack space="$4" alignItems="center" justifyContent="center">
          {/* {!isEdit && <ThemedText style={{ fontSize: 20 }}>Select a Category</ThemedText>} */}
          <XStack
            ai="center"
            jc="space-between"
            backgroundColor={Platform.OS == 'ios' ? colorScheme == 'light' ? '$accentColor' : '$accentBackground' : '$accentColor'}
            borderRadius="$4"
            padding="$3"
            hoverStyle={{
              backgroundColor: '$accentColorHover',
              transform: [{ scale: 1.03 }],
            }}
            pressStyle={{
              transform: [{ scale: 1.03 }],
            }}
            onPress={() => !isEdit && setIsSheetOpen(true)}
          >
            {data.category ? (
              <XStack ai="center" space="$4">
                <Image
                  source={categoryImagePaths[data.category]}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                  }}
                />
                <YStack>
                  <H6 theme="alt2" color="white" >
                    {data.category}
                  </H6>
                </YStack>
                
              </XStack>
            ) : (
              <Text color="white" ai="center">
                Select a Category
              </Text>
            )}
          </XStack>
          {(addFormDataLoading || updateFormDataLoading) && <ActivityIndicator size={'large'} color={Colors.light.tint} />}
          <Sheet
            modal
            open={isSheetOpen}
            dismissOnSnapToBottom
            onOpenChange={(open: boolean) => setIsSheetOpen(open)}
            snapPoints={[50, 100]}
          >
            <Sheet.Frame padding="$4"
              backgroundColor={colorScheme == 'light' ? "#a1c4fd" : 'black'}>
              <Sheet.Handle />
              <YStack space>
                {categories.map((item) => (
                  <Button
                    backgroundColor={Platform.OS == 'ios' ? colorScheme == 'light' ? '$accentColor' : '$accentBackground' : '$accentColor'}
                    key={item.value}
                    onPress={() => {
                      setValue('category', item.value)
                      setIsSheetOpen(false);
                    }}
                    borderRadius="$3"
                  >
                    <H4 theme={'alt2'} color={'white'}>{item.label}</H4>
                  </Button>
                ))}

              </YStack>
            </Sheet.Frame>
          </Sheet>
        </YStack>

        {data.category && renderFormFields()}
        <Button onPress={handleSubmit(onSubmit)} style={styles.submit} backgroundColor={Colors.light.tint} >
          {isEdit ? 'Update' : 'Add'}
        </Button>
        <View style={{ height: 200 }}></View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DynamicForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginVertical: 50,
    color: 'black'
  },
  caution: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    // paddingLeft: 10
  },
  input: {
    height: 40,
    borderColor:Colors.light.tint,
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: 'white',
  },
  textAreaInput: {
    borderColor:Colors.light.tint,
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    color: 'black'
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  datePickerButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateDisplayContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row'
  },
  dateDisplayLabel: {
    fontWeight: 'bold',
  },
  cardHeadImg: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 10,
  },
  submit: {
    marginTop: 40,
    alignSelf: 'center',
    color: 'white'
  },
  dateDisplay: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  box: {
    width: 60,
    height: 30,
    backgroundColor: 'skyblue',
    padding: 6,
    borderRadius: 25,
    elevation: 3,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Colors.light.tint,
    justifyContent: 'center',
    marginRight: 10,
  }
});
