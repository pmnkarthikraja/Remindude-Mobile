import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/utils/user';
import { router } from 'expo-router';
import { parseTaskDates, Task } from '@/utils/task';


interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
  setOfficeMode:(officeMode:boolean)=>void
  officeMode:boolean,
  tasks:Task[]
  setTasks:React.Dispatch<React.SetStateAction<Task[]>>
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [officeMode, setOfficeMode] = useState(false);
  const [tasks,setTasks]=useState<Task[]>([])

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    const loadTasks = async () => {
      const tasksData = await AsyncStorage.getItem('tasks');
      if (tasksData) {
        const data = JSON.parse(tasksData)
        setTasks(parseTaskDates(data));
      }
      setLoading(false);
    };
    loadUser()
    loadTasks();
    setLoading(false);
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null); 
    router.navigate('/login')
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout,setOfficeMode,officeMode,setTasks,tasks }}>
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
