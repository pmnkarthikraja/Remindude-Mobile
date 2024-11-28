import { Colors } from "@/constants/Colors"
import { FormData } from "@/utils/category"
import { Fontisto } from "@expo/vector-icons"
import { CalendarDays } from "@tamagui/lucide-icons"
import { useNavigation } from "expo-router"
import moment from "moment"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FieldPath, UseFormSetValue } from "react-hook-form"
import { Animated, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native"
import { Calendar, CalendarUtils } from 'react-native-calendars'
import { ThemedText } from "./ThemedText"
import useOnNavigationFocus from "@/hooks/useNavigationFocus"
import React from "react"


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
    const INITIAL_DATE = useMemo(() => CalendarUtils.getCalendarDateString(datetime || new Date()), [datetime]);
    const [selected, setSelected] = useState<string>(INITIAL_DATE);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const colorscheme = useColorScheme()

    useOnNavigationFocus(()=>{
        if (selected !== INITIAL_DATE) {
            setSelected(INITIAL_DATE);
        }
    })

    useEffect(() => {
        const formattedDate = CalendarUtils.getCalendarDateString(datetime);
        if (datetime && selected !== formattedDate) {
            setSelected(formattedDate);
        }
    }, [datetime]);



    useEffect(() => {
        const debounceUpdate = setTimeout(() => {
            if (selected) {
                const currentDate = new Date(selected) || datetime;
                const updatedDate = new Date(datetime);
                updatedDate.setFullYear(currentDate.getFullYear());
                updatedDate.setMonth(currentDate.getMonth());
                updatedDate.setDate(currentDate.getDate());
                setValue(fieldname, updatedDate);
                triggerReminderDates();
            }
        }, 300); 
    
        return () => clearTimeout(debounceUpdate);
    }, [selected]);


    const toggleCalendarVisibility = useCallback(() => {
        Animated.timing(animatedHeight, {
            toValue: calendarVisible ? 0 : 360,
            duration: 300,
            useNativeDriver: false,
        }).start(() => setCalendarVisible((prev) => !prev));
    }, [calendarVisible, animatedHeight]);

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

    const renderCustomHeader = useMemo(() => {
        const holidayInfo = holidays[selected];
        const iconColor = colorscheme === 'light' ? 'black' : 'white';

        return (
            <TouchableOpacity
                style={[
                    stylesHolidayCalendar.headerContainer,
                    colorscheme === 'light' ? { backgroundColor: '#E4F3E9' } : { backgroundColor: Colors.light.tint },
                ]}
                onPress={toggleCalendarVisibility}
            >
                {holidayInfo ? (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Fontisto name="holiday-village" size={18} color={iconColor} />
                        <ThemedText numberOfLines={1} ellipsizeMode="tail" style={stylesHolidayCalendar.holidayText}>
                            {`${holidayInfo.holiday} on ${selected}`}
                        </ThemedText>
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <CalendarDays size={15} color={iconColor} />
                        <ThemedText style={stylesHolidayCalendar.noHolidayText}>
                            {moment(selected).format('DD-MM-YYYY (dddd)')}
                        </ThemedText>
                    </View>
                )}
                <ThemedText>{calendarVisible ? '▲' : '▼'}</ThemedText>
            </TouchableOpacity>
        );
    }, [selected, holidays, calendarVisible, colorscheme, toggleCalendarVisibility]);


    return (
        <View style={stylesHolidayCalendar.container}>
            {renderCustomHeader}
            <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
            { <Calendar
                key={INITIAL_DATE}
                testId={INITIAL_DATE}
                markingType={'custom'}
                enableSwipeMonths
                current={INITIAL_DATE}
                style={[stylesHolidayCalendar.calendar,{backgroundColor:colorscheme=='light'?Colors.light.tint: '#252C39'}]}
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
            />}
            </Animated.View>
        </View>
    );
};

export default HolidayCalendarOffice


const stylesHolidayCalendar = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16, 
      },
      headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        // color: '#333', 
      },
      noHolidayText: {
        fontSize: 16,
        fontWeight: '400',
        // color: '#555',
      },
      arrow: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00adf5', 
      },
      animatedCalendarContainer: {
        overflow: 'hidden',
      },
      calendar: {
        borderRadius: 8, 
        backgroundColor: Colors.light.tint, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3, 
      },
});