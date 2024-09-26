import { FormData } from '@/utils/category';
import { agreementsData, insuranceRenewalData, onboardingData, purchaseOrderData, visaDetailsData } from '@/utils/datasets';
import React, { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';

interface ProfileContext {
  profile:string
  setProfile: (profile:string) => void;
  userName:string,
  setUserName: (username:string)=>void
}

const ProfileContextType = createContext<ProfileContext | undefined>(undefined);


export const ProfileContextProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
const [profile,setProfile]=useState('https://imgs.search.brave.com/dsRxX9MNxgZMT4qHcqsl6IqedqonJa9yA2Ds1s3Brl8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9hdmF0YXItcmVz/b3VyY2luZy1jb21w/YW55XzEyNTQ5Njct/NjY1My5qcGc_c2l6/ZT02MjYmZXh0PWpw/Zw')
const [userName,setUserName]=useState('Karthikraja')  
return (
    <ProfileContextType.Provider value={{ profile,setProfile,userName,setUserName }}>
      {children}
    </ProfileContextType.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContextType);
  if (!context) {
    throw new Error('useProfile context must be used within a ProfileContextProvider');
  }
  return context;
};
