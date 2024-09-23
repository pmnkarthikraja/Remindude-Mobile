import React, { useEffect, useState } from 'react';
import {  TextInput, Text, View, Alert, useColorScheme,StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useForm, Controller, FieldPath, Control, FieldPathValue } from 'react-hook-form';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; 
import { Agreements, PurchaseOrder, VisaDetails, Onboarding, InsuranceRenewals, Category } from '@/utils/category';
import { Button, H3, Image, Sheet, YStack } from 'tamagui';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

const categories: { label: string; value: Category }[] = [
    { label: 'Agreements', value: 'Agreements' },
    { label: 'Purchase Order', value: 'Purchase Order' },
    { label: 'Visa Details', value: 'Visa Details' },
    { label: 'Onboarding', value: 'Onboarding' },
    { label: 'Insurance Renewals', value: 'Insurance Renewals' },
  ];
  


type FormData = Agreements | PurchaseOrder | VisaDetails | Onboarding | InsuranceRenewals;
type AcceptedDateFields = 'startDate' | 'endDate' | 'poIssueDate' | 'poEndDate' | 'entryDate' | 'visaEndDate' | 'visaEntryDate' | 'expiryDate' | 'insuranceStartDate' | 'insuranceEndDate'

const DynamicForm: React.FC = () => {
  const { control, handleSubmit, setValue, watch ,reset } = useForm<FormData>({
    defaultValues:{
      category:'Agreements',
      clientName:'',
      endDate:new Date(),
      startDate:new Date(),
      vendorCode:''
    }
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible]=useState(false)
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


  const data=watch()

  useEffect(() => {
    if (data.category) {
      console.log("cleared",data.category)
      // const defaultValues = {
      //   clientName: '',
      //   vendorCode: '',
      //   consultant: '',
      //   poNumber: '',
      //   employeeName: '',
      //   iqamaNumber: '',
      //   visaNumber: '',
      //   sponsor: '',
      //   insuranceCompany: '',
      //   value: '',
      //   startDate: null,
      //   endDate: null,
      // };

      if (data.category=='Agreements'){
        reset({
          category:'Agreements',
          clientName:'',
          endDate:new Date(),
          startDate:new Date(),
          vendorCode:''
        })
      }else if (data.category=='Insurance Renewals'){
        reset({
          category:'Insurance Renewals',
          employeeName:'',
          insuranceCompany:'',
          insuranceEndDate:new Date(),
          insuranceStartDate:new Date(),
          value:''
        })
      }else if (data.category=='Onboarding'){
        reset({
          category:'Onboarding',
          employeeName:'',
          expiryDate:new Date(),
          iqamaNumber:''
        })
      }else if(data.category=='Purchase Order'){
        reset({
        category:'Purchase Order',
        clientName:'',
        consultant:'',
        entryDate:new Date(),
        poEndDate:new Date(),
        poIssueDate:new Date(),
        poNumber:''
        })
      }else{
        reset({
          category:'Visa Details',
          clientName:'',
          consultantName:'',
          sponsor:'',
          visaEndDate:new Date(),
          visaEntryDate:new Date(),
          visaNumber:''
        })
      }

    }
  }, [data.category, reset]); 

const colorScheme = useColorScheme()
  const onSubmit = (data: FormData) => {
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
         { (typeof value=='string' || typeof value=='undefined')&& <TextInput
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

const renderDatePicker1= (selectedDate:Date, fieldName:AcceptedDateFields)=>{
  return <>
   <TouchableOpacity onPress={() => toggleDatePickerVisibility(fieldName,true)}>
          <ThemedText style={styles.dateDisplay}>
            {formatDate(selectedDate || new Date())}
          </ThemedText>
        </TouchableOpacity>
        {datePickerVisibility[fieldName] && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(e,date)=>{
            if (date){
              setValue(fieldName,date)
              toggleDatePickerVisibility(fieldName,false);
            }
            toggleDatePickerVisibility(fieldName,false);
          }}
        />
      )}
  </>
}

const renderDatePicker = (
  startDate: Date,
  endDate: Date,
  isStartPickerVisible: boolean,
  isEndPickerVisible: boolean,
  setStartPickerVisibility: (visible: boolean) => void,
  setEndPickerVisibility: (visible: boolean) => void,
  handleStartDateChange: (event: any, selectedDate?: Date) => void,
  handleEndDateChange: (event: any, selectedDate?: Date) => void  
) => {
  return (
    <>
      <ThemedText style={styles.label}>Start Date and End Date</ThemedText>
      <ThemedView style={styles.dateDisplayContainer}>
        <TouchableOpacity onPress={() => setStartPickerVisibility(true)}>
          <ThemedText style={styles.dateDisplay}>
            {formatDate(startDate)}
          </ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.dateDisplay}> - </ThemedText>
        <TouchableOpacity onPress={() => setEndPickerVisibility(true)}>
          <ThemedText style={styles.dateDisplay}>
            {formatDate(endDate)}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Start Date Picker */}
      {isStartPickerVisible && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {/* End Date Picker */}
      {isEndPickerVisible && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </>
  );
};

//   const renderFormFields = () => {
//     switch (data.category) {
//       case 'Agreements':
//         return (
//           <>
//         <ThemedText style={styles.label}>Client Name</ThemedText>
//         <Controller
//           control={control}
//           name="clientName"
//           rules={{ required: 'Client Name is required' }}
//           render={({ field: { onChange, onBlur, value } }) => (
//             <TextInput
//               style={styles.input}
//               placeholder="Enter Client Name"
//               onBlur={onBlur}
//               onChangeText={onChange}
//               value={value}
//             />
//           )}
//         />

// <ThemedText style={styles.label}>Vendor Code</ThemedText>
//         <Controller
//           control={control}
//           name="vendorCode"
//           rules={{ required: 'Vendor Code is required' }}
//           render={({ field: { onChange, onBlur, value } }) => (
//             <TextInput
//               style={styles.input}
//               placeholder="Enter Vendor Code"
//               onBlur={onBlur}
//               onChangeText={onChange}
//               value={value}
//             />
//           )}
//         />
//         <ThemedText style={styles.label}>Start Date and End Date</ThemedText>

//         <ThemedView style={styles.dateDisplayContainer}>
//         <TouchableOpacity onPress={() => setStartPickerVisibility(true)}>
//           <ThemedText style={styles.dateDisplay}>
//             {formatDate(data.startDate)}
//           </ThemedText>
//         </TouchableOpacity>

//         <ThemedText style={styles.dateDisplay}> - </ThemedText>

//         <TouchableOpacity onPress={() => setEndPickerVisibility(true)}>
//           <ThemedText style={styles.dateDisplay}>
//             {formatDate(data.endDate)}
//           </ThemedText>
//         </TouchableOpacity>
//       </ThemedView>

//       {isStartPickerVisible && (
//         <DateTimePicker
//           value={data.startDate || new Date()}
//           mode="date"
//           display="default"
//           onChange={handleStartDateChange}
//         />
//       )}

//       {isEndPickerVisible && (
//         <DateTimePicker
//           value={data.endDate || new Date()}
//           mode="date"
//           display="default"
//           onChange={handleEndDateChange}
//         />
//       )}
//           </>
//         );
//       case 'Purchase Order':
//         return (
//           <>
//           </>
//         );
//       default:
//         return null;
//     }
//   };


  const renderFormFields = () => {
    switch (data.category){
      case 'Agreements':
        return <>
        {renderTextInput('clientName',control,'Client Name','Enter Client Name')}
        {renderTextInput('vendorCode',control,'Vendor Code','Enter Vendor Code')}
        <ThemedText style={styles.label}>Start Date and End Date</ThemedText>
        <ThemedView style={styles.dateDisplayContainer}>
        {renderDatePicker1(data.startDate, 'startDate' )} 
        <ThemedText style={styles.dateDisplay}> - </ThemedText>
        {renderDatePicker1(data.endDate, 'endDate')}
          </ThemedView>

        </>
      case 'Purchase Order':
        return <>
        {renderTextInput('clientName',control,'Client Name','Enter Client Name')}
        {renderTextInput('consultant',control,'Consultant','Enter Consultant Name')}
        {renderTextInput('poNumber',control,'PO Number','Enter PO Number')}
        <ThemedText style={styles.label}>PO Issue Date and End Date</ThemedText>
        <ThemedView style={styles.dateDisplayContainer}>
        {renderDatePicker1(data.poIssueDate, 'poIssueDate' )} 
        <ThemedText style={styles.dateDisplay}> - </ThemedText>
        {renderDatePicker1(data.poEndDate, 'poEndDate')}
          </ThemedView>
      </>
      case 'Onboarding':
        return <>
        {renderTextInput('employeeName',control,'Employee Name','Enter Employee Name')}
        {renderTextInput('iqamaNumber',control,'IQAMA Number','Enter IQAMA Number')}
        <ThemedText style={styles.label}>IQAMA Expiry Date</ThemedText>
        {renderDatePicker1(data.expiryDate,'expiryDate' )} 
        </>
      case 'Visa Details':
        return <>
        {renderTextInput('clientName',control,'Client Name','Enter Client Name')}
        {renderTextInput('visaNumber',control,'Visa Number','Enter Visa Number')}
        {renderTextInput('sponsor',control,'Sponsor','Enter Sponsor')}
        {renderTextInput('consultantName',control,'Consultant Name','Enter Consultant Name')}
        <ThemedText style={styles.label}>Visa Entry Date and End Date</ThemedText>
        <ThemedView style={styles.dateDisplayContainer}>
        {renderDatePicker1(data.visaEntryDate, 'visaEntryDate' )} 
        <ThemedText style={styles.dateDisplay}> - </ThemedText>
        {renderDatePicker1(data.visaEndDate, 'visaEndDate')}
          </ThemedView>
        </>
      case 'Insurance Renewals':
        return <>
        {renderTextInput('employeeName',control,'Employee Name','Enter Employee Name')}
        {renderTextInput('insuranceCompany',control,'Insurance Company','Enter Insurance Company')}
        {renderTextInput('value',control,'Insurance Value','Enter Insurance Value')}

        <ThemedText style={styles.label}>Insurance Start Date and End Date</ThemedText>
        <ThemedView style={styles.dateDisplayContainer}>
        {renderDatePicker1(data.insuranceStartDate, 'insuranceStartDate' )} 
        <ThemedText style={styles.dateDisplay}> - </ThemedText>
        {renderDatePicker1(data.insuranceEndDate, 'insuranceEndDate')}
          </ThemedView>
        </>
    }
  }

  return (
    <>
    <View style={{padding:30,marginVertical:20}}>
      <YStack space="$4" alignItems="center" justifyContent="center">
          <ThemedText style={{ fontSize: 20 }}>Select a Category</ThemedText>
          <Button
            size="$6"
            onPress={() => setIsSheetOpen(true)}
          >
            {data.category ? <>
              <Image
                source={require('../../assets/images/categories/Visa.png')}
                style={styles.cardHeadImg}
              />
              <H3 theme={'alt2'} size={'$8'} >{data.category}</H3>
            </> : 'Select a Category'}
          </Button>

          <Sheet
            modal
            open={isSheetOpen}
            onOpenChange={(open: boolean) => setIsSheetOpen(open)}
            snapPoints={[80, 100]}
          >
            <Sheet.Frame padding="$4" backgroundColor={colorScheme == 'light' ? "#a1c4fd" : 'black'}>
              <Sheet.Handle />
              <YStack space>
                {categories.map((item) => (
                  <Button
                    key={item.value}
                    onPress={() => {
                      setValue('category',item.value)
                      setIsSheetOpen(false);
                    }}
                    borderRadius="$3"
                  >
                    {item.label}
                  </Button>
                ))}
              </YStack>
            </Sheet.Frame>
          </Sheet>
        </YStack>

      {data.category && renderFormFields()}
      <Button onPress={handleSubmit(onSubmit)} style={styles.submit} backgroundColor={Colors.light.tint} >Submit</Button>
    </View>
          </>
  );
};

export default DynamicForm;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      marginVertical: 50
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingLeft: 10,
      borderRadius: 8,
      backgroundColor: 'white'
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
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    dateDisplayContainer: {
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 8,
      marginBottom: 20,
      flexDirection:'row'
    },
    dateDisplayLabel: {
      fontWeight: 'bold',
      color: '#333',
    },
    dateDisplay: {
      fontSize: 16,
      color: '#555',
      marginTop: 5,
      fontWeight:'bold',
    },
    cardHeadImg: {
      width: 35,
      height: 35,
      borderRadius: 25,
      marginRight: 10,
    },
    submit:{
      // position:'absolute',
      // bottom:150,
      alignSelf:'center',
      // width:150,
      color:'white'
    }
  });
  