import AsyncStorage from '@react-native-async-storage/async-storage';
import { PurchaseOrder, parseDates } from '../category';

export const PURCHASEORDERS_STORAGE_KEY = 'formData:PurchaseOrders';

// Create or Update an PurchaseOrder
export const savePurchaseOrder = async (PurchaseOrder: PurchaseOrder): Promise<void> => {
  try {

    const PurchaseOrders = await getPurchaseOrders()

    // Check if purchase order exists, update if it does, otherwise add it
    const index = PurchaseOrders.findIndex((a) => a.id === PurchaseOrder.id);
    if (index > -1) {
        PurchaseOrders[index] = PurchaseOrder;
    } else {
        PurchaseOrders.push(PurchaseOrder);
    }

    await AsyncStorage.setItem(PURCHASEORDERS_STORAGE_KEY, JSON.stringify(PurchaseOrders));
  } catch (error) {
    console.error('Error saving purchaseorder:', error);
  }
};

// Retrieve All getPurchaseOrders
export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  try {
    const data = await AsyncStorage.getItem(PURCHASEORDERS_STORAGE_KEY);
    return data ? parseDates(JSON.parse(data) as PurchaseOrder[]) as PurchaseOrder[] : [];
  } catch (error) {
    console.error('Error fetching purchaseOrders:', error);
    return [];
  }
};

// Retrieve a Single Purchase order by ID
export const getPurchaseOrderById = async (id: string): Promise<PurchaseOrder | null> => {
  try {
    const purchaseOrders = await getPurchaseOrders()
    return purchaseOrders.find((a) => a.id === id) || null;
  } catch (error) {
    console.error('Error fetching purchase order by ID:', error);
    return null;
  }
};

// Delete an Purchase order by ID
export const deletePurchaseOrder = async (id: string): Promise<void> => {
  try {
    const purchaseOrders = await getPurchaseOrders()
    const updatedPurchaseOrders = purchaseOrders.filter((a) => a.id !== id);

    await AsyncStorage.setItem(PURCHASEORDERS_STORAGE_KEY, JSON.stringify(updatedPurchaseOrders));
  } catch (error) {
    console.error('Error deleting purchase order:', error);
  }
};

// Delete All Purchase orders
export const clearPurchaseOrders = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PURCHASEORDERS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing PurchaseOrders:', error);
  }
};
