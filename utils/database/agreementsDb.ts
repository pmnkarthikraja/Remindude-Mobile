import AsyncStorage from '@react-native-async-storage/async-storage';
import { Agreements, parseDates } from '../category';

export const AGREEMENTS_STORAGE_KEY = 'formData:Agreements';

// Create or Update an Agreement
export const saveAgreement = async (agreement: Agreements): Promise<void> => {
  try {
    // const existingData = await AsyncStorage.getItem(AGREEMENTS_STORAGE_KEY);
    // const agreements: Agreements[] = existingData ? parseDates(JSON.parse(existingData) as Agreements[]) as Agreements[] : [];
    const agreements = await getAgreements()

    // Check if agreement exists, update if it does, otherwise add it
    const index = agreements.findIndex((a) => a.id === agreement.id);
    if (index > -1) {
      agreements[index] = agreement;
    } else {
      agreements.push(agreement);
    }

    await AsyncStorage.setItem(AGREEMENTS_STORAGE_KEY, JSON.stringify(agreements));
  } catch (error) {
    console.error('Error saving agreement:', error);
  }
};

// Retrieve All Agreements
export const getAgreements = async (): Promise<Agreements[]> => {
  try {
    const data = await AsyncStorage.getItem(AGREEMENTS_STORAGE_KEY);
    return data ? parseDates(JSON.parse(data) as Agreements[]) as Agreements[] : [];
  } catch (error) {
    console.error('Error fetching agreements:', error);
    return [];
  }
};

// Retrieve a Single Agreement by ID
export const getAgreementById = async (id: string): Promise<Agreements | null> => {
  try {
    // const data = await AsyncStorage.getItem(AGREEMENTS_STORAGE_KEY);
    // const agreements: Agreements[] = data ? parseDates(JSON.parse(data) as Agreements[]) as Agreements[] : [];
    const agreements = await getAgreements()
    return agreements.find((a) => a.id === id) || null;
  } catch (error) {
    console.error('Error fetching agreement by ID:', error);
    return null;
  }
};

// Delete an Agreement by ID
export const deleteAgreement = async (id: string): Promise<void> => {
  try {
    // const data = await AsyncStorage.getItem(AGREEMENTS_STORAGE_KEY);
    // const agreements: Agreements[] = data ? parseDates(JSON.parse(data) as Agreements[]) as Agreements[] : [];
    const agreements = await getAgreements()
    const updatedAgreements = agreements.filter((a) => a.id !== id);

    await AsyncStorage.setItem(AGREEMENTS_STORAGE_KEY, JSON.stringify(updatedAgreements));
  } catch (error) {
    console.error('Error deleting agreement:', error);
  }
};

// Delete All Agreements
export const clearAgreements = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AGREEMENTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing agreements:', error);
  }
};
