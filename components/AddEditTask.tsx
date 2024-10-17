
// import { View } from "@/components/View"
import { SubTask, Task } from "@/utils/task"
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons"
import DateTimePicker from '@react-native-community/datetimepicker'
import { router, useLocalSearchParams, useNavigation } from "expo-router"
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react"
import { Controller, useForm, UseFormSetValue } from "react-hook-form"
import { Platform, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableHighlight, TouchableOpacity, useColorScheme, View, ViewStyle } from "react-native"
import { Calendar, CalendarList, CalendarUtils } from 'react-native-calendars'
import Icon from 'react-native-vector-icons/MaterialIcons'
import uuid from 'react-native-uuid';
import { LinearGradient } from "expo-linear-gradient"
import { useUser } from "./userContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Lottie from 'lottie-react-native';
import { ThemedText } from "./ThemedText"

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
    const [isLoading,setIsLoading]=useState(false)

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
            await AsyncStorage.setItem('tasks',JSON.stringify(alteredTasks))
            setIsLoading(false)
            router.back()
            reset()
        } else {
            const newData = { ...data, taskId: uuid.v4().toString() }
            setTasks(e => [...e, newData])
            await AsyncStorage.setItem('tasks',JSON.stringify([...tasks,newData]))
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

         
        if (isLoading){
            <Lottie
            source={require('../assets/Animation/Animation -loading1.json')}
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
        }
           
    const inputStylesOnDarkTheme:StyleProp<TextStyle> = colorscheme == 'light' ? 
    { color: 'black', backgroundColor: 'white' } : 
    { color: 'white', backgroundColor: 'transparent',
        elevation:0,borderStyle:'solid',borderWidth:0.7,borderColor:'grey' }
    return <>
        <LinearGradient
            colors={linearGradientUnified}
            style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, padding: 10, marginTop: !id.taskid ? 50 : 0 }}>
                {!id.taskid && <ThemedText style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
                    Add Task/Meeting</ThemedText>}
                <ThemedText>Title</ThemedText>

                <Controller
                    control={control}
                    name="title"
                    rules={{ required: "Title is required" }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={[styles.searchInput,
                                    inputStylesOnDarkTheme]}
                                    placeholderTextColor={colorscheme=='light'?'black':'white'}
                                placeholder="Enter task title"
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                    )}
                />

                {errors.title && <ThemedText style={{ color: 'red' }}>{errors.title.message}</ThemedText>}


                <ThemedText>Description</ThemedText>
                <Controller
                    control={control}
                    name="description"
                    rules={{ required: "Description is required" }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={[styles.searchInput,
                                    inputStylesOnDarkTheme]}
                                    placeholderTextColor={colorscheme=='light'?'black':'white'}
                                placeholder="Enter task description"
                                onChangeText={onChange}
                                value={value}
                                multiline
                            />
                        </View>
                    )}
                />
                {errors.description && <ThemedText style={{ color: 'red' }}>{errors.description.message}</ThemedText>}

                <ThemedText>Kind</ThemedText>
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


                <ThemedText>Priority Level</ThemedText>

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
                                colorscheme == 'light' ? { width: 'auto', backgroundColor: lightColors[1] } 
                                : { width: 'auto', backgroundColor: lightColors[1] }]} >
                                    <Text style={{ margin: 'auto' }}>Urgent</Text>
                                    {value == 'Urgent' && <FontAwesome6 name="check" 
                                    style={{ position: 'absolute', right: 0,color:colorscheme=='light'?'black':'green'  }} />}
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                activeOpacity={0.7}
                                style={{ borderRadius: 10 }}
                                onPress={() => onChange('Moderate')}>
                                <View style={[styles.categoryLabel,
                                colorscheme == 'light' ? { width: 'auto', backgroundColor: lightColors[2] } 
                                : { width: 'auto', backgroundColor: lightColors[2] }]} >
                                    <Text style={{ margin: 'auto' }}>Moderate</Text>
                                    {value == 'Moderate' && <FontAwesome6 name="check"  style={{ position: 'absolute', right: 0,color:colorscheme=='light'?'black':'green' }} />}
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                activeOpacity={0.7}
                                style={{ borderRadius: 10 }}
                                onPress={() => onChange('Normal')}>
                                <View style={[styles.categoryLabel,
                                colorscheme == 'light' ? { width: 'auto', backgroundColor: lightColors[0] } : { width: 'auto', backgroundColor: lightColors[0] }]} >
                                    <Text style={{ margin: 'auto' }}>Normal</Text>
                                    {value == 'Normal' && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0,color:colorscheme=='light'?'black':'green'  }} />}
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
                                    colorscheme == 'light' ? { width: 'auto', backgroundColor: 'lightgreen' } : { width: 'auto', backgroundColor: 'black' }]} >
                                        <ThemedText style={{ margin: 'auto' }}>Completed</ThemedText>
                                        {value == 'Completed' && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0 }} />}
                                    </View>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    activeOpacity={0.7}
                                    style={{ borderRadius: 10 }}
                                    onPress={() => onChange('Pending')}>
                                    <View style={[styles.categoryLabel,
                                    colorscheme == 'light' ? { width: 'auto', backgroundColor: '#FFD580' } : { width: 'auto', backgroundColor: 'black' }]} >
                                        <ThemedText style={{ margin: 'auto' }}>Pending</ThemedText>
                                        {value == 'Pending' && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0 }} />}
                                    </View>
                                </TouchableHighlight>
                            </View>
                        )}
                    />
                </>}

                <ThemedText style={styles.header}>Set Time & Date</ThemedText>
                <View style={styles.inputRow}>
                    <TouchableOpacity style={styles.pickerButton} onPress={() => setShowClock(true)}>
                        <MaterialIcons name="access-time" size={24} color="#fff" />
                        <ThemedText style={styles.pickerButtonText}>Set Time</ThemedText>
                    </TouchableOpacity>
                    <ThemedText style={styles.selectedText}>Selected Time: {datetime.toLocaleTimeString()}</ThemedText>
                </View>

                <HolidayCalendar setValue={setValue} datetime={datetime} isEdit={id.taskid != undefined} />

                <AddSubtasks setValue={setValue} initialSubTasks={subTasks || []} />

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
                {/* {showDate && (
                <DateTimePicker
                    value={datetime}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )} */}
            </ScrollView>
        </LinearGradient>
    </>
}

