import AsyncStorage from '@react-native-async-storage/async-storage';
import {  InsuranceRenewals, parseDates } from '../category';

export const INSURANCERENEWALS_STORAGE_KEY = 'formData:InsuranceRenewals';

// Create or Update an InsuranceRenewal
export const saveInsuranceRenewal = async (InsuranceRenewal: InsuranceRenewals): Promise<void> => {
  try {
    const InsuranceRenewals = await getInsuranceRenewals()

    // Check if InsuranceRenewal exists, update if it does, otherwise add it
    const index = InsuranceRenewals.findIndex((a) => a.id === InsuranceRenewal.id);
    if (index > -1) {
      InsuranceRenewals[index] = InsuranceRenewal;
    } else {
      InsuranceRenewals.push(InsuranceRenewal);
    }

    await AsyncStorage.setItem(INSURANCERENEWALS_STORAGE_KEY, JSON.stringify(InsuranceRenewals));
  } catch (error) {
    console.error('Error saving InsuranceRenewal:', error);
  }
};

// Retrieve All InsuranceRenewals
export const getInsuranceRenewals = async (): Promise<InsuranceRenewals[]> => {
  try {
    const data = await AsyncStorage.getItem(INSURANCERENEWALS_STORAGE_KEY);
    return data ? parseDates(JSON.parse(data) as InsuranceRenewals[]) as InsuranceRenewals[] : [];
  } catch (error) {
    console.error('Error fetching InsuranceRenewals:', error);
    return [];
  }
};

// Retrieve a Single InsuranceRenewal by ID
export const getInsuranceRenewalById = async (id: string): Promise<InsuranceRenewals | null> => {
  try {
    const InsuranceRenewals = await getInsuranceRenewals()
    return InsuranceRenewals.find((a) => a.id === id) || null;
  } catch (error) {
    console.error('Error fetching InsuranceRenewal by ID:', error);
    return null;
  }
};

// Delete an InsuranceRenewal by ID
export const deleteInsuranceRenewal = async (id: string): Promise<void> => {
  try {
    const InsuranceRenewals = await getInsuranceRenewals()
    const updatedInsuranceRenewals = InsuranceRenewals.filter((a) => a.id !== id);

    await AsyncStorage.setItem(INSURANCERENEWALS_STORAGE_KEY, JSON.stringify(updatedInsuranceRenewals));
  } catch (error) {
    console.error('Error deleting InsuranceRenewal:', error);
  }
};

// Delete All InsuranceRenewals
export const clearInsuranceRenewals = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(INSURANCERENEWALS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing InsuranceRenewals:', error);
  }
};
