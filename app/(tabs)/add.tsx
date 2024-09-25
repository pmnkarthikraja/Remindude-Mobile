import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Agreements, Category, FormData, InsuranceRenewals, OnboardingConsultant, PurchaseOrder, VisaDetails } from '@/utils/category';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Control, Controller, FieldPath, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Button, H3, H4, Image, ScrollView, Sheet, TextArea,Input, View, YStack } from 'tamagui';
import { categoryImagePaths } from './category';
import { useCategoryDataContext } from '@/hooks/useCategoryData';
import { router } from 'expo-router';
import uuid from 'react-native-uuid';

const categories: { label: string; value: Category }[] = [
  { label: 'Agreements', value: 'Agreements' },
  { label: 'Purchase Order', value: 'Purchase Order' },
  { label: 'Visa Details', value: 'Visa Details' },
  { label: 'Onboarding Consultant', value: 'Onboarding Consultant' },
  { label: 'Insurance Renewals', value: 'Insurance Renewals' },
];

type AcceptedDateFields = 'startDate' | 'endDate' | 'poIssueDate' | 'poEndDate' | 'entryDate' | 'visaEndDate' | 'visaEntryDate' | 'expiryDate' | 'insuranceStartDate' | 'insuranceEndDate'

export interface DynamicFormProps{
  isEdit?:boolean,
  editItem?:FormData
}
const DynamicForm: React.FC<DynamicFormProps> = ({
  isEdit,
  editItem
}) => {
  const {formdata,setFormData} = useCategoryDataContext()
  const [isLoading,setLoading]=useState(false)
  const { control, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: !!isEdit ? editItem : {
      category: 'Agreements',
      clientName: '',
      endDate: new Date(),
      startDate: new Date(),
      vendorCode: ''
    }
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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
  });

  const toggleDatePickerVisibility = (fieldName: AcceptedDateFields, isOpen: boolean) => {
    setDatePickerVisibility((prev) => ({
      ...prev,
      [fieldName]: isOpen,
    }));
  };


  const data = watch()

  useEffect(() => {
    if (data.category && !isEdit) {
      if (data.category == 'Agreements') {
        reset({
          category: 'Agreements',
          clientName: '',
          endDate: new Date(),
          startDate: new Date(),
          vendorCode: ''
        })
      } else if (data.category == 'Insurance Renewals') {
        reset({
          category: 'Insurance Renewals',
          employeeName: '',
          insuranceCompany: '',
          insuranceEndDate: new Date(),
          insuranceStartDate: new Date(),
          value: ''
        })
      } else if (data.category == 'Onboarding Consultant') {
        reset({
          category: 'Onboarding Consultant',
          employeeName: '',
          expiryDate: new Date(),
          iqamaNumber: ''
        })
      } else if (data.category == 'Purchase Order') {
        reset({
          category: 'Purchase Order',
          clientName: '',
          consultant: '',
          entryDate: new Date(),
          poEndDate: new Date(),
          poIssueDate: new Date(),
          poNumber: ''
        })
      } else {
        reset({
          category: 'Visa Details',
          clientName: '',
          consultantName: '',
          sponsor: '',
          visaEndDate: new Date(),
          visaEntryDate: new Date(),
          visaNumber: ''
        })
      }

    }
  }, [data.category, reset]);

  const colorScheme = useColorScheme()
  const onSubmit = (data: FormData) => {
    console.log("submitiing")
    if (!isEdit){
    const id = uuid.v4().toString()
    const withId:FormData = {...data,id}
    setFormData([...formdata,withId])
    }else{
    console.log("updating...")
    const newData = formdata.map(item=>item.id==data.id ? data:item)
    setFormData(newData)
    }
    setLoading(true)
    setTimeout(()=>{
      reset()
      router.navigate('/')
      setLoading(false)
    },2000)
    console.log('Formatted Data for API:', data);
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  type fieldName = FieldPath<FormData>

  const renderTextInput = (
    name: fieldName,
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
              {(typeof value == 'string' || typeof value == 'undefined') && <Input
                style={styles.input}
                placeholder={placeholder}
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

  const renderTextBoxInput = (
    name: fieldName,
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
                style={styles.textAreaInput}
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

  const renderDatePicker = (selectedDate: Date, fieldName: AcceptedDateFields) => {
    return <>
      <TouchableOpacity onPress={() => toggleDatePickerVisibility(fieldName, true)}>
        <ThemedText style={styles.dateDisplay}>
          {formatDate(selectedDate || new Date())}
        </ThemedText>
      </TouchableOpacity>
      {datePickerVisibility[fieldName] && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(e, date) => {
            if (date) {
              setValue(fieldName, date)
              toggleDatePickerVisibility(fieldName, false);
            }
            toggleDatePickerVisibility(fieldName, false);
          }}
        />
      )}
    </>
  }

  const renderFormFields = () => {
    switch (data.category) {
      case 'Agreements':
        return <>
          {renderTextInput('clientName', control, 'Client Name', 'Enter Client Name')}
          {renderTextInput('vendorCode', control, 'Vendor Code', 'Enter Vendor Code')}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}

          <ThemedText style={styles.label}>Start Date and End Date</ThemedText>

          <ThemedView style={styles.dateDisplayContainer}>
            {renderDatePicker(data.startDate, 'startDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            {renderDatePicker(data.endDate, 'endDate')}
          </ThemedView>

        </>
      case 'Purchase Order':
        return <>
          {renderTextInput('clientName', control, 'Client Name', 'Enter Client Name')}
          {renderTextInput('consultant', control, 'Consultant', 'Enter Consultant Name')}
          {renderTextInput('poNumber', control, 'PO Number', 'Enter PO Number')}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}
          <ThemedText style={styles.label}>PO Issue Date and End Date</ThemedText>
          <ThemedView style={styles.dateDisplayContainer}>
            {renderDatePicker(data.poIssueDate, 'poIssueDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            {renderDatePicker(data.poEndDate, 'poEndDate')}
          </ThemedView>
        </>
      case 'Onboarding Consultant':
        return <>
          {renderTextInput('employeeName', control, 'Employee Name', 'Enter Employee Name')}
          {renderTextInput('iqamaNumber', control, 'IQAMA Number', 'Enter IQAMA Number')}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}
          <ThemedText style={styles.label}>IQAMA Expiry Date</ThemedText>
          {renderDatePicker(data.expiryDate, 'expiryDate')}
        </>
      case 'Visa Details':
        return <>
          {renderTextInput('clientName', control, 'Client Name', 'Enter Client Name')}
          {renderTextInput('visaNumber', control, 'Visa Number', 'Enter Visa Number')}
          {renderTextInput('sponsor', control, 'Sponsor', 'Enter Sponsor')}
          {renderTextInput('consultantName', control, 'Consultant Name', 'Enter Consultant Name')}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}
          <ThemedText style={styles.label}>Visa Entry Date and End Date</ThemedText>
          <ThemedView style={styles.dateDisplayContainer}>
            {renderDatePicker(data.visaEntryDate, 'visaEntryDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            {renderDatePicker(data.visaEndDate, 'visaEndDate')}
          </ThemedView>
        </>
      case 'Insurance Renewals':
        return <>
          {renderTextInput('employeeName', control, 'Employee Name', 'Enter Employee Name')}
          {renderTextInput('insuranceCompany', control, 'Insurance Company', 'Enter Insurance Company')}
          {renderTextInput('insuranceCategory', control, 'Insurance Category', 'Enter Insurance Category')}
          {renderTextInput('value', control, 'Insurance Value', 'Enter Insurance Value')}
          {renderTextBoxInput('remarks', control, 'Remarks (if any)', 'Enter Remarks')}

          <ThemedText style={styles.label}>Insurance Start Date and End Date</ThemedText>
          <ThemedView style={styles.dateDisplayContainer}>
            {renderDatePicker(data.insuranceStartDate, 'insuranceStartDate')}
            <ThemedText style={styles.dateDisplay}> - </ThemedText>
            {renderDatePicker(data.insuranceEndDate, 'insuranceEndDate')}
          </ThemedView>
        </>
    }
  }

  return (
    <LinearGradient
      colors={[colorScheme == 'light' ? '#a1c4fd' : 'transparent', 'transparent']}
    >
      <ScrollView style={{ padding: 30, marginVertical: 30, paddingBottom:150 }}>
        <YStack space="$4" alignItems="center" justifyContent="center">
          {!isEdit &&<ThemedText style={{ fontSize: 20 }}>Select a Category</ThemedText>}
          <Button
          disabled={!!isEdit}
            size="$6"
            onPress={() => setIsSheetOpen(true)}
          >
            {data.category ? <>
              <Image
                source={categoryImagePaths[data.category]}
                style={styles.cardHeadImg}
              />
              <H3 theme={'alt2'} size={'$8'} color={'$accentColor'}>{data.category}</H3>
            </> : <ThemedText>Select a Category</ThemedText>}
          </Button>
         {isLoading && <ActivityIndicator size={'large'} color={Colors.light.tint}/>}


          <Sheet
            modal
            open={isSheetOpen}
            onOpenChange={(open: boolean) => setIsSheetOpen(open)}
            snapPoints={[50, 100]}
          >
            <Sheet.Frame padding="$4" 
            backgroundColor={colorScheme == 'light' ? "#a1c4fd" : 'black'}>
              <Sheet.Handle />
              <YStack space>
                {categories.map((item) => (
                  <Button
                    key={item.value}
                    onPress={() => {
                      setValue('category', item.value)
                      setIsSheetOpen(false);
                    }}
                    borderRadius="$3"
                  >
                    <H4 theme={'alt2'}  color={'$accentColor'}>{item.label}</H4>
                  </Button>
                ))}
              </YStack>
            </Sheet.Frame>
          </Sheet>
        </YStack>

        {data.category && renderFormFields()}
        <Button onPress={handleSubmit(onSubmit)} style={styles.submit} backgroundColor={Colors.light.tint} >
          {isEdit ? 'Update':'Add'}
          </Button>
          <View style={{height:200}}></View>
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
    color:'black'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    color:'black',
  },
  textAreaInput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    color:'black'
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
    // backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    // color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateDisplayContainer: {
    // backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row'
  },
  dateDisplayLabel: {
    fontWeight: 'bold',
  },
  dateDisplay: {
    fontSize: 16,
    // color: '#555',
    marginTop: 5,
    fontWeight: 'bold',
  },
  cardHeadImg: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 10,
  },
  submit: {
    // position:'absolute',
    // bottom:150,
    alignSelf: 'center',
    // width:150,
    color: 'white'
  }
});
