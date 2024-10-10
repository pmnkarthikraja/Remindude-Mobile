import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, Image, TextInput } from 'react-native';
import moment from 'moment'; 
import Ionicons from '@expo/vector-icons/Ionicons';

const TaskScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [tasks, setTasks] = useState(dummyTasks[selectedDate] || []);
  
  const getDates = useCallback(() => {
    const today = moment();
    return Array.from({ length: 100 }, (_, index) => today.clone().add(index , 'days')); 
  }, []);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setTasks(dummyTasks[date] || []);
  };


  const renderCalendar = () => {
    const dates = getDates();

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarContainer}>
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDateChange(date.format('YYYY-MM-DD'))}
            style={[
              styles.calendarDay,
              selectedDate === date.format('YYYY-MM-DD') ? styles.selectedDay : null,
            ]}
          >
            <View style={[styles.dateCard, selectedDate==date.format('YYYY-MM-DD') ? {backgroundColor:'orange', borderRadius:25} : {}]}>
            <Text style={styles.dayText}>{date.format('DD')}</Text>
            <Text style={styles.weekDayText}>{date.format('ddd')}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
        <View style={{height:20}}></View>
      
      <View style={styles.header}>
        <Text style={styles.dateText}>{moment(selectedDate).format('MMMM DD')}</Text>
        <Text style={styles.taskCount}>{tasks.length} tasks today</Text>
      </View>


      <View style={styles.searchContainer}>
      <TextInput style={styles.searchInput} placeholder="Search" />
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="options-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>

      {renderCalendar()}
      <ListTasks/>
      <View style={{height:60}}></View>

    </View>
  );
};

// Dummy tasks based on date
const dummyTasks: { [key: string]: any[] } = {
  '2024-10-07': [
    { id: 1, project: 'Project', task: 'Research process', time: '07:00 - 09:00', participants: 4 },
    { id: 2, project: 'Project', task: 'Moodboard Search', time: '09:00 - 12:00', participants: 4 },
    { id: 3, project: 'Project', task: 'Wireframing Design', time: '13:00 - 16:00', participants: 4 },
    { id: 4, project: 'Project', task: 'Landing Page', time: '19:00 - 21:00', participants: 4 },
    { id: 5, project: 'Project', task: 'Landing Page', time: '19:00 - 21:00', participants: 4 },
    { id: 6, project: 'Project', task: 'Landing Page', time: '19:00 - 21:00', participants: 4 },
  ],
  '2024-10-08': [
    { id: 1, project: 'Project', task: 'Client Meeting', time: '08:00 - 09:00', participants: 2 },
  ],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  dateCard:{
    padding:20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskCount: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  calendarContainer: {
    height:120,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  calendarDay: {
    marginRight: 15,
    alignItems: 'center',
  },
  selectedDay: {
    borderBottomWidth: 2,
    borderBottomColor: '#24cc5e',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekDayText: {
    fontSize: 14,
    color: 'gray',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubTitle: {
    fontSize: 16,
    color: '#000',
  },
  cardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  cardParticipants: {
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    elevation: 5,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
});

export default TaskScreen;


const ListTasks = () => {
    const tasks = [
        {
          title: 'Website Designing',
          date: '19 August 2024',
          progress: '9/20 Finished',
          logo: 'https://example.com/logo1.png',
          label: 'Agreements'
        },
        {
          title: 'It Staff Landing Page',
          date: '19 August 2024',
          progress: '5/10 Finished',
          logo: 'https://example.com/logo2.png',
          label: 'Interview Scheduling'
        },
        {
          title: 'Website Designing',
          date: '19 August 2024',
          progress: '9/20 Finished',
          logo: 'https://example.com/logo1.png',
          label: 'Visa Processing'
        },
        {
          title: 'It Staff Landing Page',
          date: '19 August 2024',
          progress: '5/10 Finished',
          logo: 'https://example.com/logo2.png',
          label: 'Website'
        },
      ]
    return <>
        <FlatList data={tasks} renderItem={({item:task, index})=><>
          <View key={index} style={stylesTaskCards.card}>
          <View style={stylesTaskCards.logoContainer}>
            <View style={stylesTaskCards.logoBackground}>
              <Image source={{ uri: task.logo }} style={stylesTaskCards.logo} />
            </View>
          </View>


          <View style={stylesTaskCards.labelContainer}>
            <Text style={stylesTaskCards.labelText}>{task.label}</Text>
          </View>

          <Text style={stylesTaskCards.cardTitle}>{task.title}</Text>
          <Text>{task.date}</Text>

          <View style={stylesTaskCards.progressContainer}>
            <View style={stylesTaskCards.progressBar}>
              <View style={[stylesTaskCards.progress, { width: '45%' }]} />
            </View>
            <Text>{task.progress}</Text>
          </View>
        </View>
        </>} style={stylesTaskCards.taskScroll}>
   
    </FlatList>
    </>
}

const stylesTaskCards = StyleSheet.create({
    taskScroll: {
      marginBottom: 30,
      marginHorizontal: 20,
      padding: 5,
      backgroundColor: 'transparent',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 16,
      marginRight: 10,
      marginBottom: 10,
      width: '100%',
      elevation: 2,
      position: 'relative',
    },
    logoContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
    },
    logoBackground: {
      backgroundColor: '#f0f0f0',
      borderRadius: 25,
      padding: 5,
    },
    logo: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    labelContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      paddingVertical: 3,
      paddingHorizontal: 8,
    },
    labelText: {
      fontSize: 12,
      color: '#333',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 40,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    progressBar: {
      flex: 1,
      height: 5,
      backgroundColor: '#e0e0e0',
      borderRadius: 5,
      marginRight: 10,
    },
    progress: {
      height: '100%',
      backgroundColor: '#4CAF50',
      borderRadius: 5,
    },
  });
  