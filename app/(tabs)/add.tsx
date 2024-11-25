import HolidayCalendarOffice from '@/components/HolidayCalenderOffice';
import { categoryImagePaths } from '@/components/OfficeScreen';
import ShareToUsers from '@/components/ShareToUser';
import { ThemedText } from '@/components/ThemedText';
import { useUser } from '@/components/userContext';
import { Colors } from '@/constants/Colors';
import { useCreateFormDataMutation, useUpdateFormDataMutation } from '@/hooks/formDataHooks';
import { addDays, calculateReminderDates } from '@/utils/calculateReminder';
import { Category, FormData } from '@/utils/category'
import { buildNotifications } from '@/utils/pushNotifications';
import { FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, CalendarRange, Check, NotebookPen, Plus, X } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useNavigation } from 'expo-router';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Control, Controller, FieldErrors, FieldPath, useForm } from 'react-hook-form';
import {
  Modal, Platform, StyleSheet, TouchableOpacity, useColorScheme,
  Animated,
  Dimensions,
  ScrollView,
  View,
  Image
} from 'react-native';
import uuid from 'react-native-uuid';
import { Button, Checkbox,  Input, Sheet, Text, TextArea, XStack, YStack } from 'tamagui';
import TaskEditScreen from './tasks/[taskid]';
import useOnNavigationFocus from '@/hooks/useNavigationFocus';
import LoadingWidget from '@/components/LoadingWidget';
import { useQuery, useRealm } from '@realm/react';
import { BSON, Object } from 'realm'
import Realm from 'realm'


