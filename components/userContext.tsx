import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/utils/user';
import { router } from 'expo-router';


interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
  setOfficeMode:(officeMode:boolean)=>void
  officeMode:boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [officeMode, setOfficeMode] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null); 
    router.navigate('/login')
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout,setOfficeMode,officeMode }}>
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
