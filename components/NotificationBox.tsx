import { Entypo } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from './userContext';

const notificationData: { id: string, title: string, description: string }[] = [
    { id: '1', title: 'New Message', description: 'Kannan has assigned to you Agreements Task' },
    { id: '2', title: 'Reminder', description: 'Your meeting is at 2 PM.' },
    { id: '3', title: 'Update Available', description: 'A new app update is available.' },
    { id: '4', title: 'Update Available', description: 'A new app update is available.' },
    { id: '5', title: 'Update Available', description: 'A new app update is available.' },
    { id: '6', title: 'New Message', description: 'Kannan has assigned to you Agreements Task' },
    { id: '7', title: 'Reminder', description: 'Your meeting is at 2 PM.' },
    { id: '8', title: 'Update Available', description: 'A new app update is available.' },
    { id: '9', title: 'Update Available', description: 'A new app update is available.' },
    { id: '10', title: 'Update Available', description: 'A new app update is available.' },
];

export default function NotificationBox() {
    const [isOpen, setIsOpen] = useState(false);
    const {notifications, setNotifications} = useUser()
    // const [notifications, setNotifications] = useState(notificationData)
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const colorscheme = useColorScheme()

    const notificationCount = notifications.length;
    const badgeColor = notificationCount > 0 ? 'red' : 'yellow';

    const toggleNotifications = () => {
        setIsOpen(!isOpen);
        Animated.timing(animatedHeight, {
            toValue: isOpen ? 0 : notificationCount <= 5 ? (notificationCount * 75) : 370,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    useEffect(()=>{
        if (isOpen){
            Animated.timing(animatedHeight, {
                toValue: !isOpen ? 0 : notificationCount <= 5 ? (notificationCount * 80) : 420,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
      
    },[notifications])

    const light = colorscheme == 'light'


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleNotifications} style={[styles.iconContainer, { backgroundColor: light ? '#f2f2f2' : 'transparent' }]}>
                <Icon name="notifications" size={28} color={light ? '#333' : 'white'} />
                {notificationCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                        <Text style={styles.badgeText}>{notificationCount}</Text>
                    </View>
                )}
            </TouchableOpacity>

            <Animated.View style={[styles.notificationList, { height: animatedHeight, backgroundColor: light ? 'white' : '#252C39' }]}>
                <FlatList
                    scrollEnabled
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.notificationItem}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={[styles.title, { color: light ? "#666" : "white" }]}>{item.title}</Text>
                                <Entypo onPress={() => { setNotifications(n=>n.filter(i=>i.id!=item.id)) }} size={18} name="circle-with-cross" color={light ? 'black' : 'yellow'} />
                            </View>

                            <Text style={[styles.description, { color: light ? "#333" : "grey" }]}>{item.description}</Text>
                        </View>
                    )}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 10,
        left: 0,
        alignItems: 'center',
        zIndex: 20,
        width: 250,
    },
    iconContainer: {
        // backgroundColor: '#f2f2f2',
        borderRadius: 25,
        padding: 10,
        position: 'relative',
        margin: 'auto',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 10
    },
    badge: {
        position: 'absolute',
        right: -5,
        top: -5,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    notificationList: {
        overflow: 'hidden',
        width: 250,
        borderRadius: 10,
        position: 'relative',
        margin: 'auto',
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    notificationItem: {
        padding: 20,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        position: 'relative'
    },
    title: {
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        color: '#666',
    },
});
