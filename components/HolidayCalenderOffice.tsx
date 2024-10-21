// import { View } from "@/components/View"
import { SubTask, Task, TaskPriorityLevel } from "@/utils/task"
import { FontAwesome6, Fontisto, MaterialIcons } from "@expo/vector-icons"
import DateTimePicker from '@react-native-community/datetimepicker'
import { router, useLocalSearchParams, useNavigation } from "expo-router"
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Controller, FieldPath, useForm, UseFormSetValue } from "react-hook-form"
import { Animated, Platform, ScrollView, StyleProp, StyleSheet, Switch, Text, TextInput, TextStyle, TouchableHighlight, TouchableOpacity, useColorScheme, View, ViewStyle } from "react-native"
import { Calendar, CalendarUtils } from 'react-native-calendars'
import Icon from 'react-native-vector-icons/MaterialIcons'
import uuid from 'react-native-uuid';
import { LinearGradient } from "expo-linear-gradient"
import { useUser } from "./userContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Lottie from 'lottie-react-native';
import { ThemedText } from "./ThemedText"
import { Colors } from "@/constants/Colors"
import { XStack } from "tamagui"
import Checklist from "./Checklist"
import { FormData } from "@/utils/category"


export interface HolidayCalendarOfficeProps {
    setValue: UseFormSetValue<FormData>;
    fieldname: FieldPath<FormData>
    datetime: Date,
    isEdit: boolean,
    triggerReminderDates:()=>void
}

const HolidayCalendarOffice: React.FC<HolidayCalendarOfficeProps> = ({
    datetime,
    setValue,
    isEdit,
    fieldname,
    triggerReminderDates
}) => {
    const INITIAL_DATE = CalendarUtils.getCalendarDateString(datetime || new Date())
    const navigation = useNavigation()

    const [selected, setSelected] = useState<string>(INITIAL_DATE);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const colorscheme = useColorScheme()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // if (!isEdit) {
            setSelected(INITIAL_DATE)
            // }
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        setSelected(INITIAL_DATE)
    }, [datetime])

    useEffect(() => {
        const currentDate = new Date(selected) || datetime;
        const updatedDate = new Date(datetime);
        updatedDate.setFullYear(currentDate.getFullYear());
        updatedDate.setMonth(currentDate.getMonth());
        updatedDate.setDate(currentDate.getDate());
        setValue(fieldname, updatedDate);
        triggerReminderDates()
    }, [selected])

    const toggleCalendarVisibility = () => {
        if (calendarVisible) {
            Animated.timing(animatedHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setCalendarVisible(false));
        } else {
            setCalendarVisible(true); 
            Animated.timing(animatedHeight, {
                toValue: 360, 
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const onDayPress = useCallback((day: any) => {
        setSelected(day.dateString);
    }, []);

    const marked = useMemo(() => {
        return {
            ['2024-12-25']: {
                selected: true,
                marked: true,
                dotColor: 'red',
                customStyles: { container: { backgroundColor: '#FFD700', color: 'red' } }
            },
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'orange',
                selectedTextColor: 'red'
            }
        };
    }, [selected]);

    type HolidayMap = {
        [key: string]: {
            holiday: string;
            color: string;
        };
    };

    const holidays: HolidayMap = {
        '2024-12-25': { holiday: 'Christmas', color: '#FFD700' },
        '2025-01-01': { holiday: 'New Year', color: '#87CEEB' },
        '2025-08-15': { holiday: 'Independence Day', color: '#32CD32' },
    };


    const renderCustomHeader = () => {
        const holidayInfo = holidays[selected as keyof HolidayMap];
        return (
            <TouchableOpacity style={stylesHolidayCalendar.headerContainer} onPress={toggleCalendarVisibility}>
                {holidayInfo ? (
                    <View style={{flexDirection:'row',gap:10}}>
                    <Fontisto name="holiday-village" size={18} color="black" />
                    <ThemedText style={stylesHolidayCalendar.holidayText}>
                        {`${holidayInfo.holiday} on ${selected}`}
                    </ThemedText>
                    </View>
                ) : (
                    <ThemedText style={stylesHolidayCalendar.noHolidayText}>{`Selected ${fieldname}: ${selected}`}</ThemedText>
                )}
                    <Text>{calendarVisible ? '▲' : '▼'}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={stylesHolidayCalendar.container}>
            {renderCustomHeader()}
            <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
            <Calendar
                key={INITIAL_DATE}
                testId={INITIAL_DATE}
                markingType={'custom'}
                enableSwipeMonths
                current={INITIAL_DATE}
                style={stylesHolidayCalendar.calendar}
                onDayPress={onDayPress}
                markedDates={marked}
                theme={{
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    arrowColor: '#00adf5',
                    monthTextColor: '#ffffff',
                    indicatorColor: 'blue',
                }}
            />
            </Animated.View>
        </View>
    );
};

export default HolidayCalendarOffice


const stylesHolidayCalendar = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f7f7f7',
        paddingHorizontal: 16, // Standard padding
        // paddingVertical: 20,
      },
      headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E4F3E9', 
        borderRadius: 8, 
        padding: 12, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 16,
      },
      headerTextContainer: {
        flexDirection: 'column',
      },
      holidayText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333', 
      },
      noHolidayText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#555',
      },
      arrow: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00adf5', // Use accent color for arrow
      },
      animatedCalendarContainer: {
        overflow: 'hidden',
      },
      calendar: {
        borderRadius: 8, // Rounded calendar
        backgroundColor: 'black', // Calendar background
        shadowColor: '#000', // Subtle shadow for depth
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3, // For Android
      },
});