function addToRealmDB(realm:Realm, formData:FormData, isEdit:boolean,){
  const uniqueId = new BSON.ObjectId();
  switch (formData.category){
    case 'Agreements':
      realm.write(() => {
        realm.create(Agreements, {
          _id: uniqueId,
          category: 'Agreements',
          clientName: formData.clientName,
          completed: formData.completed,
          assignedBy: formData.assignedBy || '',
          assignedTo: formData.assignedTo ? {
            email:formData.assignedTo?.email,
            reminderEnabled:formData.assignedTo?.reminderEnabled
          } as AssignedTo : undefined,          
          customReminderDates: formData.customReminderDates,
          endDate: formData.endDate,
          vendorCode: formData.vendorCode,
          email: formData.email,
          remarks: formData.remarks,
          startDate: formData.startDate,
          wantsCustomReminders: formData.wantsCustomReminders,
          reminderDates: formData.reminderDates,
        })
      })
      break;
    case 'IQAMA Renewals':
      realm.write(() => {
        realm.create(IQAMARenewals, {
          _id: uniqueId,
          category: 'IQAMA Renewals',
          completed: formData.completed,
          assignedBy: formData.assignedBy || '',
          assignedTo: formData.assignedTo ? {
            email:formData.assignedTo?.email,
            reminderEnabled:formData.assignedTo?.reminderEnabled
          } as AssignedTo : undefined,
          customReminderDates: formData.customReminderDates,
          endDate: formData.endDate,
          email: formData.email,
          remarks: formData.remarks,
          startDate: formData.startDate,
          wantsCustomReminders: formData.wantsCustomReminders,
          reminderDates: formData.reminderDates,
          employeeName:formData.employeeName,
          iqamaNumber:formData.iqamaNumber,
          expiryDate:formData.expiryDate,
        })
      })
      break;
      case 'Insurance Renewals':
        realm.write(() => {
          realm.create(InsuranceRenewals, {
            _id: uniqueId,
            category: 'Insurance Renewals',
            completed: formData.completed,
            assignedBy: formData.assignedBy || '',
            assignedTo: formData.assignedTo ? {
              email:formData.assignedTo?.email,
              reminderEnabled:formData.assignedTo?.reminderEnabled
            } as AssignedTo : undefined,
            customReminderDates: formData.customReminderDates,
            email: formData.email,
            remarks: formData.remarks,
            wantsCustomReminders: formData.wantsCustomReminders,
            reminderDates: formData.reminderDates,
            employeeName:formData.employeeName,
            childrenInsuranceValues:formData.childrenInsuranceValues,
            employeeInsuranceValue:formData.employeeInsuranceValue,
            insuranceCategory:formData.insuranceCategory,
            insuranceCompany:formData.insuranceCompany,
            insuranceStartDate:formData.insuranceStartDate,
            insuranceEndDate:formData.insuranceEndDate,
            spouseInsuranceValue:formData.spouseInsuranceValue,
            value:formData.value
          })
        })
        break;
        case 'Purchase Order':
          realm.write(() => {
            realm.create(PurchaseOrder, {
              _id: uniqueId,
              category: 'Purchase Order',
              completed: formData.completed,
              assignedBy: formData.assignedBy || '',
              assignedTo: formData.assignedTo ? {
                email:formData.assignedTo?.email,
                reminderEnabled:formData.assignedTo?.reminderEnabled
              } as AssignedTo : undefined,
              customReminderDates: formData.customReminderDates,
              email: formData.email,
              remarks: formData.remarks,
              wantsCustomReminders: formData.wantsCustomReminders,
              reminderDates: formData.reminderDates,
              clientName:formData.clientName,
              consultant:formData.consultant,
              entryDate:formData.entryDate,
              poIssueDate:formData.poIssueDate,
              poEndDate:formData.poEndDate,
              poNumber:formData.poNumber,
            })
          })
          break;
          case 'Visa Details':
            realm.write(() => {
              realm.create(VisaDetails, {
                _id: uniqueId,
                category: 'Visa Details',
                completed: formData.completed,
                assignedBy: formData.assignedBy || '',
                assignedTo: formData.assignedTo ? {
                  email:formData.assignedTo?.email,
                  reminderEnabled:formData.assignedTo?.reminderEnabled
                } as AssignedTo : undefined,
                customReminderDates: formData.customReminderDates,
                email: formData.email,
                remarks: formData.remarks,
                wantsCustomReminders: formData.wantsCustomReminders,
                reminderDates: formData.reminderDates,
                clientName:formData.clientName,
                consultantName:formData.consultantName,
                sponsor:formData.sponsor,
                visaEndDate:formData.visaEndDate,
                visaEntryDate:formData.visaEntryDate,
                visaNumber:formData.visaNumber,
                visaExpiryDate:formData.visaExpiryDate
              })
            })
            break;
            case 'House Rental Renewal':
            realm.write(() => {
              realm.create(HouseRentalRenewal, {
                _id: uniqueId,
                category: 'House Rental Renewal',
                completed: formData.completed,
                assignedBy: formData.assignedBy || '',
                assignedTo: formData.assignedTo ? {
                  email:formData.assignedTo?.email,
                  reminderEnabled:formData.assignedTo?.reminderEnabled
                } as AssignedTo : undefined,
                customReminderDates: formData.customReminderDates,
                email: formData.email,
                remarks: formData.remarks,
                wantsCustomReminders: formData.wantsCustomReminders,
                reminderDates: formData.reminderDates,
                consultantName:formData.consultantName,
                houseOwnerName:formData.houseOwnerName,
                location:formData.location,
                rentAmount:formData.rentAmount,
                startDate:formData.startDate,
                endDate:formData.endDate,
              })
            })
            break;
  }
}


import { Agreements, AssignedTo, HouseRentalRenewal, InsuranceRenewals, IQAMARenewals, PurchaseOrder, VisaDetails } from '../../models/Category'

