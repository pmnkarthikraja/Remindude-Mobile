import React, { useState, useEffect, FunctionComponent } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, Button, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Avatar, Checkbox, Progress, ProgressIndicator, Text } from 'tamagui';
import { useColorScheme } from 'react-native';
import { userApi } from '@/api/userApi';
import { ArrowDown, ArrowUp } from '@tamagui/lucide-icons';
import { Colors } from '@/constants/Colors';
import { Check as CheckIcon } from '@tamagui/lucide-icons'
import uuid from 'react-native-uuid'


interface UserProfile {
    id: string,
    userName: string;
    profilePicture: string | undefined;
    email: string,
    avatarColor: string,
    enabledNotification:boolean
}

const ShareToUsers: FunctionComponent = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const colorscheme = useColorScheme();
    const templateImageUrl = "https://via.placeholder.com/150";

    // Function to load users from API
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };


    const loadUsers = async () => {
        setLoading(true);
        try {
            const usersData = (await userApi.getAllUsers()).data
            const users: UserProfile[] = usersData?.users.map(r => {
                const avatarColor = getRandomColor();
                if (r.userName) {
                    let username = r.userName.toLowerCase()
                    if (username.startsWith('karthik') || username.startsWith('kannan') || username.startsWith('deepika') || username.startsWith('thulasi') || username.startsWith('roshini') || username.startsWith('datasack') || username.startsWith('durga')) {
                        let profilePicture = undefined;

                        if (r.profilePicture?.startsWith('/9j/') || r.profilePicture?.startsWith('iVBORw0KGgo')) {
                            profilePicture = `data:image/*;base64,${r.profilePicture}`;
                        } else if (r.profilePicture?.startsWith('https://lh3.googleusercontent.com')) {
                            profilePicture = r.profilePicture;
                        } else if (!r.profilePicture || r.profilePicture === 'undefined') {
                            profilePicture = undefined;
                        } else {
                            profilePicture = r.profilePicture
                        }

                        return {
                            id: uuid.v4().toString(),
                            userName: (r.userName != '' && !!r.userName && r.userName != null) ? r.userName : r.email,
                            profilePicture,
                            email: r.email,
                            avatarColor,
                            enabledNotification:true
                        }
                    }
                }

            }).filter(r => r != undefined)

            setUsers(users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    // const fetchUsersFromAPI = async (): Promise<UserProfile[]> => {
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             resolve([
    //                 { userName: 'John Doe', profilePicture: undefined },
    //                 { userName: 'Jane Smith', profilePicture: undefined },
    //                 { userName: 'Alice Brown', profilePicture: undefined }
    //             ]);
    //         }, 1500);
    //     });
    // };

    const toggleSelectUser = (gotId: string) => {
        if (selectedUsers.includes(gotId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== gotId));
        } else {
            setSelectedUsers([...selectedUsers, gotId]);
        }
    };

    const handleSend = () => {
        //we need to send email or push notification via web socket.
        Alert.alert("Success", `Successfully assigned to ${selectedUsers.length} users!`)
    };

    const renderUserItem = ({ item, key }: { item: UserProfile, key: number }) => {
        const userHasSelected = selectedUsers.includes(item.id)
        return <View style={styles.userItem} key={key}>
            <UserAvatar userName={item.userName} profilePicture={item.profilePicture} avatarColor={item.avatarColor} />

            <View style={{ flexDirection: 'column', flex: 2 }}>
                <Text style={[styles.userName, { color: colorscheme === 'light' ? '#000' : '#fff' }]}>
                    {item.userName}
                </Text>
                <Text style={[styles.userName, { color: colorscheme === 'light' ? 'grey' : 'grey', fontSize: 12 }]}>
                    {item.email}
                </Text>
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-start',width:'70%'}}>
                <Text style={[styles.userName, { color: Colors.light.tint, opacity:0.8, fontSize: 12 }]}>Enable Reminders?</Text>
                <Checkbox
                    checked={item.enabledNotification}
                    onPress={() => {
                        if (userHasSelected){
                            setUsers(u=> u.map((r=>{
                                if (r.id==item.id){
                                    return {...r,enabledNotification:!r.enabledNotification}
                                }
                                return r
                            })))
                        }
                    }
                }
                    borderColor={'white'}
                    disabled={!userHasSelected}
                    disableOptimization={true}
                    style={[styles.checkBoxContainer, item.enabledNotification ? { backgroundColor: Colors.light.tint } : {},{opacity: userHasSelected ? 1:0.3, width:15,height:15,margin:'auto'}]}
                >
                    <Checkbox.Indicator>
                        <CheckIcon color={'white'} />
                    </Checkbox.Indicator>
                </Checkbox>
                </View>
 

            </View>

            <Checkbox
                checked={selectedUsers.includes(item.id)}
                onPress={() => toggleSelectUser(item.id)}
                style={[styles.checkBoxContainer, selectedUsers.includes(item.id) ? { backgroundColor: 'green' } : {}]}
                borderColor={'white'}
            >
                <Checkbox.Indicator>
                    <CheckIcon color={'white'} />
                </Checkbox.Indicator>
            </Checkbox>

        </View>
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator>
            <TouchableOpacity style={styles.shareButton} onPress={() => {
                setShowDropdown(!showDropdown);
                if (!users.length) loadUsers();
            }}>
                <Text style={styles.shareButtonText}>{(!loading && showDropdown) ? 'Assign to ?' : 'Load Users'}</Text>
                {(!showDropdown || loading) && <ArrowDown color={'white'} size={14} />}
                {(showDropdown && !loading) && <ArrowUp color={'white'} size={14} />}
                {loading && <ActivityIndicator size={10} color="white" />
                }
            </TouchableOpacity>

            {showDropdown && (
                <View >
                    {!loading && (
                        <>
                            {users.map((user, index) => <View key={index}>
                                {renderUserItem({
                                    item: user,
                                    key: index
                                })}
                            </View>)}
                        </>
                    )}

                    {users.length > 0 && (
                        <Button color={Colors.light.tint} title="Send" onPress={handleSend} disabled={selectedUsers.length === 0} />
                    )}
                </View>
            )}
        </ScrollView>
    );
};

export default ShareToUsers;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    shareButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        margin: 'auto'
    },
    shareButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    userName: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
    checkBoxContainer: {
        padding: 0,
        margin: 0,
    },
    userList: {
        marginTop: 20,
    },
});


interface UserAvatarProps {
    userName: string;
    profilePicture: string | undefined;
    avatarColor: string
}

const UserAvatar: FunctionComponent<UserAvatarProps> = ({ userName, profilePicture, avatarColor }) => {
    const firstLetter = userName.charAt(0).toUpperCase();



    if (profilePicture !== undefined && profilePicture !== '') {
        return (
            <Avatar circular size="$3">
                <Avatar.Image src={profilePicture || 'https://via.placeholder.com/150'} />
                <Avatar.Fallback bg="$gray4" />
            </Avatar>
        )
    } else {
        return (
            <Avatar circular size={40} backgroundColor={avatarColor} alignItems="center" justifyContent="center">
                <Text fontWeight="bold" color="white">
                    {firstLetter}
                </Text>
            </Avatar>
        );
    }
};

