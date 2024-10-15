
import { ThemedView } from "@/components/ThemedView"
import { SubTask, Task } from "@/utils/task"
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons"
import DateTimePicker from '@react-native-community/datetimepicker'
import { useLocalSearchParams } from "expo-router"
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react"
import { Controller, useForm, UseFormSetValue } from "react-hook-form"
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, useColorScheme, View } from "react-native"
import { Calendar, CalendarUtils } from 'react-native-calendars'
import Icon from 'react-native-vector-icons/MaterialIcons'
import uuid from 'react-native-uuid';

const lightColors = ['#F0F4C3', '#FFCDD2', '#D1C4E9'];

const TaskEditScreen: FunctionComponent = () => {
    const id = useLocalSearchParams<{ taskid: string }>()
    const colorscheme = useColorScheme()
    const [showClock, setShowClock] = useState(false);
    const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<Task>({
        defaultValues: {
            taskId: uuid.v4().toString(),
            title: '',
            description: '',
            kind: 'Task',
            priority: 'Normal',
            datetime: new Date(),
            subTasks: []
        }
    });

    const { datetime,subTasks } = watch()

    const onSubmit = (data: Task) => {
        console.log("Task Submitted:", data);
    };

    const onTimeChange = (event: any, selectedTime: any) => {
        const currentTime = selectedTime || datetime;
        const updatedTime = new Date(datetime);
        updatedTime.setHours(currentTime.getHours());
        updatedTime.setMinutes(currentTime.getMinutes());

        setShowClock(false);
        console.log("updated time:",updatedTime.toLocaleTimeString())
        setValue('datetime', updatedTime)
    };


    return <>
        <ScrollView style={{ flex: 1, padding: 10, marginTop: !id.taskid ? 50 : 0 }}>
            {!id.taskid && <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Add Task/Meeting</Text>}
            <Text>Title</Text>

            <Controller
                control={control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field: { onChange, value } }) => (
                    <ThemedView style={styles.searchContainer}>
                        <TextInput
                            style={[styles.searchInput,
                            colorscheme == 'light' ? { color: 'black', backgroundColor: 'white' } : { color: 'white', backgroundColor: 'black' }]}
                            placeholder="Enter task title"
                            onChangeText={onChange}
                            value={value}
                        />
                    </ThemedView>
                )}
            />

            {errors.title && <Text style={{ color: 'red' }}>{errors.title.message}</Text>}


            <Text>Description</Text>
            <Controller
                control={control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field: { onChange, value } }) => (
                    <ThemedView style={styles.searchContainer}>
                        <TextInput
                            style={[styles.searchInput,
                            colorscheme == 'light' ? { color: 'black', backgroundColor: 'white' } : { color: 'white', backgroundColor: 'black' }]}
                            placeholder="Enter task description"
                            onChangeText={onChange}
                            value={value}
                            multiline
                        />
                    </ThemedView>
                )}
            />
            {errors.description && <Text style={{ color: 'red' }}>{errors.description.message}</Text>}

            <Text>Kind</Text>
            <Controller
                control={control}
                name="kind"
                render={({ field: { onChange, value } }) => (
                    <ThemedView style={styles.categoryStyle}>

                        <TouchableHighlight onPress={() => onChange('Task')} activeOpacity={0.7}
                            style={{ borderRadius: 10 }}>
                            <View style={[styles.kind, value == 'Task' && styles.kindSelected,
                            colorscheme == 'light' ? { width: 'auto', backgroundColor: '#E5F3EA' } : { width: 'auto', backgroundColor: 'black' }]} >
                                <MaterialIcons name="task" size={18} color={'green'} />
                                <Text style={{ margin: 'auto' }}>Task</Text>
                            </View>
                        </TouchableHighlight>


                        <TouchableHighlight onPress={() => onChange('Meeting')} activeOpacity={0.7}
                            style={{ borderRadius: 10 }}>
                            <View style={[styles.kind, value == 'Meeting' && styles.kindSelected,
                            colorscheme == 'light' ? { width: 'auto', backgroundColor: '#E5F3EA' } : { width: 'auto', backgroundColor: 'black' }]} >
                                <MaterialIcons name="meeting-room" size={18} color={'green'} />
                                <Text style={{ margin: 'auto' }}>Meeting</Text>
                            </View>
                        </TouchableHighlight>
                    </ThemedView>
                )}
            />


            <Text>Priority Level</Text>

            <Controller
                control={control}
                name="priority"
                render={({ field: { onChange, value } }) => (
                    <ThemedView style={styles.categoryStyle}>
                        <TouchableHighlight
                            activeOpacity={0.7}
                            style={{ borderRadius: 10 }}
                            onPress={() => onChange('Urgent')}>
                            <View style={[styles.categoryLabel,
                            colorscheme == 'light' ? { width: 'auto', backgroundColor: lightColors[1] } : { width: 'auto', backgroundColor: 'black' }]} >
                                <Text style={{ margin: 'auto' }}>Urgent</Text>
                                {value == 'Urgent' && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0 }} />}
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            activeOpacity={0.7}
                            style={{ borderRadius: 10 }}
                            onPress={() => onChange('Moderate')}>
                            <View style={[styles.categoryLabel,
                            colorscheme == 'light' ? { width: 'auto', backgroundColor: lightColors[2] } : { width: 'auto', backgroundColor: 'black' }]} >
                                <Text style={{ margin: 'auto' }}>Moderate</Text>
                                {value == 'Moderate' && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0 }} />}
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            activeOpacity={0.7}
                            style={{ borderRadius: 10 }}
                            onPress={() => onChange('Normal')}>
                            <View style={[styles.categoryLabel,
                            colorscheme == 'light' ? { width: 'auto', backgroundColor: lightColors[0] } : { width: 'auto', backgroundColor: 'black' }]} >
                                <Text style={{ margin: 'auto' }}>Normal</Text>
                                {value == 'Normal' && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0 }} />}
                            </View>
                        </TouchableHighlight>
                    </ThemedView>
                )}
            />

            <Text style={styles.header}>Set Time & Date</Text>
            <View style={styles.inputRow}>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowClock(true)}>
                    <MaterialIcons name="access-time" size={24} color="#fff" />
                    <Text style={styles.pickerButtonText}>Set Time</Text>
                </TouchableOpacity>
                <Text style={styles.selectedText}>Selected Time: {datetime.toLocaleTimeString()}</Text>
            </View>
            
            <HolidayCalendar setValue={setValue} datetime={datetime}/>
            
            <AddSubtasks  setValue={setValue} initialSubTasks={subTasks || []}/>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ padding: 10, width: 100, alignItems: 'center', backgroundColor: 'lightgreen', borderRadius: 10, elevation: 5 }}>
                    <Text>Submit</Text>
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
    </>
}

