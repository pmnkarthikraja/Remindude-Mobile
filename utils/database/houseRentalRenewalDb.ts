import AsyncStorage from '@react-native-async-storage/async-storage';
import {  HouseRentalRenewal, parseDates } from '../category';

export const HOUSERENTALRENEWAL_STORAGE_KEY = 'formData:HouseRentalRenewals';

// Create or Update an HouseRentalRenewal
export const saveHouseRentalRenewal = async (HouseRentalRenewal: HouseRentalRenewal): Promise<void> => {
  try {

    const HouseRentalRenewals = await getHouseRentalRenewals()

    // Check if HouseRentalRenewal exists, update if it does, otherwise add it
    const index = HouseRentalRenewals.findIndex((a) => a.id === HouseRentalRenewal.id);
    if (index > -1) {
        HouseRentalRenewals[index] = HouseRentalRenewal;
    } else {
        HouseRentalRenewals.push(HouseRentalRenewal);
    }

    await AsyncStorage.setItem(HOUSERENTALRENEWAL_STORAGE_KEY, JSON.stringify(HouseRentalRenewals));
  } catch (error) {
    console.error('Error saving HouseRentalRenewal:', error);
  }
};

// Retrieve All getHouseRentalRenewals
export const getHouseRentalRenewals = async (): Promise<HouseRentalRenewal[]> => {
  try {
    const data = await AsyncStorage.getItem(HOUSERENTALRENEWAL_STORAGE_KEY);
    return data ? parseDates(JSON.parse(data) as HouseRentalRenewal[]) as HouseRentalRenewal[] : [];
  } catch (error) {
    console.error('Error fetching HouseRentalRenewals:', error);
    return [];
  }
};

// Retrieve a Single HouseRentalRenewal by ID
export const getHouseRentalRenewalById = async (id: string): Promise<HouseRentalRenewal | null> => {
  try {
    const HouseRentalRenewals = await getHouseRentalRenewals()
    return HouseRentalRenewals.find((a) => a.id === id) || null;
  } catch (error) {
    console.error('Error fetching HouseRentalRenewal by ID:', error);
    return null;
  }
};

// Delete an HouseRentalRenewal by ID
export const deleteHouseRentalRenewal = async (id: string): Promise<void> => {
  try {
    const HouseRentalRenewals = await getHouseRentalRenewals()
    const updatedHouseRentalRenewals = HouseRentalRenewals.filter((a) => a.id !== id);

    await AsyncStorage.setItem(HOUSERENTALRENEWAL_STORAGE_KEY, JSON.stringify(updatedHouseRentalRenewals));
  } catch (error) {
    console.error('Error deleting HouseRentalRenewal:', error);
  }
};

// Delete All HouseRentalRenewals
export const clearHouseRentalRenewals = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HOUSERENTALRENEWAL_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing HouseRentalRenewals:', error);
  }
};
