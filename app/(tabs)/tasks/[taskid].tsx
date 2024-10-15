
import { ThemedView } from "@/components/ThemedView"
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons"
import DateTimePicker from '@react-native-community/datetimepicker'
import { router, useLocalSearchParams } from "expo-router"
import { FunctionComponent, useState } from "react"
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, useColorScheme, View } from "react-native"
import { Calendar, CalendarList } from 'react-native-calendars';
import { MarkedDates } from "react-native-calendars/src/types"

const lightColors = ['#F0F4C3', '#FFCDD2', '#D1C4E9'];

const TaskEditScreen: FunctionComponent = () => {
    const id = useLocalSearchParams<{ taskid: string }>()
    const colorscheme = useColorScheme()
    const [priority, setPriority] = useState<{ urgent: boolean, moderate: boolean, normal: boolean }>({
        moderate: false,
        normal: true,
        urgent: false
    })
    const [time, setTime] = useState(new Date());
    const [showClock, setShowClock] = useState(false);
    const [showDate, setShowDate] = useState(false);

    const onTimeChange = (event: any, selectedTime: any) => {
        const currentTime = selectedTime || time;
        setShowClock(false);
        setTime(currentTime);
    };

    const onDateChange = (event: any, selectedDate: any) => {
        const currentTime = selectedDate || time;
        setShowDate(false);
        setTime(currentTime);
    };

    const handlePriorityChange = (type: 'urgent' | 'moderate' | 'normal') => {
        setPriority({
            urgent: type === 'urgent',
            moderate: type === 'moderate',
            normal: type === 'normal'
        });
    };

    console.log("id param:",id)

    return <>
        <ScrollView style={{ flex: 1, padding: 10,marginTop:!id.taskid ? 50 :0 }}>
            {!id.taskid && <Text style={{textAlign:'center', fontSize:20, fontWeight:'bold'}}>Add Task/Meeting</Text>}
            {/* {id.taskid && 
            <View style={{flexDirection:'row',alignItems:"center",justifyContent:'space-evenly', marginBottom:20}}>
                <TouchableOpacity style={{position:'absolute',left:0}} onPress={()=>router.back()}>
                <MaterialIcons name="arrow-back" size={22} />
                </TouchableOpacity>
                <Text style={{textAlign:'center', fontSize:20, fontWeight:'bold'}}>Edit Task/Meeting</Text></View>}
             */}
            <Text>Title</Text>
            <ThemedView style={styles.searchContainer}>
                <TextInput style={[styles.searchInput,
                colorscheme == 'light' ? { color: 'black', backgroundColor: 'white' } : { color: 'white', backgroundColor: 'black' }]} placeholder="Title" />
            </ThemedView>

            <Text>Description</Text>
            <ThemedView style={styles.searchContainer}>
                <TextInput style={[styles.searchInput,
                colorscheme == 'light' ? { color: 'black', backgroundColor: 'white' } : { color: 'white', backgroundColor: 'black' }]} placeholder="Description" />
            </ThemedView>

            <Text>Kind</Text>
            <ThemedView style={styles.categoryStyle}>
                <TouchableHighlight
                    activeOpacity={0.7}
                    style={{ borderRadius: 10 }}
                    onPress={() => handlePriorityChange('urgent')}>
                    <View style={[styles.kind,
                    colorscheme == 'light' ? { width: 'auto', backgroundColor: '#E5F3EA' } : { width: 'auto', backgroundColor: 'black' }]} >
                        <MaterialIcons name="task" size={18} color={'green'} />
                        <Text style={{ margin: 'auto' }}>Task</Text>
                        {priority.urgent && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0 }} />}
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    activeOpacity={0.7}
                    style={{ borderRadius: 10 }}
                    onPress={() => handlePriorityChange('moderate')}>
                    <View style={[styles.kind,
                    colorscheme == 'light' ? { width: 'auto', backgroundColor: '#E5F3EA' } : { width: 'auto', backgroundColor: 'black' }]} >
                        <MaterialIcons name="meeting-room" size={18} color={'green'} />
                        <Text style={{ margin: 'auto' }}>Meeting</Text>
                        {priority.moderate && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0 }} />}
                    </View>
                </TouchableHighlight>
            </ThemedView>

            <Text>Priority Level</Text>

            <ThemedView style={styles.categoryStyle}>
                <TouchableHighlight
                    activeOpacity={0.7}
                    style={{ borderRadius: 10 }}
                    onPress={() => handlePriorityChange('urgent')}>
                    <View style={[styles.categoryLabel,
                    colorscheme == 'light' ? { width: 'auto', backgroundColor: lightColors[1] } : { width: 'auto', backgroundColor: 'black' }]} >
                        <Text style={{ margin: 'auto' }}>Urgent</Text>
                        {priority.urgent && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0 }} />}
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    activeOpacity={0.7}
                    style={{ borderRadius: 10 }}
                    onPress={() => handlePriorityChange('moderate')}>
                    <View style={[styles.categoryLabel,
                    colorscheme == 'light' ? { width: 'auto', backgroundColor: lightColors[2] } : { width: 'auto', backgroundColor: 'black' }]} >
                        <Text style={{ margin: 'auto' }}>Moderate</Text>
                        {priority.moderate && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0 }} />}
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    activeOpacity={0.7}
                    style={{ borderRadius: 10 }}
                    onPress={() => handlePriorityChange('normal')}>
                    <View style={[styles.categoryLabel,
                    colorscheme == 'light' ? { width: 'auto', backgroundColor: lightColors[0] } : { width: 'auto', backgroundColor: 'black' }]} >
                        <Text style={{ margin: 'auto' }}>Normal</Text>
                        {priority.normal && <FontAwesome6 name="check" style={{ position: 'absolute', right: 0 }} />}
                    </View>
                </TouchableHighlight>
            </ThemedView>

            <Text style={styles.header}>Set Time & Date</Text>

            <View style={styles.inputRow}>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowClock(true)}>
                    <MaterialIcons name="access-time" size={24} color="#fff" />
                    <Text style={styles.pickerButtonText}>Set Time</Text>
                </TouchableOpacity>
                <Text style={styles.selectedText}>Selected Time: {time.toLocaleTimeString()}</Text>
            </View>

            {/* <View style={styles.inputRow}>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDate(true)}>
                    <MaterialIcons name="calendar-today" size={24} color="#fff" />
                    <Text style={styles.pickerButtonText}>Set Date</Text>
                </TouchableOpacity>
                <Text style={styles.selectedText}>Selected Date: {time.toDateString()}</Text>
            </View> */}

            <HolidayCalendar/>

            <AddSubtasks />

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={{ padding: 10,width:100, alignItems:'center', backgroundColor: 'lightgreen', borderRadius: 10, elevation: 5 }}>
                    <Text>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10,width:100,alignItems:'center', backgroundColor: 'orange', borderRadius: 10, elevation: 5 }}>
                    <Text>Clear</Text>
                </TouchableOpacity>

            </View>
            <View style={{ height: 200 }}></View>

            {showClock && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
                    onChange={onTimeChange}
                    is24Hour={false}
                />
            )}

            {showDate && (
                <DateTimePicker
                    value={time}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
        </ScrollView>
    </>
}

const styles = StyleSheet.create({
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
        flexWrap: 'wrap'
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
    header: {
        // fontSize: 24,
        // fontWeight: 'bold',
        // textAlign: 'center',
        marginBottom: 20,
        // color: '#333',
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

export default TaskEditScreen


import Icon from 'react-native-vector-icons/MaterialIcons'

const AddSubtasks = () => {
    const [subtasks, setSubtasks] = useState<{ title: string, description: string }[]>([]); // Array of subtasks

    const handleAddSubtask = () => {
        setSubtasks([...subtasks, { title: '', description: '' }]);
    };

    const handleSubtaskChange = (index: number, field: 'title' | 'description', value: string) => {
        const updatedSubtasks = [...subtasks];
        updatedSubtasks[index][field] = value;
        setSubtasks(updatedSubtasks);
    };

    const handleDeleteSubtask = (index: number) => {
        const updatedSubtasks = subtasks.filter((_, i) => i !== index); // Remove subtask at index
        setSubtasks(updatedSubtasks);
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

const stylesSubTasks = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        // marginBottom: 15,
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
        height: 80, // Larger input for description
        textAlignVertical: 'top',
    },
    addButton: {
    },
});



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

  const HolidayCalendar: React.FC = () => {
    const holidays: MarkedDatesType = {
      '2024-12-25': { marked: true, dotColor: 'red', customStyles: { container: { backgroundColor: '#FFD700' } }, holiday: 'Christmas' },
      '2024-01-01': { marked: true, dotColor: 'blue', customStyles: { container: { backgroundColor: '#87CEEB' } }, holiday: 'New Year' },
      '2024-07-04': { marked: true, dotColor: 'green', customStyles: { container: { backgroundColor: '#32CD32' } }, holiday: 'Independence Day' },
    };
    const markedDates:MarkedDates = {
        '2024-10-22': {startingDay: true, color: 'green'},
        '2024-10-23': {selected: true, endingDay: true, color: 'lightgreen', textColor: 'gray'},
    }
  
    const [selectedDate, setSelectedDate] = useState<string>('');
  
    const onDayPress = (day: { dateString: string }) => {
      setSelectedDate(day.dateString);
    };
  
    return (
      <View style={stylesHolidayCalendar.container}>
        <Text style={stylesHolidayCalendar.header}>Select a Date</Text>
  
        <Calendar
          onDayPress={onDayPress}
          markingType={'period'}
          markedDates={markedDates}
          showSixWeeks={true}
          enableSwipeMonths={true}
          allowSelectionOutOfRange={true}
          style={stylesHolidayCalendar.calendar}
          theme={{
            // selectedDayBackgroundColor: 'red',
            todayTextColor: 'black',
          }}
        />
  
        {holidays[selectedDate] && (
          <Text style={stylesHolidayCalendar.holidayText}>
            {`Holiday: ${holidays[selectedDate].holiday}`}
          </Text>
        )}
      </View>
    );
  };
  

const stylesHolidayCalendar = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: '#f9f9f9',
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
        marginTop: 20,
    },
});

