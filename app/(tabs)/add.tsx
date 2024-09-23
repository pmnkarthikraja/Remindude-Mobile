
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Platform, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Button, H3, Image, Sheet, YStack } from 'tamagui';

type Category =
  | 'Agreements'
  | 'Purchase Order'
  | 'Visa Details'
  | 'Onboarding'
  | 'Insurance Renewals';

type FormData = {
  clientName: string;
  vendorCode: string;
  startDate: Date;
  endDate: Date;
};

const categories: { label: string; value: Category }[] = [
  { label: 'Agreements', value: 'Agreements' },
  { label: 'Purchase Order', value: 'Purchase Order' },
  { label: 'Visa Details', value: 'Visa Details' },
  { label: 'Onboarding', value: 'Onboarding' },
  { label: 'Insurance Renewals', value: 'Insurance Renewals' },
];


const FormScreen: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const colorScheme = useColorScheme()
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  const showStartDatePicker = () => {
    setStartPickerVisibility(true);
  };

  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setStartPickerVisibility(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const showEndDatePicker = () => {
    setEndPickerVisibility(true);
  };

  const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setEndPickerVisibility(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    data.startDate = startDate;
    data.endDate = endDate;
    console.log('Submitted Data:', data);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <LinearGradient
      colors={[colorScheme == 'light' ? '#a1c4fd' : 'transparent', 'transparent']}
      style={{ flex: 1 }}
    >
      <Animated.ScrollView style={styles.container}>

        {/* <ThemedText style={styles.label}>Select Category</ThemedText>
        <Picker
        style={{color:colorScheme =='light'?'black':'white'}}
          selectedValue={category}
          onValueChange={(value) => {
            if (value) {
              setCategory(value as Category);
            } else {
              setCategory(null);
            }
          }}
        >
          <Picker.Item label="Select a Category" value={null} />
          <Picker.Item label="Agreements" value="Agreements" />
          <Picker.Item label="Purchase Order" value="Purchase Order" />
          <Picker.Item label="Visa Details" value="Visa Details" />
          <Picker.Item label="Onboarding" value="Onboarding" />
          <Picker.Item label="Insurance Renewals" value="Insurance Renewals" />
        </Picker> */}

        <YStack space="$4" alignItems="center" justifyContent="center">
          <ThemedText style={{ fontSize: 20 }}>Select a Category</ThemedText>
          <Button
            size="$6"
            onPress={() => setIsSheetOpen(true)}
          >
            {category ? <>
              <Image
                source={require('../../assets/images/categories/Visa.png')}
                style={styles.cardHeadImg}
              />
              <H3 theme={'alt2'} size={'$8'} >{category}</H3>
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
                      setCategory(item.value);
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

        <ThemedText style={styles.label}>Client Name</ThemedText>
        <Controller
          control={control}
          name="clientName"
          rules={{ required: 'Client Name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter Client Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.clientName && <ThemedText style={styles.errorText}>{errors.clientName.message}</ThemedText>}

        <ThemedText style={styles.label}>Vendor Code</ThemedText>
        <Controller
          control={control}
          name="vendorCode"
          rules={{ required: 'Vendor Code is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter Vendor Code"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.vendorCode && <ThemedText style={styles.errorText}>{errors.vendorCode.message}</ThemedText>}

        <ThemedText style={styles.label}>Start Date</ThemedText>
        <TouchableOpacity style={styles.datePickerButton} onPress={showStartDatePicker}>
          <ThemedText style={styles.buttonText}>Select Start Date</ThemedText>
        </TouchableOpacity>
        {isStartPickerVisible && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
        <ThemedView style={styles.dateDisplayContainer}>
          <ThemedText style={styles.dateDisplayLabel}>Selected Start Date:</ThemedText>
          <ThemedText style={styles.dateDisplay}>{formatDate(startDate)}</ThemedText>
        </ThemedView>

        <ThemedText style={styles.label}>End Date</ThemedText>
        <TouchableOpacity style={styles.datePickerButton} onPress={showEndDatePicker}>
          <ThemedText style={styles.buttonText}>Select End Date</ThemedText>
        </TouchableOpacity>
        {isEndPickerVisible && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
        <ThemedView style={styles.dateDisplayContainer}>
          <ThemedText style={styles.dateDisplayLabel}>Selected End Date:</ThemedText>
          <ThemedText style={styles.dateDisplay}>{formatDate(endDate)}</ThemedText>
        </ThemedView>

        <Button color={'white'} backgroundColor={Colors.light.tint
        } onPress={handleSubmit(onSubmit)} >Submit</Button>
        <View style={{ height: 150 }}></View>
      </Animated.ScrollView>
    </LinearGradient>

  );
};

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
  },
  dateDisplayLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  dateDisplay: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  cardHeadImg: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 10,
  },
});


export default FormScreen;
