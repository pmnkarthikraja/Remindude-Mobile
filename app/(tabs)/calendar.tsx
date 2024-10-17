import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar, CalendarList, CalendarUtils } from "react-native-calendars";


interface HolidayCalendarProps {
    datetime: Date,
    isEdit: boolean
}

const HolidayCalendar: React.FC<HolidayCalendarProps> = ({
    datetime,
    isEdit
}) => {
    const INITIAL_DATE = CalendarUtils.getCalendarDateString((isEdit && datetime) || new Date())

    const [selected, setSelected] = useState<string>(INITIAL_DATE);


    useEffect(() => {
        const currentDate = new Date(selected) || (datetime && isEdit);
        const updatedDate = new Date(datetime);
        updatedDate.setFullYear(currentDate.getFullYear());
        updatedDate.setMonth(currentDate.getMonth());
        updatedDate.setDate(currentDate.getDate());
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
                    <Text style={stylesHolidayCalendar.holidayText}>
                        {`Holiday: ${holidayInfo.holiday} on ${selected}`}
                    </Text>
                ) : (
                    <Text style={stylesHolidayCalendar.noHolidayText}>{`Selected Date: ${selected}`}</Text>
                )}
            </View>
        );
    };

    return (
        <>
        <LinearGradient colors={['orange','white']} style={stylesHolidayCalendar.container}>
        <Text style={stylesHolidayCalendar.title}>Calender</Text>
        <View style={stylesHolidayCalendar.container}>
            {renderCustomHeader()}
            <Calendar
                testID={'testid=1'}
                markingType={'custom'}
                enableSwipeMonths
                current={selected}
                style={styles.calendar}
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
        </LinearGradient>
        </>
    );
};

export default HolidayCalendar

const stylesHolidayCalendar = StyleSheet.create({
    title:{
        textAlign:'center',
        padding:50,
        fontSize:30,
        fontWeight:'600',
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
    calendar: {
        marginBottom: 20,
        borderRadius: 10,
        elevation: 5,
    },
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



const styles = StyleSheet.create({
    calendar: {
        marginBottom: 10,
        borderRadius: 20,
        backgroundColor: 'black',
        color: 'blue'
    },
    loadingAnimation:{
        flex:1,
        justifyContent:'center',
        width:'auto',
        height:150
      },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
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
    searchInput: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        elevation: 5,
    },
    categoryLabel: {
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        elevation: 5,
    },
    kind: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        elevation: 5,
    },
    kindSelected: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'green'
    },
    header: {
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    pickerButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
    selectedText: {
        fontSize: 16,
        color: '#333',
    },
})


