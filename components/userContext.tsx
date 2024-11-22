import React, {  useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/utils/user';
import { router } from 'expo-router';
import { parseTaskDates, Task } from '@/utils/task';
import axios from 'axios';
import {useContextSelector,createContext,useContext} from 'use-context-selector'
import { userApi } from '@/api/userApi';
import uuid from 'react-native-uuid'

export interface NotificationContent{
  id:string,
  title:string,
  description:string
}

export interface UserProfile {
  id: string,
  userName: string;
  profilePicture: string | undefined;
  email: string,
  avatarColor: string,
  enabledNotification: boolean
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
  setOfficeMode:(officeMode:boolean)=>void
  officeMode:boolean,
  tasks:Task[]
  setTasks:React.Dispatch<React.SetStateAction<Task[]>>
  notifications:NotificationContent[],
  setNotifications:  React.Dispatch<React.SetStateAction<NotificationContent[]>>;
  users:UserProfile[],
  setUsers:React.Dispatch<React.SetStateAction<UserProfile[]>>;
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [officeMode, setOfficeMode] = useState(false);
  const [tasks,setTasks]=useState<Task[]>([])
  const [notifications,setNotifications]=useState<NotificationContent[]>([])

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
          const usersData = (await userApi.getAllUsers()).data
          const users: UserProfile[] = usersData?.users.map(r => {
              const avatarColor = getRandomColor();
              if (r.userName) {
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
                      enabledNotification: true
                  }
              }

          }).filter(r => r != undefined)

          setUsers(users);
          await AsyncStorage.setItem('users',JSON.stringify(users))
      } catch (error) {
          console.error('Failed to fetch users:', error);
      } finally {
          setLoading(false);
      }
  };

    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      const usersData = await AsyncStorage.getItem('users')
      // const notificationsData = await AsyncStorage.getItem('notifications')
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (usersData){
        setUsers(JSON.parse(usersData))
      }
      // if (notificationsData){
      //   setNotifications(JSON.parse(notificationsData) as NotificationContent[])
      // }
    };

    const loadTasks = async () => {
      const tasksData = await AsyncStorage.getItem('tasks');
      if (tasksData) {
        const data = JSON.parse(tasksData)
        setTasks(parseTaskDates(data));
      }
      setLoading(false);
    };

    loadUsers()
    loadUser()
    loadTasks();
    setLoading(false);
  }, []);

  const removeTokenonsignedout = async () => {
    const fcmToken = await AsyncStorage.getItem('fcmToken')
    const BASE_URL = "https://remindude.vercel.app";
    if (fcmToken){
      try {
        await axios.delete(`${BASE_URL}/fcmTokens`,{
          data:{
            email: user?.email,
            token: fcmToken,
          }
        });
      }catch(e){
        console.log("error on removing the token: ",e)
      }
    }
  }

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await removeTokenonsignedout()
    setUser(null); 
    router.navigate('/login')
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout,setOfficeMode,officeMode,setTasks,tasks,notifications,setNotifications,setUsers,users }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};


// export function profilePictureAndUsername(userEmail:string|undefined) {
//   if (userEmail){
//     const user = useContextSelector(
//       UserContext,
//       (context) =>context && context.users.find((user) => user.email === userEmail)
//     );
  
//     return {
//       userName:user?.userName,
//       profilePicture:user?.profilePicture
//     }
//   }
//   return {
//     userName:undefined,
//     profilePicture:undefined
//   }
// }

// export const useProfilePictureAndUsername = useCallback((userEmail:string) => {
//   const user = useContextSelector(
//     UserContext,
//     (context) =>context && userEmail ? context.users.find((user) => user.email === userEmail) : undefined
//   );

//   return {
//     userName: user?.userName,
//     profilePicture: user?.profilePicture,
//   };
// }, []);


export const useProfilePictureAndUsername = (userEmail:string) => {
  const user = useContextSelector(
    UserContext,
    (context) =>context && userEmail ? context.users.find((user) => user.email === userEmail) : undefined
  );

  return {
    userName: user?.userName,
    profilePicture: user?.profilePicture,
  };
};