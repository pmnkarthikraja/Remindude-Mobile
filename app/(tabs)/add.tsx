import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useUser } from '@/components/userContext';
import { Colors } from '@/constants/Colors';
import { useCreateFormDataMutation, useUpdateFormDataMutation } from '@/hooks/formDataHooks';
import { addDays, calculateReminderDates } from '@/utils/calculateReminder';
import { Category, FormData } from '@/utils/category';
import { buildNotifications } from '@/utils/pushNotifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, CalendarRange, Check, Plus, X } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useNavigation } from 'expo-router';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Control, Controller, FieldErrors, FieldPath, useForm } from 'react-hook-form';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import uuid from 'react-native-uuid';
import { Button, Checkbox, H4, H6, Image, Input, ScrollView, Sheet, Text, TextArea, View, XStack, YStack } from 'tamagui';
import { categoryImagePaths } from './category';

const categories: { label: string; value: Category }[] = [
  { label: 'Agreements', value: 'Agreements' },
  { label: 'Purchase Order', value: 'Purchase Order' },
  { label: 'Visa Details', value: 'Visa Details' },
  { label: 'IQAMA Renewals', value: 'IQAMA Renewals' },
  { label: 'Insurance Renewals', value: 'Insurance Renewals' },
];

type AcceptedDateFields = 'startDate' | 'endDate' | 'poIssueDate' | 'poEndDate' | 'entryDate' | 'visaEndDate' | 'visaEntryDate' | 'expiryDate' | 'insuranceStartDate' | 'insuranceEndDate' | 'customReminderDate'