export default TaskAddEditForm


interface AddSubTasksProps {
    setValue: UseFormSetValue<Task>,
    initialSubTasks: SubTask[]
}

const AddSubtasks: FunctionComponent<AddSubTasksProps> = ({
    setValue,
    initialSubTasks: subtasks
}) => {
    const handleAddSubtask = () => {
        setValue('subTasks', [...subtasks, { title: '', description: '', id: uuid.v4().toString() }])
    };

    const handleSubtaskChange = (index: number, field: 'title' | 'description', value: string) => {
        const updatedSubtasks = [...subtasks];
        updatedSubtasks[index][field] = value;
        setValue('subTasks', updatedSubtasks)
    };

    const handleDeleteSubtask = (index: number) => {
        const updatedSubtasks = subtasks.filter((_, i) => i !== index);
        setValue('subTasks', updatedSubtasks)
    };

    return (
        <ScrollView contentContainerStyle={stylesSubTasks.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <ThemedText style={stylesSubTasks.header}>Add Checklist 's</ThemedText>
                <TouchableOpacity onPress={handleAddSubtask}>
                    <Icon name="add-circle" size={40} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {subtasks.map((subtask, index) => (
                <View key={index} style={stylesSubTasks.subtaskContainer}>
                    <View style={stylesSubTasks.subtaskHeader}>
                        <TextInput
                            style={stylesSubTasks.input}
                            placeholder={`Subtask Title ${index + 1}`}
                            value={subtask.title}
                            onChangeText={(value) => handleSubtaskChange(index, 'title', value)}
                        />
                        <TouchableOpacity onPress={() => handleDeleteSubtask(index)}>
                            <Icon name="delete" size={25} color="red" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={[stylesSubTasks.input, stylesSubTasks.descriptionInput]}
                        placeholder={`Subtask Description ${index + 1}`}
                        value={subtask.description}
                        onChangeText={(value) => handleSubtaskChange(index, 'description', value)}
                        multiline
                    />
                </View>
            ))}
        </ScrollView>
    );
};

type HolidayInfo = {
    marked: boolean;
    dotColor?: string;
    customStyles?: {
        container?: object;
        text?: object;
    };
    holiday: string;
};

type MarkedDatesType = {
    [key: string]: HolidayInfo;
};

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

const stylesHolidayCalendar1 = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#2b2b2b',
        borderRadius: 10,
        marginTop: 10,
    },
    headerContainer: {
        backgroundColor: '#4B0082',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
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
    calendar: {
        borderRadius: 10,
        backgroundColor: '#333333',
        elevation: 4,
    },
});

const stylesSubTasks = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtaskContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 10,
    },
    subtaskHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    descriptionInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    addButton: {
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
    },
})