export default TaskEditScreen


interface AddSubTasksProps{
    setValue:UseFormSetValue<Task>,
    initialSubTasks:SubTask[]
}

const AddSubtasks:FunctionComponent<AddSubTasksProps> = ({
    setValue,
    initialSubTasks:subtasks
}) => {
    const handleAddSubtask = () => {
        setValue('subTasks',[...subtasks, {title:'',description:'',id:uuid.v4().toString()}])
    };

    const handleSubtaskChange = (index: number, field: 'title' | 'description', value: string) => {
        const updatedSubtasks = [...subtasks];
        updatedSubtasks[index][field] = value;
        setValue('subTasks',updatedSubtasks)
    };

    const handleDeleteSubtask = (index: number) => {
        const updatedSubtasks = subtasks.filter((_, i) => i !== index);
        setValue('subTasks',updatedSubtasks)
    };

    return (
        <ScrollView contentContainerStyle={stylesSubTasks.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={stylesSubTasks.header}>Add Checklist 's</Text>
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

interface HolidayCalendarProps{
    setValue: UseFormSetValue<Task>;
    datetime:Date
}

const HolidayCalendar: React.FC<HolidayCalendarProps> = ({
    datetime,
    setValue
}) => {
    const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date())

    const holidays: MarkedDatesType = {
        '2024-12-25': { marked: true, dotColor: 'red', customStyles: { container: { backgroundColor: '#FFD700' } }, holiday: 'Christmas' },
        '2024-01-01': { marked: true, dotColor: 'blue', customStyles: { container: { backgroundColor: '#87CEEB' } }, holiday: 'New Year' },
        '2024-07-04': { marked: true, dotColor: 'green', customStyles: { container: { backgroundColor: '#32CD32' } }, holiday: 'Independence Day' },
    };

    const [selected, setSelected] = useState<string>(INITIAL_DATE);

    useEffect(()=>{
        const currentDate = new Date(selected) || datetime;
        const updatedDate = new Date(datetime);
        updatedDate.setFullYear(currentDate.getFullYear());
        updatedDate.setMonth(currentDate.getMonth());
        updatedDate.setDate(currentDate.getDate());
        setValue('datetime', updatedDate);
    },[selected])

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

    return (
        <View style={stylesHolidayCalendar.container}>
            <Text style={stylesHolidayCalendar.header}>Select a Date</Text>

            {holidays[selected] && (
                <Text style={stylesHolidayCalendar.holidayText}>
                    {`Holiday: ${holidays[selected].holiday}`}
                </Text>
            )}

            <Calendar
                testID={'testid=1'}
                markingType={'multi-dot'}
                enableSwipeMonths
                current={selected}
                style={styles.calendar}
                onDayPress={onDayPress}
                markedDates={marked}
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
    },
    holidayText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'center',
        marginBottom: 20,
    },
});

const stylesSubTasks = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
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
        marginBottom: 10
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
