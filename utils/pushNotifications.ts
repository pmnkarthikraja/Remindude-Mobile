import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category, FormData } from "./category";
import * as Notifications from 'expo-notifications';

 export const storeNotificationIds = async (eventId:string, notificationIds:string[]) => {
    const storedIds = await AsyncStorage.getItem('notifications');
    const notifications = storedIds ? JSON.parse(storedIds) : {};
    notifications[eventId] = notificationIds; 
    await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  };

 export const getNotificationIds = async (eventId:string) => {
    const storedIds = await AsyncStorage.getItem('notifications');
    const notifications = storedIds ? JSON.parse(storedIds) : {};
    return notifications[eventId] || [];
  };

const constructNotification = async (category:Category, title:string,body:string,scheduleDate:Date,idx:number):Promise<string> => {
    const scheduledAt10AM = new Date(scheduleDate);
    scheduledAt10AM.setHours(10, 0, 0, 0); // set to 10:00:00 AM
    console.log("schedule time:",scheduledAt10AM.toLocaleString())

    return  await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          sound:'default'
        },
        trigger: {
         date:scheduledAt10AM
        // seconds:4*idx
        },
      });
}

export const buildNotifications = async (formData:FormData, mode:'Add'|'Update') =>{
    if (mode=='Update'){
        const existingNotificationIds = await getNotificationIds(formData.id);
        console.log("cancelling idS",existingNotificationIds)
        if (existingNotificationIds.length > 0) {
            for (const id of existingNotificationIds) {
              console.log("cancelling id",id)
              await Notifications.cancelScheduledNotificationAsync(id);
            }
          }
    }

    const reminders = [...formData.customReminderDates,...formData.reminderDates]
    if (formData.category=='Agreements'){
        const notificationIds:string[] = [];
        const title = "Agreement Reminder"
        const body = `The agreement with ${formData.clientName} is expiring soon. End date: ${formData.endDate.toLocaleDateString()}. Please review before 30 days of end date.`
        reminders.forEach(async (remind,idx)=>{
        const id = await constructNotification('Agreements', title, body,remind, idx)
        notificationIds.push(id)
        })
        storeNotificationIds(formData.id,notificationIds)
        return
    }else if(formData.category=='IQAMA Renewals'){
        const notificationIds:string[]=[]
        const title = "Iqama Renewal Reminder"
        const body = `Iqama number ${formData.iqamaNumber} is expiring on ${formData.expiryDate.toLocaleDateString()}. Please renew before 30 days of expiry date.`
        reminders.forEach(async (remind,idx)=>{
            const id = await constructNotification('IQAMA Renewals',title, body,remind,idx)
            notificationIds.push(id)
        })
        storeNotificationIds(formData.id,notificationIds)
        return
    }else if(formData.category=='Insurance Renewals'){
        const notificationIds:string[]=[]
        const title = "Insurance Renewal Reminder"
        const body = `The insurance policy for ${formData.employeeName} is expiring on ${formData.insuranceEndDate}. Please ensure renewal before 30 days of end date.`
        reminders.forEach(async (remind,idx)=>{
            const id = await constructNotification('Insurance Renewals',title, body,remind,idx)
            notificationIds.push(id)
        })
        storeNotificationIds(formData.id,notificationIds)
        return 
    }else if(formData.category=='Purchase Order'){
        const notificationIds:string[]=[]
        const title = "PO Expiry Reminder"
        const body = `The purchase order with ${formData.consultant} is nearing its end. PO ends on ${formData.poEndDate.toLocaleDateString()}. Action required before 30 days of PO End date.`
        reminders.forEach(async (remind,idx)=>{
            const id = await constructNotification('Purchase Order',title, body,remind,idx)
            notificationIds.push(id)
        })
        storeNotificationIds(formData.id,notificationIds)
        return 
    }else if(formData.category=='House Rental Renewal'){
        const notificationIds:string[]=[]
        const title = "House Rental Reminder"
        const body = `The house rental with ${formData.houseOwnerName} is nearing its end. House Rental ends on ${formData.endDate.toLocaleDateString()}. Action required before 30 days of House Rental End date.`
        reminders.forEach(async (remind,idx)=>{
            const id = await constructNotification('Purchase Order',title, body,remind,idx)
            notificationIds.push(id)
        })
        storeNotificationIds(formData.id,notificationIds)
        return 
    }
    else{
        const notificationIds:string[]=[]
        const title = "Visa Expiry Reminder"
        const body = `Visa for ${formData.clientName} is expiring soon. Visa ends on ${formData.visaEndDate.toLocaleDateString()}. Entry Date: ${formData.visaEntryDate.toLocaleDateString()}. Please ensure renewal before ${formData.visaEndDate.toLocaleDateString()}.`
        reminders.forEach(async (remind,idx)=>{
            const id = await constructNotification('Visa Details',title, body,remind,idx)
            notificationIds.push(id)
        })
        storeNotificationIds(formData.id,notificationIds)
        return 
    }
}