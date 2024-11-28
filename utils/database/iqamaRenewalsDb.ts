import AsyncStorage from '@react-native-async-storage/async-storage';
import {  IQAMARenewals, parseDates } from '../category';

export const IQAMARENEWALS_STORAGE_KEY = 'formData:IqamaRenewals';

// Create or Update an IqamaRenewal
export const saveIqamaRenewal = async (IqamaRenewal: IQAMARenewals): Promise<void> => {
  try {
    const IqamaRenewals = await getIqamaRenewals()

    // Check if IqamaRenewal exists, update if it does, otherwise add it
    const index = IqamaRenewals.findIndex((a) => a.id === IqamaRenewal.id);
    if (index > -1) {
      IqamaRenewals[index] = IqamaRenewal;
    } else {
      IqamaRenewals.push(IqamaRenewal);
    }

    await AsyncStorage.setItem(IQAMARENEWALS_STORAGE_KEY, JSON.stringify(IqamaRenewals));
  } catch (error) {
    console.error('Error saving IqamaRenewal:', error);
  }
};

// Retrieve All IqamaRenewals
export const getIqamaRenewals = async (): Promise<IQAMARenewals[]> => {
  try {
    const data = await AsyncStorage.getItem(IQAMARENEWALS_STORAGE_KEY);
    return data ? parseDates(JSON.parse(data) as IQAMARenewals[]) as IQAMARenewals[] : [];
  } catch (error) {
    console.error('Error fetching IqamaRenewals:', error);
    return [];
  }
};

// Retrieve a Single IqamaRenewal by ID
export const getIqamaRenewalById = async (id: string): Promise<IQAMARenewals | null> => {
  try {
    const IqamaRenewals = await getIqamaRenewals()
    return IqamaRenewals.find((a) => a.id === id) || null;
  } catch (error) {
    console.error('Error fetching IqamaRenewal by ID:', error);
    return null;
  }
};

// Delete an IqamaRenewal by ID
export const deleteIqamaRenewal = async (id: string): Promise<void> => {
  try {
    const IqamaRenewals = await getIqamaRenewals()
    const updatedIqamaRenewals = IqamaRenewals.filter((a) => a.id !== id);

    await AsyncStorage.setItem(IQAMARENEWALS_STORAGE_KEY, JSON.stringify(updatedIqamaRenewals));
  } catch (error) {
    console.error('Error deleting IqamaRenewal:', error);
  }
};

// Delete All IqamaRenewals
export const clearIqamaRenewals = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(IQAMARENEWALS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing IqamaRenewals:', error);
  }
};
