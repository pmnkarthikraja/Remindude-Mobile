import { FormData } from "./category";

const subtractDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    newDate.setHours(10,0,0,0) //set 10 am
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
            formdata.reminderDates = [
                subtractDays(endDate, 90),
                subtractDays(endDate, 60),
                subtractDays(endDate, 30),
            ];
            return formdata
        }

        case 'Purchase Order': {
            const { poEndDate } = formdata;
            formdata.reminderDates = [
                subtractDays(poEndDate, 90),
                subtractDays(poEndDate, 60),
                subtractDays(poEndDate, 30),
            ];
            return formdata;
        }

        case 'Visa Details': {
            const { visaEntryDate } = formdata;
            formdata.reminderDates = [
                subtractDays(addDays(visaEntryDate, 90), 7),
                subtractDays(addDays(visaEntryDate, 90), 3),
            ];
            return formdata;
        }

          case 'IQAMA Renewals': {
            const { expiryDate } = formdata;
            formdata.reminderDates = [
              subtractDays(expiryDate, 30),
              subtractDays(expiryDate, 15),
              subtractDays(expiryDate, 5),
            ];
            break;
          }

        case 'Insurance Renewals': {
            const { insuranceEndDate } = formdata;
            formdata.reminderDates = [
                subtractDays(insuranceEndDate, 30),
                subtractDays(insuranceEndDate, 15),
                subtractDays(insuranceEndDate, 5),
            ];
            return formdata;
        }

        default:
            throw new Error('Unsupported document category');
    }

    return formdata;
};