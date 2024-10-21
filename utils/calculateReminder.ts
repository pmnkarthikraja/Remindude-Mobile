import { FormData } from "./category";

const subtractDays = (date: Date, days: number): (Date|undefined) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    newDate.setHours(10,0,0,0) //set 10 am
    if ((newDate.getTime() - new Date().getTime())<0){  //if it elapsed today, then no reminder
        return  undefined
    }
    return newDate;
};

export const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    newDate.setHours(10,0,0,0) //set 10 am
    return newDate;
};

export const calculateReminderDates = (formdata: FormData): FormData => {
    switch (formdata.category) {
        case 'Agreements': {
            const { endDate } = formdata;
            const dates = [subtractDays(endDate,90),subtractDays(endDate,60),subtractDays(endDate,30)].filter(d=>!!d)
            formdata.reminderDates=dates      
            break
        }

        case 'Purchase Order': {
            const { poEndDate } = formdata;
            const dates = [subtractDays(poEndDate,90),subtractDays(poEndDate,60),subtractDays(poEndDate,30)].filter(d=>!!d)
            formdata.reminderDates=dates   
            break;
        }

        case 'Visa Details': {
            const { visaEntryDate } = formdata;
            const dates = [subtractDays(addDays(visaEntryDate, 90), 7),subtractDays(addDays(visaEntryDate, 90), 3)].filter(d=>!!d)
            formdata.reminderDates=dates   
            break;
        }

          case 'IQAMA Renewals': {
            const { expiryDate } = formdata;
            const dates = [subtractDays(expiryDate, 30),subtractDays(expiryDate, 15),subtractDays(expiryDate, 5)].filter(d=>!!d)
            formdata.reminderDates=dates   
            break;
          }

        case 'Insurance Renewals': {
            const { insuranceEndDate } = formdata;
            const dates = [subtractDays(insuranceEndDate, 30),subtractDays(insuranceEndDate, 15),subtractDays(insuranceEndDate, 5)].filter(d=>!!d)
            formdata.reminderDates=dates   
            break;
        }

        default:
            throw new Error('Unsupported document category');
    }

    return formdata;
};