export interface DynamicFormProps {
  isEdit?: boolean,
  editItem?: FormData
}
const DynamicForm: React.FC<DynamicFormProps> = ({
  isEdit,
  editItem
}) => {
  // const [isLoading, setLoading] = useState(false)
  const { control, handleSubmit, setValue, watch, reset, formState:{errors} } = useForm<FormData>({
    defaultValues: !!isEdit ? editItem : {
      category: 'Agreements',
      clientName: '',
      endDate: new Date(),
      startDate: new Date(),
      vendorCode: '',
      wantsCustomReminders: false,
      customReminderDates: []
    }
  });
  
  const [isSheetOpen, setIsSheetOpen] = useState(!isEdit && true);
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
  });
  const [manualReminders, setManualReminders] = useState(!isEdit ? false : editItem?.wantsCustomReminders && editItem.wantsCustomReminders)
  const [iosDate, setIosDate] = useState<Date | undefined>(undefined)
  const {loading,user} = useUser()
  const {isLoading:addFormDataLoading,isError:isAddFormdataErr,mutateAsync:addFormData} = useCreateFormDataMutation()
  const {isLoading:updateFormDataLoading,isError:isUpdateFormdataErr,mutateAsync:updateFormData} = useUpdateFormDataMutation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isEdit) {
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

  const debouncedReset = debounce((category: string) => {
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
            remarks:'',
            reminderDates:[]
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
            remarks:'',
            reminderDates:[]
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
            remarks:'',
            reminderDates:[]
          });
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
            remarks:'',
            reminderDates:[]
          });
          break;
      }
    }
  }, 300);

  useEffect(() => {
    debouncedReset(data.category);
  }, [data.category]);

  const colorScheme = useColorScheme()

  if (loading){
    return <ActivityIndicator size={'large'}/>
  }

  /////////-----------------------------------FORM SUBMISSION-----------------------------------------------
  const onSubmit = async (data: FormData) => {
    if (user!=null){
    if (!isEdit) {
      const id = uuid.v4().toString()
      const withId: FormData = { ...data, id,email:user.email }
      const withReminderDates = calculateReminderDates(withId)
      await buildNotifications(withReminderDates,'Add')
      try{
        await addFormData(withReminderDates)
      }catch(e){
        console.log("error on axios:",e)
      }
    } else {
      const withReminderDates = calculateReminderDates(data)
      await buildNotifications(withReminderDates,'Update')
      const updateData:FormData = {...withReminderDates,email:user.email}

      try{
      await updateFormData(updateData)
      }catch(e){
        console.log("error on axios:",e)
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
                      setIosDate(date)
                    } else {
                      if (date) {
                        toggleDatePickerVisibility(fieldName, false);
                        setValue(fieldName, date)
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
                toggleDatePickerVisibility(fieldName, false);
                setValue(fieldName, date)
              }
              toggleDatePickerVisibility(fieldName, false);
            }}
          />
        )}
      </TouchableOpacity>
    </>
  }

  const renderInstantDate = (fieldName:AcceptedDateFields)=>{
    return <>
      {fieldName !== 'customReminderDate' &&<XStack paddingVertical={10}>
            <TouchableOpacity style={styles.box} activeOpacity={0.7} 
            onPress={()=>setValue(fieldName,addDays(new Date(), 30))}>
              <Text fontSize={10} textAlign='center' color={Colors.light.tint} fontWeight={'bold'}>+30days</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.box} activeOpacity={0.7}
             onPress={()=>setValue(fieldName,addDays(new Date(), 60))}>
              <Text fontSize={10} textAlign='center' color={Colors.light.tint} fontWeight={'bold'}>+60days</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.box} activeOpacity={0.7}
             onPress={()=>setValue(fieldName,addDays(new Date(), 90))}>
              <Text fontSize={10} textAlign='center' color={Colors.light.tint} fontWeight={'bold'}>+90days</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.box,{backgroundColor:'orange',borderColor:'white'}]} activeOpacity={0.7}
             onPress={()=>setValue(fieldName,addDays(new Date(), 0))}>
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
                  dates.push(date)
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
                        setIosDate(date)
                      }
                    }}
                  />
                  <Button style={{ backgroundColor: Colors.light.tint }} onPress={confirmCustomIosDate}>Confirm</Button>
                </YStack>
              </Sheet.Frame>
            </Sheet>
          </>)}
        {data.customReminderDates?.length > 0 && data.customReminderDates.map((date, idx) =>
          <XStack alignItems='center' key={idx}><CalendarRange size={20} color={Colors.light.tint} marginHorizontal={10} />
            <ThemedText key={idx}>{date.toLocaleDateString()}</ThemedText>
            <X size={20} color={'orange'} onPress={() => {
              const dates = data.customReminderDates
              setValue('customReminderDates', dates.filter((date, index) => index != idx))
            }} />
          </XStack>)}
      </>}
    </>
  }

  const renderFormFields = () => {
    const id = `checkbox-${(10 || '').toString().slice(1)}`

    switch (data.category) {
      case 'Agreements':
        return <>
          {renderTextInput('clientName', control, 'Client Name', 'Enter Client Name',errors)}
          {renderTextInput('vendorCode', control, 'Vendor Code', 'Enter Vendor Code',errors)}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}
        

          <ThemedText style={styles.label}>Start Date and End Date</ThemedText>
          {renderInstantDate('endDate')}
          <ThemedView style={styles.dateDisplayContainer}>
            <CalendarRange size={20} marginVertical={10} paddingHorizontal={20} color={Colors.light.tint} />
            {renderDatePicker(new Date(data.startDate), 'startDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            {renderDatePicker(new Date(data.endDate), 'endDate')}
          </ThemedView>

          {renderCustomReminderDates()}


        </>
      case 'Purchase Order':
        return <>
          {renderTextInput('clientName', control, 'Client Name', 'Enter Client Name',errors)}
          {renderTextInput('consultant', control, 'Consultant', 'Enter Consultant Name',errors)}
          {renderTextInput('poNumber', control, 'PO Number', 'Enter PO Number',errors)}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}
          <ThemedText style={styles.label}>PO Issue Date and End Date</ThemedText>
          {renderInstantDate('poEndDate')}
          <ThemedView style={styles.dateDisplayContainer}>
            <CalendarRange size={20} marginVertical={10} paddingHorizontal={20} color={Colors.light.tint} />
            {renderDatePicker(new Date(data.poIssueDate), 'poIssueDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            {renderDatePicker(new Date(data.poEndDate), 'poEndDate')}
          </ThemedView>
          {renderCustomReminderDates()}
        </>
      case 'IQAMA Renewals':
        return <>
          {renderTextInput('employeeName', control, 'Employee Name', 'Enter Employee Name',errors)}
          {renderTextInput('iqamaNumber', control, 'IQAMA Number', 'Enter IQAMA Number',errors)}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}

          <ThemedText style={styles.label}>IQAMA Expiry Date</ThemedText>
          {renderInstantDate('expiryDate')}
          <ThemedView style={styles.dateDisplayContainer}>
            <CalendarRange size={20} marginVertical={10} paddingHorizontal={20} color={Colors.light.tint} />
            {renderDatePicker(new Date(data.expiryDate), 'expiryDate')}
          </ThemedView>

          {renderCustomReminderDates()}
        </>
      case 'Visa Details':
        return <>
          {renderTextInput('clientName', control, 'Client Name', 'Enter Client Name',errors)}
          {renderTextInput('visaNumber', control, 'Visa Number', 'Enter Visa Number',errors)}
          {renderTextInput('sponsor', control, 'Sponsor', 'Enter Sponsor',errors)}
          {renderTextInput('consultantName', control, 'Consultant Name', 'Enter Consultant Name',errors)}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}
          <ThemedText style={styles.label}>Visa Entry Date and End Date</ThemedText>
          {renderInstantDate('visaEndDate')}
          <ThemedView style={styles.dateDisplayContainer}>
            <CalendarRange size={20} marginVertical={10} paddingHorizontal={20} color={Colors.light.tint} />
            {renderDatePicker(new Date(data.visaEntryDate), 'visaEntryDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            {renderDatePicker(new Date(data.visaEndDate), 'visaEndDate')}
          </ThemedView>
          {renderCustomReminderDates()}
        </>
      case 'Insurance Renewals':
        return <>
          {renderTextInput('employeeName', control, 'Employee Name', 'Enter Employee Name',errors)}
          {renderTextInput('insuranceCompany', control, 'Insurance Company', 'Enter Insurance Company',errors)}
          {renderTextInput('insuranceCategory', control, 'Insurance Category', 'Enter Insurance Category',errors)}
          {renderTextInput('value', control, 'Insurance Value', 'Enter Insurance Value',errors)}
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
        </>
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
        <XStack style={{ alignItems: 'center' }} onPress={() => router.back()}>
          <ArrowLeft color={colorScheme == 'light' ? 'black' : 'white'} size={25} />
          <ThemedText>Back</ThemedText>
        </XStack>
        <YStack space="$4" alignItems="center" justifyContent="center">
          {!isEdit && <ThemedText style={{ fontSize: 20 }}>Select a Category</ThemedText>}
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
            onOpenChange={(open: boolean) => setIsSheetOpen(open)}
            snapPoints={[90, 100]}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: 'white',
  },
  textAreaInput: {
    borderColor: 'gray',
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
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  dateDisplay: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  box:{
    width:60,
    height:30,
    backgroundColor:'skyblue',
    padding:6,
    borderRadius:25,
    elevation:3,
    borderWidth:2,
    borderStyle:'solid',
    borderColor:Colors.light.tint,
    justifyContent:'center',
    marginRight:10,
  }
});
