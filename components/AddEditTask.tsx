
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

const lightColors = ['#F0F4C3', '#FFCDD2', '#D1C4E9'];

const TaskAddEditForm: FunctionComponent = () => {
    const id = useLocalSearchParams<{ taskid: string }>()
    const { setTasks, tasks } = useUser()
    const colorscheme = useColorScheme()
    const [showClock, setShowClock] = useState(false);
    const gotTask = tasks.find(e => e.taskId == id.taskid)
    const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<Task>({
        defaultValues: gotTask ? gotTask : {
            taskId: uuid.v4().toString(),
            title: '',
            description: '',
            kind: 'Task',
            priority: 'Normal',
            datetime: new Date(),
            subTasks: [],
            status: 'In-Progress'
        }
    });
    const [isLoading, setIsLoading] = useState(false)

    const { datetime, subTasks } = watch()

    const onSubmit = async (data: Task) => {
        setIsLoading(true)
        if (gotTask) { //edit
            const alteredTasks = tasks.map(task => {
                if (task.taskId == gotTask.taskId) {
                    return data
                } else {
                    return task
                }
            })
            setTasks(alteredTasks)
            await AsyncStorage.setItem('tasks', JSON.stringify(alteredTasks))
            setIsLoading(false)
            router.back()
            reset()
        } else {
            const newData = { ...data, taskId: uuid.v4().toString() }
            setTasks(e => [...e, newData])
            await AsyncStorage.setItem('tasks', JSON.stringify([...tasks, newData]))
            setIsLoading(false)
            router.back()
            reset()
        }
    };

    const onTimeChange = (event: any, selectedTime: any) => {
        const currentTime = selectedTime || datetime;
        const updatedTime = new Date(datetime);
        updatedTime.setHours(currentTime.getHours());
        updatedTime.setMinutes(currentTime.getMinutes());

        setShowClock(false);
        setValue('datetime', updatedTime)
    };

    const linearGradientUnified = [
        colorscheme == 'light' ? '#a1c4fd' : '#252C39',
        colorscheme == 'light' ? 'white' : 'transparent']


    if (isLoading) {
        <Lottie
            source={require('../assets/Animation/Animation -loading1.json')}
            autoPlay
            loop
            style={styles.loadingAnimation}
        />
    }

    const inputStylesOnDarkTheme: StyleProp<TextStyle> = colorscheme == 'light' ?
        { color: 'black', backgroundColor: 'white' } :
        {
            color: 'white', backgroundColor: 'transparent',
            elevation: 0, borderStyle: 'solid', borderWidth: 0.7, borderColor: 'grey'
        }

    const priorityColor = colorscheme == 'light' ? {
        Urgent: '#FCECEF',
        Moderate: '#F1ECFA',
        Normal: '#E6F7F7'
    } : {
        Urgent: '#CF3F6C',
        Moderate: '#703FC7',
        Normal: '#22A79F'
    }

    const priorityBorderColor = (priority: TaskPriorityLevel): StyleProp<ViewStyle> => {
        return colorscheme == 'light' ? {
            borderStyle: 'solid',
            borderWidth: 2,
            borderColor: priority == 'Urgent' ? '#CF3F6C' : priority == 'Moderate' ? '#703FC7' : '#22A79F',
        } : {
            borderStyle: 'solid',
            borderWidth: 1.5,
            borderColor: 'yellow',

        }
    }

    const CheckMark = (): JSX.Element => (<FontAwesome6 name="check"
        style={{ position: 'absolute', right: 0, color: colorscheme == 'light' ? 'black' : 'white' }} />)

    return <LinearGradient
        colors={linearGradientUnified}
        style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, padding: 10, marginTop: !id.taskid ? 50 : 0 }}>
            {!id.taskid && <ThemedText style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
                Add Task/Meeting</ThemedText>}
            <ThemedText style={styles.title}>Title</ThemedText>

            <Controller
                control={control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field: { onChange, value } }) => (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={[styles.searchInput,
                                inputStylesOnDarkTheme]}
                            placeholderTextColor={colorscheme == 'light' ? 'black' : 'white'}
                            placeholder="Enter task title"
                            onChangeText={onChange}
                            value={value}
                        />
                    </View>
                )}
            />

            {errors.title && <ThemedText style={{ color: 'red' }}>{errors.title.message}</ThemedText>}


            <ThemedText style={styles.title}>Description</ThemedText>
            <Controller
                control={control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field: { onChange, value } }) => (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={[styles.searchInput,
                                inputStylesOnDarkTheme]}
                            placeholderTextColor={colorscheme == 'light' ? 'black' : 'white'}
                            placeholder="Enter task description"
                            onChangeText={onChange}
                            value={value}
                            multiline
                        />
                    </View>
                )}
            />
            {errors.description && <ThemedText style={{ color: 'red' }}>{errors.description.message}</ThemedText>}

            <ThemedText style={styles.title}>Kind</ThemedText>
            <Controller
                control={control}
                name="kind"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.categoryStyle}>

                        <TouchableHighlight onPress={() => onChange('Task')} activeOpacity={0.7}
                            style={{ borderRadius: 10 }}>
                            <View style={[styles.kind, value == 'Task' && styles.kindSelected,
                            colorscheme == 'light' ? { width: 'auto', backgroundColor: '#E5F3EA' } : { width: 'auto', backgroundColor: 'transparent' }]} >
                                <MaterialIcons name="task" size={18} color={'green'} />
                                <ThemedText style={{ margin: 'auto' }}>Task</ThemedText>
                            </View>
                        </TouchableHighlight>


                        <TouchableHighlight onPress={() => onChange('Meeting')} activeOpacity={0.7}
                            style={{ borderRadius: 10 }}>
                            <View style={[styles.kind, value == 'Meeting' && styles.kindSelected,
                            colorscheme == 'light' ? { width: 'auto', backgroundColor: '#E5F3EA' } : { width: 'auto', backgroundColor: 'transparent' }]} >
                                <MaterialIcons name="meeting-room" size={18} color={'green'} />
                                <ThemedText style={{ margin: 'auto' }}>Meeting</ThemedText>
                            </View>
                        </TouchableHighlight>
                    </View>
                )}
            />


            <ThemedText style={styles.title}>Priority Level</ThemedText>

            <Controller
                control={control}
                name="priority"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.categoryStyle}>
                        <TouchableHighlight
                            activeOpacity={0.7}
                            style={{ borderRadius: 10 }}
                            onPress={() => onChange('Urgent')}>
                            <View style={[styles.categoryLabel,
                            value == 'Urgent' && priorityBorderColor('Urgent'),
                            colorscheme == 'light' ? {
                                width: 'auto', backgroundColor: priorityColor.Urgent
                            }
                                : { width: 'auto', backgroundColor: priorityColor.Urgent }]} >
                                <ThemedText style={{ margin: 'auto' }}>Urgent</ThemedText>
                                {value == 'Urgent' && <CheckMark />}
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            activeOpacity={0.7}
                            style={{ borderRadius: 10 }}
                            onPress={() => onChange('Moderate')}>
                            <View style={[styles.categoryLabel,
                            value == 'Moderate' && priorityBorderColor('Moderate'),
                            colorscheme == 'light' ? { width: 'auto', backgroundColor: priorityColor.Moderate }
                                : { width: 'auto', backgroundColor: priorityColor.Moderate }]} >
                                <ThemedText style={{ margin: 'auto' }}>Moderate</ThemedText>
                                {value == 'Moderate' && <CheckMark />}
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            activeOpacity={0.7}
                            style={{ borderRadius: 10 }}
                            onPress={() => onChange('Normal')}>
                            <View style={[styles.categoryLabel,
                            value == 'Normal' && priorityBorderColor('Normal'),
                            colorscheme == 'light' ? { width: 'auto', backgroundColor: priorityColor.Normal } : { width: 'auto', backgroundColor: priorityColor.Normal }]} >
                                <ThemedText style={{ margin: 'auto' }}>Normal</ThemedText>
                                {value == 'Normal' && <CheckMark />}
                            </View>
                        </TouchableHighlight>
                    </View>
                )}
            />
            {gotTask && <>
                <ThemedText>Change Status</ThemedText>
                <Controller
                    control={control}
                    name='status'
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.categoryStyle}>
                            <TouchableHighlight
                                activeOpacity={0.7}
                                style={{ borderRadius: 10 }}
                                onPress={() => onChange('Completed')}>
                                <View style={[styles.categoryLabel,
                                colorscheme == 'light' ? { width: 'auto', backgroundColor: 'lightgreen' } : { width: 'auto', backgroundColor: '#568E57' }]} >
                                    <ThemedText style={{ margin: 'auto' }}>Completed</ThemedText>
                                    {value == 'Completed' && <CheckMark />}
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                activeOpacity={0.7}
                                style={{ borderRadius: 10 }}
                                onPress={() => onChange('Pending')}>
                                <View style={[styles.categoryLabel,
                                colorscheme == 'light' ? { width: 'auto', backgroundColor: '#FFD580' } : { width: 'auto', backgroundColor: '#99804D' }]} >
                                    <ThemedText style={{ margin: 'auto' }}>Pending</ThemedText>
                                    {value == 'Pending' && <CheckMark />}
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                activeOpacity={0.7}
                                style={{ borderRadius: 10 }}
                                onPress={() => onChange('In-Progress')}>
                                <View style={[styles.categoryLabel,
                                colorscheme == 'light' ? { width: 'auto', backgroundColor: 'skyblue' } : { width: 'auto', backgroundColor: '#517B8D' }]} >
                                    <ThemedText style={{ margin: 'auto' }}>In-Progress</ThemedText>
                                    {value == 'In-Progress' && <CheckMark />}
                                </View>
                            </TouchableHighlight>
                        </View>
                    )}
                />
            </>}

            <ThemedText style={[styles.header,styles.title]}>Set Time & Date</ThemedText>
            <View style={styles.inputRow}>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowClock(true)}>
                    <MaterialIcons name="access-time" size={24} color="#fff" />
                    <ThemedText style={styles.pickerButtonText}>Set Time</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.selectedText}>Selected Time: {datetime.toLocaleTimeString()}</ThemedText>
            </View>

            <HolidayCalendar setValue={setValue} datetime={datetime} isEdit={id.taskid != undefined} />

            <Checklist initialSubTasks={subTasks || []} isEdit={!!gotTask} setValue={setValue}/>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ padding: 10, width: 100, alignItems: 'center', backgroundColor: 'lightgreen', borderRadius: 10, elevation: 5 }}>
                    <Text>{gotTask ? 'Update' : 'Submit'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => reset()} style={{ padding: 10, width: 100, alignItems: 'center', backgroundColor: 'orange', borderRadius: 10, elevation: 5 }}>
                    <Text>Clear</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 200 }}></View>

            {showClock && (
                <DateTimePicker
                    value={datetime}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                    onChange={onTimeChange}
                    is24Hour={false}
                />
            )}
        </ScrollView>
    </LinearGradient>
}

export default TaskAddEditForm




interface HolidayCalendarProps {
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
    );
};


const stylesHolidayCalendar = StyleSheet.create({
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
    title:{
        fontSize: 18,
        // fontWeight: 'bold',
        // color: '#007BFF',
    },
    calendar: {
        marginBottom: 10,
        borderRadius: 20,
        backgroundColor: 'black',
        color: 'blue'
    },
    loadingAnimation: {
        flex: 1,
        justifyContent: 'center',
        width: 'auto',
        height: 150
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
    },
})