const { height } = Dimensions.get('window');


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
  const { control, handleSubmit, setValue, watch, reset, formState, setError } = useForm<FormData>({
    defaultValues: !!isEdit ? editItem : {
      category: 'Agreements',
      clientName: '',
      endDate: new Date(),
      startDate: new Date(),
      vendorCode: '',
      wantsCustomReminders: false,
      customReminderDates: [],
      reminderDates: [],
      completed: false,
    }
  });
  const { loading, user, officeMode } = useUser()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
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
    visaExpiryDate: false
  });
  const [manualReminders, setManualReminders] = useState(!isEdit ? false : editItem?.wantsCustomReminders && editItem.wantsCustomReminders)
  const [iosDate, setIosDate] = useState<Date | undefined>(undefined)
  const { isLoading: addFormDataLoading, mutateAsync: addFormData } = useCreateFormDataMutation()
  const { isLoading: updateFormDataLoading, mutateAsync: updateFormData } = useUpdateFormDataMutation()
  const { errors } = formState
  const [childrenValues, setChildrenValues] = useState<string[]>(watch('childrenInsuranceValues') || []);
  const [totalValue, setTotalValue] = useState(watch('value') || '0')
  const realm = useRealm()
  const agreementsData = useQuery('Agreements')
  const colorScheme = useColorScheme()
  const [scaleAnim] = useState(new Animated.Value(1)); // For hover and press effects

  const data = watch()

  const addChild = () => {
    if (data.category == 'Insurance Renewals') {
      if (data.childrenInsuranceValues && data.childrenInsuranceValues.length < 4) {
        setChildrenValues([...childrenValues, '']);
        setValue('childrenInsuranceValues', [...data.childrenInsuranceValues, ''])
        if (data.childrenInsuranceValues.includes('')) {
          setError('childrenInsuranceValues', {
            message: 'Children Field Should not be empty'
          })
        }
        calculateTotalInsuredValue()
      }
    }
  };

  const removeChild = (index: number) => {
    if (data.category == 'Insurance Renewals') {
      const updatedChildren = [...data.childrenInsuranceValues || []];
      updatedChildren.splice(index, 1);
      setChildrenValues(updatedChildren);
      setValue('childrenInsuranceValues', updatedChildren)
      calculateTotalInsuredValue()
    }
  };


  // function to update child value in array
  const updateChildValue = (index: number, value: string) => {
    if (data.category == 'Insurance Renewals') {
      const updatedChildren = [...childrenValues || []];
      updatedChildren[index] = value;
      setChildrenValues(updatedChildren);
      setValue('childrenInsuranceValues', updatedChildren)
      calculateTotalInsuredValue()
    }
  };

  // calculate total sum insured
  const calculateTotalInsuredValue = () => {
    const newData = watch()
    if (newData.category == 'Insurance Renewals') {
      const empValue = parseFloat(newData.employeeInsuranceValue) || 0;
      const spValue = parseFloat(newData.spouseInsuranceValue || '0') || 0;
      const childrenTotal = newData.childrenInsuranceValues?.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
      const totalSum = empValue + spValue + (childrenTotal || 0);
      setTotalValue(totalSum.toFixed(2))
      setValue('value', `${totalSum.toFixed(2)}`)
    }
  }

  // useOnNavigationFocus(() => {
  //   if (!isEdit && !officeMode) {
  //     setIsSheetOpen(true)
  //     setManualReminders(false)
  //     setChildrenValues([])
  //     setTotalValue('0')
  //     doSetReminderDates()
  //   }
  //   if (isEdit && !officeMode) {
  //     setValue('childrenInsuranceValues', watch('childrenInsuranceValues')?.filter(r => r != ''))
  //     setChildrenValues(watch('childrenInsuranceValues')?.filter(r => r != '') || [])
  //   }
  // })

  const toggleDatePickerVisibility = (fieldName: AcceptedDateFields, isOpen: boolean) => {
    setDatePickerVisibility((prev) => ({
      ...prev,
      [fieldName]: isOpen,
    }));
  };

  const doSetReminderDates = () => {
    const newWatch = watch()
    const reminderDates = calculateReminderDates(newWatch).reminderDates
    setValue('reminderDates', reminderDates)
  }

  // const debouncedReset = debounce((category: Category) => {
  //   if (!isEdit) {
  //     switch (category) {
  //       case 'Agreements':
  //         reset({
  //           category: 'Agreements',
  //           clientName: '',
  //           startDate: new Date(),
  //           endDate: new Date(),
  //           vendorCode: '',
  //           wantsCustomReminders: false,
  //           customReminderDates: [],
  //           completed: false,
  //         });
  //         break;
  //       case 'Insurance Renewals':
  //         reset({
  //           category: 'Insurance Renewals',
  //           employeeName: '',
  //           insuranceCompany: '',
  //           insuranceStartDate: new Date(),
  //           insuranceEndDate: new Date(),
  //           wantsCustomReminders: false,
  //           customReminderDates: [],
  //           remarks: '',
  //           reminderDates: [],
  //           completed: false,
  //           childrenInsuranceValues: [],
  //           spouseInsuranceValue: '',
  //           employeeInsuranceValue: ''
  //         });
  //         break;
  //       case 'IQAMA Renewals':
  //         reset({
  //           category: 'IQAMA Renewals',
  //           employeeName: '',
  //           expiryDate: new Date(),
  //           iqamaNumber: '',
  //           wantsCustomReminders: false,
  //           customReminderDates: [],
  //           remarks: '',
  //           reminderDates: [],
  //           completed: false,
  //         });
  //         break;
  //       case 'Purchase Order':
  //         reset({
  //           category: 'Purchase Order',
  //           clientName: '',
  //           consultant: '',
  //           entryDate: new Date(),
  //           poIssueDate: new Date(),
  //           poEndDate: new Date(),
  //           wantsCustomReminders: false,
  //           customReminderDates: [],
  //           remarks: '',
  //           reminderDates: [],
  //           completed: false,
  //         });
  //         break;
  //       case 'House Rental Renewal':
  //         reset({
  //           category: 'House Rental Renewal',
  //           consultantName: '',
  //           houseOwnerName: '',
  //           customReminderDates: [],
  //           email: '',
  //           endDate: new Date(),
  //           location: '',
  //           remarks: '',
  //           reminderDates: [],
  //           rentAmount: '',
  //           startDate: new Date(),
  //           wantsCustomReminders: false,
  //           completed: false,
  //         })
  //         break;
  //       default:
  //         reset({
  //           category: 'Visa Details',
  //           clientName: '',
  //           consultantName: '',
  //           sponsor: '',
  //           visaEntryDate: new Date(),
  //           visaEndDate: new Date(),
  //           wantsCustomReminders: false,
  //           customReminderDates: [],
  //           remarks: '',
  //           reminderDates: [],
  //           completed: false,
  //         });
  //         break;
  //     }
  //   }
  // }, 300);

  // useEffect(() => {
  //   debouncedReset(data.category);
  // }, [data.category]);



  if (officeMode) {
    return <TaskEditScreen />
  }

  if (loading) {
    return <LoadingWidget />
  }

  /////////-----------------------------------FORM SUBMISSION-----------------------------------------------
  const onSubmit = async (formdata: FormData) => {
    const data = formdata.category == 'Insurance Renewals' ? { ...formdata, value: totalValue } : formdata
    console.log("on submit :", formdata)
    if (user != null) {
      if (!isEdit) {
        const id = uuid.v4().toString()
        const withId: FormData = { ...data, id, email: user.email }
        await buildNotifications(withId, 'Add')
        try {
          addToRealmDB(realm,withId,false)
          // await addFormData(withId)
          setTotalValue('0')
        } catch (e) {
          console.log("error on axios:", e)
        }
      } else {
        // const withReminderDates = calculateReminderDates(data)
        await buildNotifications(data, 'Update')
        const updateData: FormData = { ...data, email: user.email }

        try {
          await updateFormData(updateData)
          setTotalValue('0')
        } catch (e) {
          console.log("error on axios:", e)
        }
      }
    }
    // setTimeout(() => {

    // }, 1000)
    router.navigate('/')
    reset()
  };

  type FieldName = FieldPath<FormData>

  const renderTextInput = (
    name: FieldName,
    control: Control<FormData>,
    label: string,
    placeholder: string,
    errorss: FieldErrors<FormData>,
    disabled?: boolean,
    rules?: object,
  ) => {
    return (
      <>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <Controller
          control={control}
          disabled={disabled}
          name={name}
          rules={{
            required: 'This field is required',
            ...rules,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              disabled={disabled}
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

  const renderNumberInput = (
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
              keyboardType='numeric'
              style={[
                styles.input,
                {
                  backgroundColor: colorScheme === 'light' ? 'white' : 'transparent',
                  color: colorScheme === 'light' ? 'black' : 'white',
                },
              ]}
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={(e) => {
                onChange(e)
                calculateTotalInsuredValue()
              }}
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
      <>
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

  const confirmCustomIosDate = () => {
    if (iosDate) {
      toggleDatePickerVisibility('customReminderDate', false);
      const dates = data.customReminderDates || []
      dates.push(iosDate)
      setValue('customReminderDates', dates)
      setIosDate(undefined)
    }
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

  const CheckMark = (): JSX.Element => (<FontAwesome6 name="check"
    style={{ position: 'absolute', right: -5, color: colorScheme == 'light' ? 'black' : 'white' }} />)

  const renderStatus = () => {
    return <View style={styles.categoryStyle}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ borderRadius: 10 }}
        onPress={() => { setValue('completed', true) }}>
        <View style={[styles.categoryLabel, data.completed && styles.borderEnabled,
        colorScheme == 'light' ? { width: 'auto', backgroundColor: 'lightgreen' } :
          { width: 'auto', backgroundColor: '#568E57' }]} >
          <MaterialIcons name='check' color={colorScheme == 'light' ? 'green' : 'white'} size={16} />
          <ThemedText >Completed</ThemedText>
          {data.completed && <CheckMark />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        style={{ borderRadius: 10 }}
        onPress={() => { setValue('completed', false) }}>
        <View style={[styles.categoryLabel, !data.completed && styles.borderEnabled,
        colorScheme == 'light' ? { width: 'auto', backgroundColor: '#FFD580' } : { width: 'auto', backgroundColor: '#99804D' }]} >
          <MaterialCommunityIcons name='progress-clock' color={colorScheme == 'light' ? 'darkorange' : 'white'} size={20} />
          <ThemedText style={{ margin: 'auto' }}>In-Progress</ThemedText>
          {!data.completed && <CheckMark />}
        </View>
      </TouchableOpacity>
    </View>
  }


  const AssignedToComponent = ({ isEdit, data }: { isEdit: boolean, data: FormData }) => {
    if (!isEdit || !data.assignedTo) return null;

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
        <MaterialCommunityIcons name="account-arrow-right" size={20} color="purple" />
        <Text style={styles.text}>
          Assigned to: <ThemedText style={styles.assignedToText}>{data.assignedTo.email}</ThemedText>
        </Text>
      </View>
    );
  };

  const Line = () => {
    return <View style={{ height: 1, borderWidth: 0.2, borderStyle: 'dashed', borderColor: 'skyblue', width: '100%', backgroundColor: '', marginVertical: 5 }}></View>
  }

  const renderFormFields = () => {
    switch (data.category) {
      case 'Agreements':
        return <>
          {/* {isEdit && data.assignedTo && <Text>Assigned to: {data.assignedTo.email}</Text>} */}
          <AssignedToComponent data={data} isEdit={!!isEdit} />

          {renderTextInput('clientName', control, 'Client Name', 'Enter Client Name', errors)}
          <Line />
          {renderTextInput('vendorCode', control, 'Vendor Code', 'Enter Vendor Code', errors)}
          <Line />

          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}
          <Line />

          <ThemedText style={styles.label}>Start Date:</ThemedText>

          <HolidayCalendarOffice
            datetime={data.startDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='startDate' triggerReminderDates={doSetReminderDates} />
          <Line />


          <ThemedText style={styles.label}>End Date:</ThemedText>

          {renderInstantDate('endDate')}
          <Line />


          <HolidayCalendarOffice
            triggerReminderDates={doSetReminderDates}
            datetime={data.endDate} isEdit={!!isEdit} setValue={setValue} fieldname='endDate' />

          <ThemedText style={styles.label}>Status: </ThemedText>

          {renderStatus()}

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

          <ThemedText style={styles.label}>PO Start Date:</ThemedText>

          <HolidayCalendarOffice
            datetime={data.poIssueDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='poIssueDate' triggerReminderDates={doSetReminderDates} />

          <ThemedText style={styles.label}>PO End Date:</ThemedText>
          {renderInstantDate('poEndDate')}
          <HolidayCalendarOffice
            datetime={data.poEndDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='poEndDate' triggerReminderDates={doSetReminderDates} />

          <ThemedText style={styles.label}>Status: </ThemedText>
          {renderStatus()}


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
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}

          <ThemedText style={styles.label}>Contract Start Date:</ThemedText>
          <HolidayCalendarOffice
            datetime={data.startDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='startDate' triggerReminderDates={() => { }} />

          <ThemedText style={styles.label}>Contract End Date:</ThemedText>
          <HolidayCalendarOffice
            datetime={data.endDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='endDate' triggerReminderDates={() => { }} />

          <ThemedText style={styles.label}>IQAMA Expiry Date</ThemedText>
          {renderInstantDate('expiryDate')}

          <HolidayCalendarOffice
            triggerReminderDates={doSetReminderDates}
            datetime={data.expiryDate} isEdit={!!isEdit} setValue={setValue} fieldname='expiryDate' />

          <ThemedText style={styles.label}>Status: </ThemedText>
          {renderStatus()}

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
          {/* {renderDatePicker(new Date(), 'visaExpiryDate')} */}
          <HolidayCalendarOffice
            triggerReminderDates={doSetReminderDates}
            datetime={data.visaExpiryDate} isEdit={!!isEdit} setValue={setValue} fieldname='visaExpiryDate' />

          <ThemedText style={styles.label}>Visa Entry Date:</ThemedText>
          <HolidayCalendarOffice
            datetime={data.visaEntryDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='visaEntryDate' triggerReminderDates={doSetReminderDates} />

          <ThemedText style={styles.label}>Visa Exit Before Date:</ThemedText>
          {renderInstantDate('visaEndDate')}
          <HolidayCalendarOffice
            datetime={data.visaEndDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='visaEndDate' triggerReminderDates={doSetReminderDates} />

          <ThemedText style={styles.label}>Status: </ThemedText>
          {renderStatus()}

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

          {renderNumberInput('employeeInsuranceValue', control, 'Employee Insurance Value', "Enter employee's insured value", errors)}
          {renderNumberInput('spouseInsuranceValue', control, 'Spouse Insurance Value', "Enter spouse's insured value", errors)}



          {childrenValues.map((childValue, index) => (
            <XStack key={index} style={{ alignItems: 'center', gap: 10 }}>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <ThemedText>{`Child ${index + 1} Insurance Value`}</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Input
                    style={[
                      styles.input,
                      {
                        backgroundColor: colorScheme === 'light' ? 'white' : 'transparent',
                        color: colorScheme === 'light' ? 'black' : 'white',
                        width: '90%'
                      },
                    ]} placeholder={`Enter child ${index + 1} insured value`}
                    value={childValue}
                    onChangeText={(value) => updateChildValue(index, value)}
                    keyboardType="numeric"
                  />
                  <Ionicons
                    name="trash"
                    size={20}
                    color="red"
                    onPress={() => removeChild(index)}
                  />
                </View>
              </View>
            </XStack>
          ))}

          {(data.childrenInsuranceValues == undefined || data.childrenInsuranceValues.length < 4) && (
            <Button
              onPress={addChild}
              style={{ backgroundColor: Colors.light.tint, color: 'white', marginVertical: 20, width: 150, height: 30, margin: 'auto', marginTop: 10 }}
            >Add Children +</Button>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 10 }}>
            <NotebookPen color={'grey'} size={15} />
            <Text style={{ textAlign: 'center', color: 'grey', fontSize: 12 }}>You can add upto 4 child</Text>
          </View>

          <YStack alignItems="center" marginVertical={20}>
            <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Total Insured Value</ThemedText>
            <ThemedText style={{ fontSize: 24, color: '#1E88E5' }}>{`$${totalValue || 0}`}</ThemedText>
          </YStack>

          {renderTextInput('value', control, 'Total Insurance Value', 'Calculating Sum Insured Value..', errors, true)}

          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}

          <ThemedText style={styles.label}>Insurance Start Date:</ThemedText>
          <HolidayCalendarOffice
            datetime={data.insuranceStartDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='insuranceStartDate' triggerReminderDates={doSetReminderDates} />

          <ThemedText style={styles.label}>Insurance End Date:</ThemedText>
          {renderInstantDate('insuranceEndDate')}

          <HolidayCalendarOffice
            datetime={data.insuranceEndDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='insuranceEndDate' triggerReminderDates={doSetReminderDates} />

          <ThemedText style={styles.label}>Status: </ThemedText>
          {renderStatus()}

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

          <ThemedText style={styles.label}>Rental Start Date:</ThemedText>
          <HolidayCalendarOffice
            datetime={data.startDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='startDate' triggerReminderDates={doSetReminderDates} />

          <ThemedText style={styles.label}>Rental End Date:</ThemedText>
          {renderInstantDate('endDate')}
          <HolidayCalendarOffice
            datetime={data.endDate} isEdit={!!isEdit} setValue={setValue}
            fieldname='endDate' triggerReminderDates={doSetReminderDates} />

          <ThemedText style={styles.label}>Status: </ThemedText>
          {renderStatus()}

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


  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.03,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };


  return (
    <View
    >
      <Stack.Screen options={{
        headerShown: false
      }} />
      <ScrollView style={{ padding: 30, marginVertical: 30, paddingBottom: 150 }}>
        <XStack
          style={{
            alignItems: 'center',
            padding: 10,
            backgroundColor: colorScheme == 'light' ? '#F0F0F0' : '#1A1A1A',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
            marginBottom: 10,
          }}
          onPress={() => router.back()}
          space={10}
        >
          <ArrowLeft color={colorScheme == 'light' ? 'black' : 'white'} size={25} />
          <ThemedText
            style={{
              color: colorScheme == 'light' ? 'black' : 'white',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            Back
          </ThemedText>
        </XStack>

        {/* <YStack space="$4" alignItems="center" justifyContent="center">
          <XStack
            ai="center"
            jc="space-between"
            backgroundColor={Colors.light.tint}
            borderRadius={25}
            borderStyle='solid'
            borderWidth={0.5}
            borderColor={'white'}
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
              <XStack ai="center" space="$2">
                <Image
                  source={categoryImagePaths[data.category]}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 12,
                  }}
                />
                <YStack>
                  <Text style={{ color: 'white' }}>
                    {data.category}
                  </Text>
                </YStack>

              </XStack>
            ) : (
              <Text color="white" ai="center">
                Select a Category
              </Text>
            )}
          </XStack>
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
                {categories.map((item, index) => (
                  <TouchableOpacity key={index}
                    activeOpacity={0.8}
                    style={[styles.button, { backgroundColor: Colors.light.tint }]}
                    onPress={() => {
                      setIsSheetOpen(false)
                      setValue('category', item.value)
                    }}
                  >
                    <View style={styles.buttonContent}>
                      <Image
                        source={categoryImagePaths[item.value]}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 12,
                        }}
                      />
                      <Text style={[styles.buttonText1, { color: 'aliceblue' }]}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

              </YStack>
            </Sheet.Frame>
          </Sheet>
        </YStack> */}

        <View style={stylesCategorySelector.container}>
          <Animated.View
            style={[
              stylesCategorySelector.categorySelector,
              {
                transform: [{ scale: scaleAnim }],
                backgroundColor: Colors.light.tint,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setIsSheetOpen(true)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
            >
              {data.category ? (
                <View style={stylesCategorySelector.categoryContent}>
                  <Image
                    source={categoryImagePaths[data.category]}
                    style={stylesCategorySelector.categoryImage}
                  />
                  <Text style={stylesCategorySelector.categoryText}>{data.category}</Text>
                </View>
              ) : (
                <Text style={stylesCategorySelector.categoryText}>Select a Category</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Modal
            transparent
            visible={isSheetOpen}
            animationType="slide"
            onRequestClose={() => setIsSheetOpen(false)}
          >
            <View style={stylesCategorySelector.modalBackdrop}>
              <View style={stylesCategorySelector.sheet}>
                <View style={stylesCategorySelector.sheetHandle} />
                {categories.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={stylesCategorySelector.button}
                    onPress={() => {
                      // setSelectedCategory(item.value);
                      setIsSheetOpen(false);
                      setValue('category', item.value)
                    }}
                  >
                    <View style={stylesCategorySelector.buttonContent}>
                      <Image
                        source={categoryImagePaths[item.value]}
                        style={stylesCategorySelector.categoryImage}
                      />
                      <Text style={stylesCategorySelector.buttonText}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </View>


        {data.category && renderFormFields()}

        <ShareToUsers onSelect={(user) => {
          if (user) {
            setValue('assignedTo', {
              email: user.email,
              reminderEnabled: user.enabledNotification,
            })
          } else {
            setValue('assignedTo', undefined)
          }
        }} />

        {(addFormDataLoading || updateFormDataLoading) && <LoadingOverlay />
        }

        <Button onPress={handleSubmit(onSubmit)} style={styles.submit} backgroundColor={Colors.light.tint} >
          {isEdit ? 'Update' : 'Add'}
        </Button>
        <View style={{ height: 200 }}></View>
      </ScrollView>
    </View>
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
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold'
  },
  assignedToText: {
    fontWeight: 'bold',
  },
  caution: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  input: {
    height: 40,
    borderColor: Colors.light.tint,
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: 'white',
  },
  textAreaInput: {
    borderColor: Colors.light.tint,
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    color: 'black'
  },
  label: {
    marginBottom: 5,
    // fontSize: 16,
    // fontWeight: 'bold',
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
    width: 150,
    borderRadius: 20,
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
  },
  categoryStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    width: 'auto',
    gap: 20,
    flexWrap: 'wrap',
  },
  categoryLabel: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  borderEnabled: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'white'
  },
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'white',
    margin: 'auto'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  buttonText1: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const stylesCategorySelector = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: 'white',
    padding: 15,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryImage: {
    width: 20,
    height: 20,
    borderRadius: 12,
    marginRight: 10,
  },
  categoryText: {
    color: 'white',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    // backgroundColor: '#a1c4fd',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.5,
  },
  sheetHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'aliceblue',
    marginLeft: 10,
  },
});

const LoadingOverlay: React.FunctionComponent = () => {
  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={stylesLoadingOverlay.overlay}>
        <LoadingWidget />
      </View>
    </Modal>
  );
};

const stylesLoadingOverlay = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  spinnerContainer: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
  },
});



// const categories: { label: string; value: Category }[] = [
//   { label: 'Agreements', value: 'Agreements' },
//   { label: 'Purchase Order', value: 'Purchase Order' },
//   { label: 'Visa Details', value: 'Visa Details' },
//   { label: 'IQAMA Renewals', value: 'IQAMA Renewals' },
//   { label: 'Insurance Renewals', value: 'Insurance Renewals' },
//   { label: 'House Rental Renewal', value: 'House Rental Renewal' },
// ];



// const AddForm = () =>{
//   return <View>
    
//   </View>
// }


// export default AddForm