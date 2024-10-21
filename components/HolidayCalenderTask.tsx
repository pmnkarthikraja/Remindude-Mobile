// import { View } from "@/components/View"
import { SubTask, Task, TaskPriorityLevel } from "@/utils/task"
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons"
import DateTimePicker from '@react-native-community/datetimepicker'
import { router, useLocalSearchParams, useNavigation } from "expo-router"
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react"
import { Controller, useForm, UseFormSetValue } from "react-hook-form"
import { Platform, ScrollView, StyleProp, StyleSheet, Switch, Text, TextInput, TextStyle, TouchableHighlight, TouchableOpacity, useColorScheme, View, ViewStyle } from "react-native"
import { Calendar, CalendarList, CalendarUtils } from 'react-native-calendars'
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


export interface HolidayCalendarProps {
    setValue: UseFormSetValue<Task>;
    datetime: Date,
    isEdit: boolean
}

const HolidayCalendar: React.FC<HolidayCalendarProps> = ({
    datetime,
    setValue,
    isEdit
}) => {
    const INITIAL_DATE = CalendarUtils.getCalendarDateString((isEdit && datetime) || new Date())
    const navigation = useNavigation()

    const [selected, setSelected] = useState<string>(INITIAL_DATE);
    const colorscheme = useColorScheme()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (!isEdit) {
                setSelected(INITIAL_DATE)
            }
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const currentDate = new Date(selected) || (datetime && isEdit);
        const updatedDate = new Date(datetime);
        updatedDate.setFullYear(currentDate.getFullYear());
        updatedDate.setMonth(currentDate.getMonth());
        updatedDate.setDate(currentDate.getDate());
        setValue('datetime', updatedDate);
    }, [selected])

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

    const marked1 = useMemo(() => {
        return {
            ...Object.keys(holidays).reduce((acc: any, key: any) => {
                acc[key] = {
                    marked: true,
                    dotColor: holidays[key].color,
                    customStyles: { container: { backgroundColor: holidays[key].color } },
                };
                return acc;
            }, {}),
            [selected]: {
                selected: true,
                selectedColor: 'orange',
                selectedTextColor: 'white',
            },
        };
    }, [selected]);

    const renderCustomHeader = () => {
        // Ensure proper type assertion when accessing the holiday info
        const holidayInfo = holidays[selected as keyof HolidayMap];
        return (
            <View style={stylesHolidayCalendar.headerContainer}>
                {holidayInfo ? (
                    <ThemedText style={stylesHolidayCalendar.holidayText}>
                        {`Holiday: ${holidayInfo.holiday} on ${selected}`}
                    </ThemedText>
                ) : (
                    <ThemedText style={stylesHolidayCalendar.noHolidayText}>{`Selected Date: ${selected}`}</ThemedText>
                )}
            </View>
        );
    };

    return (
        <View style={stylesHolidayCalendar.container}>
            {renderCustomHeader()}
            {/* <CalendarList
            markingType={'custom'}
            current={selected}
            onDayPress={onDayPress}
            markedDates={marked}
            theme={{
              calendarBackground: '#1a1a1a',
              dayTextColor: '#d9e1e8',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              arrowColor: '#00adf5',
              monthTextColor: '#ffffff',
              indicatorColor: 'blue',
            }}
            style={styles.calendar}
          /> */}
            <Calendar
                testID={'testid=1'}
                markingType={'custom'}
                enableSwipeMonths
                current={selected}
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
        </View>
    );
};

export default HolidayCalendar


const stylesHolidayCalendar = StyleSheet.create({
    calendar: {
        marginBottom: 10,
        borderRadius: 20,
        backgroundColor: 'black',
        color: 'blue'
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    // calendar: {
    //     marginBottom: 20,
    //     borderRadius: 10,
    //     elevation: 5,
    // },
    holidayText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center',
    },
    noHolidayText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    headerContainer: {
        backgroundColor: '#4B0082',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
});