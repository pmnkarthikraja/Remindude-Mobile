import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormData, parseDates } from './category';



const saveFormData = async (data: FormData[]) => {
    await AsyncStorage.setItem('formData', JSON.stringify(data));
};

const getFormData = async (): Promise<FormData[]> => {
    const data = await AsyncStorage.getItem('formData');
    const formData: FormData[] = data ? JSON.parse(data) : [];
    return parseDates(formData);
};

const addEntry = async (newEntry: FormData) => {
    const currentData = await getFormData();
    currentData.push(newEntry);
    await saveFormData(currentData);
};

const updateEntry = async (id: string, updatedEntry: FormData) => {
    const currentData = await getFormData();
    const index = currentData.findIndex((item) => item.id === id);
    if (index > -1) {
        currentData[index] = updatedEntry;
        await saveFormData(currentData);
    }
};

const deleteEntry = async (id: string) => {
    const currentData = await getFormData();
    const filteredData = currentData.filter((item) => item.id !== id);
    await saveFormData(filteredData);
};
