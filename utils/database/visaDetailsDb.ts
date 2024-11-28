import AsyncStorage from '@react-native-async-storage/async-storage';
import {  VisaDetails, parseDates } from '../category';

export const VISADETAILS_STORAGE_KEY = 'formData:VisaDetails';

// Create or Update an visaDetail
export const saveVisaDetail = async (visaDetail: VisaDetails): Promise<void> => {
  try {
    const VisaDetails = await getVisaDetails()

    // Check if visaDetail exists, update if it does, otherwise add it
    const index = VisaDetails.findIndex((a) => a.id === visaDetail.id);
    if (index > -1) {
      VisaDetails[index] = visaDetail;
    } else {
      VisaDetails.push(visaDetail);
    }

    await AsyncStorage.setItem(VISADETAILS_STORAGE_KEY, JSON.stringify(VisaDetails));
  } catch (error) {
    console.error('Error saving visaDetail:', error);
  }
};

// Retrieve All VisaDetails
export const getVisaDetails = async (): Promise<VisaDetails[]> => {
  try {
    const data = await AsyncStorage.getItem(VISADETAILS_STORAGE_KEY);
    return data ? parseDates(JSON.parse(data) as VisaDetails[]) as VisaDetails[] : [];
  } catch (error) {
    console.error('Error fetching VisaDetails:', error);
    return [];
  }
};

// Retrieve a Single visaDetail by ID
export const getVisaDetailById = async (id: string): Promise<VisaDetails | null> => {
  try {
    const VisaDetails = await getVisaDetails()
    return VisaDetails.find((a) => a.id === id) || null;
  } catch (error) {
    console.error('Error fetching visaDetail by ID:', error);
    return null;
  }
};

// Delete an visaDetail by ID
export const deleteVisaDetail = async (id: string): Promise<void> => {
  try {
    const VisaDetails = await getVisaDetails()
    const updatedVisaDetails = VisaDetails.filter((a) => a.id !== id);

    await AsyncStorage.setItem(VISADETAILS_STORAGE_KEY, JSON.stringify(updatedVisaDetails));
  } catch (error) {
    console.error('Error deleting visaDetail:', error);
  }
};

// Delete All VisaDetails
export const clearVisaDetails = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(VISADETAILS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing VisaDetails:', error);
  }
};
