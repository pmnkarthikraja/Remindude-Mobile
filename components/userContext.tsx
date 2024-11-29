import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/utils/user';
import { router } from 'expo-router';
import { parseTaskDates, Task } from '@/utils/task';
import axios, { isAxiosError } from 'axios';
import { useContextSelector, createContext, useContext } from 'use-context-selector'
import { userApi } from '@/api/userApi';
import uuid from 'react-native-uuid'
import { useBulkOperationFormData } from '@/hooks/formDataHooks';
import { getAgreements } from '@/utils/database/agreementsDb';
import { getPurchaseOrders } from '@/utils/database/purchaseOrderDb';
import { getVisaDetails } from '@/utils/database/visaDetailsDb';
import { getIqamaRenewals } from '@/utils/database/iqamaRenewalsDb';
import { getInsuranceRenewals } from '@/utils/database/insuranceRenewals';
import { getHouseRentalRenewals } from '@/utils/database/houseRentalRenewalDb';
import { Category, FormData, testAgreementsData } from '@/utils/category';

export interface NotificationContent {
  id: string,
  title: string,
  description: string
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
  setOfficeMode: (officeMode: boolean) => void
  officeMode: boolean,
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  notifications: NotificationContent[],
  setNotifications: React.Dispatch<React.SetStateAction<NotificationContent[]>>;
  users: UserProfile[],
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  retrieveFromAsyncDb: () => Promise<FormData[]>
  pullToRefresh: () => void
  syncLoading: boolean
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


const retrieveFromAsyncDb = async () => {
  const allData: FormData[] = [];

  const agreementsData = await getAgreements()
  allData.push(...agreementsData)

  const poData = await getPurchaseOrders()

  allData.push(...poData)

  const visaDetailsData = await getVisaDetails()

  allData.push(...visaDetailsData)

  const iqamaRenewalsData = await getIqamaRenewals()
  allData.push(...iqamaRenewalsData)

  const insuranceRenewalsData = await getInsuranceRenewals()
  allData.push(...insuranceRenewalsData)

  const houseRentalRenewalsData = await getHouseRentalRenewals()
  allData.push(...houseRentalRenewalsData)
  return allData
}


const chunkData = (data: any[], chunkSize: number): any[][] => {
  const chunks: any[][] = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
};


const batchUpdateData = async () => {
  const agreementsData = await getAgreements()
  // const agreementsData = testAgreementsData
  const poData = await getPurchaseOrders()
  const visaDetailsData = await getVisaDetails()
  const iqamaRenewalsData = await getIqamaRenewals()
  const insuranceRenewalsData = await getInsuranceRenewals()
  const houseRentalRenewalsData = await getHouseRentalRenewals()
  return {
    agreementsData,
    poData,
    visaDetailsData,
    iqamaRenewalsData,
    insuranceRenewalsData,
    houseRentalRenewalsData
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncLoading, setsyncLoading] = useState(false)
  const [officeMode, setOfficeMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([])
  const [notifications, setNotifications] = useState<NotificationContent[]>([])


  const API_URL = 'https://remindude.vercel.app'

  const updatedBackend = async () => {
    //here we need to call all repo data.and check if the internet has exists.
    console.log("backend is updating...")
    try {
      setsyncLoading(true)
      const {
        agreementsData,
        houseRentalRenewalsData,
        insuranceRenewalsData,
        iqamaRenewalsData,
        poData,
        visaDetailsData
      } = await batchUpdateData()


      const chunkSize = 50;


      const agreementsDataChunks = chunkData(agreementsData, chunkSize);
      const poDataChunks = chunkData(poData, chunkSize);
      const visaDetailsDataChunks = chunkData(visaDetailsData, chunkSize);
      const iqamaRenewalsDataChunks = chunkData(iqamaRenewalsData, chunkSize);
      const insuranceRenewalsDataChunks = chunkData(insuranceRenewalsData, chunkSize);
      const houseRentalRenewalsDataChunks = chunkData(houseRentalRenewalsData, chunkSize);

      // const sendDataChunks = async (dataChunks: any[]) => {
      //   const apiCalls = dataChunks.map((chunk:FormData[]) => {
      //     return axios.post(`${API_URL}/formdata-bulkoperation`, {
      //       formDataArray: chunk,
      //       email: user?.email || ''
      //     });
      //   });
      //   // Wait for all API calls to finish
      //   await Promise.all(apiCalls);
      // };

      const sendDataChunksSequential = async (dataChunks: any[],category:Category) => {
        for (const [index,chunk] of dataChunks.entries()) {
          await axios.post(`${API_URL}/formdata-bulkoperation`, {
            formDataArray: chunk,
            email: user?.email || ''
          });
          console.log(`batch-${index+1}-updated-for-${category}`)
        }
      };

      await sendDataChunksSequential(agreementsDataChunks,'Agreements');
      await sendDataChunksSequential(poDataChunks,'Purchase Order');
      await sendDataChunksSequential(visaDetailsDataChunks,'Visa Details');
      await sendDataChunksSequential(iqamaRenewalsDataChunks,'IQAMA Renewals');
      await sendDataChunksSequential(insuranceRenewalsDataChunks,'Insurance Renewals');
      await sendDataChunksSequential(houseRentalRenewalsDataChunks,'House Rental Renewal');
      
      //we can do batch update
      // const apiCalls = [];

      // if (agreementsData.length > 0) {
      //   apiCalls.push(
      //     axios.post(`${API_URL}/formdata-bulkoperation`, {
      //       formDataArray: agreementsData,
      //       email: user?.email || ''
      //     })
      //   );
      // }

      // if (houseRentalRenewalsData.length > 0) {
      //   apiCalls.push(
      //     axios.post(`${API_URL}/formdata-bulkoperation`, {
      //       formDataArray: houseRentalRenewalsData,
      //       email: user?.email || ''
      //     })
      //   );
      // }

      // if (insuranceRenewalsData.length > 0) {
      //   apiCalls.push(
      //     axios.post(`${API_URL}/formdata-bulkoperation`, {
      //       formDataArray: insuranceRenewalsData,
      //       email: user?.email || ''
      //     })
      //   );
      // }

      // if (iqamaRenewalsData.length > 0) {
      //   apiCalls.push(
      //     axios.post(`${API_URL}/formdata-bulkoperation`, {
      //       formDataArray: iqamaRenewalsData,
      //       email: user?.email || ''
      //     })
      //   );
      // }

      // if (poData.length > 0) {
      //   apiCalls.push(
      //     axios.post(`${API_URL}/formdata-bulkoperation`, {
      //       formDataArray: poData,
      //       email: user?.email || ''
      //     })
      //   );
      // }

      // if (visaDetailsData.length > 0) {
      //   apiCalls.push(
      //     axios.post(`${API_URL}/formdata-bulkoperation`, {
      //       formDataArray: visaDetailsData,
      //       email: user?.email || ''
      //     })
      //   );
      // }

      // // Execute all API calls
      // const results = await Promise.all(apiCalls);

      console.log("Backend has successfully updated!")
      setsyncLoading(false)
    } catch (e: any) {
      setsyncLoading(false)
      if (isAxiosError(e)) {
        console.log("axios error on bulk operation:", e.toJSON())
      }
      console.log("error on bulk operation:", e)
    } finally {
      setsyncLoading(false)
    }
  }


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
        await AsyncStorage.setItem('users', JSON.stringify(users))
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
      if (usersData) {
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
    if (fcmToken) {
      try {
        await axios.delete(`${BASE_URL}/fcmTokens`, {
          data: {
            email: user?.email,
            token: fcmToken,
          }
        });
      } catch (e) {
        console.log("error on removing the token: ", e)
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
    <UserContext.Provider value={{ user, syncLoading, pullToRefresh: updatedBackend, setUser, retrieveFromAsyncDb, loading, logout, setOfficeMode, officeMode, setTasks, tasks, notifications, setNotifications, setUsers, users }}>
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


export const useProfilePictureAndUsername = (userEmail: string) => {
  const user = useContextSelector(
    UserContext,
    (context) => context && userEmail ? context.users.find((user) => user.email === userEmail) : undefined
  );

  return {
    userName: user?.userName,
    profilePicture: user?.profilePicture,
  };
};