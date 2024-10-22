export interface Agreements {
  id:string,
  email:string,
  category:"Agreements"
  clientName: string;
  vendorCode: string;
  remarks:string;
  startDate: Date; 
  endDate: Date;
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  reminderDates:Date[],
  completed:boolean
}

export interface PurchaseOrder {
  id:string,
  email:string,
  category:"Purchase Order"
  clientName: string;
  consultant: string;
  remarks:string;
  poNumber: string;
  poIssueDate: Date;
  poEndDate: Date;
  entryDate: Date;
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  reminderDates:Date[],
  completed:boolean
}

export interface VisaDetails {
  id:string,
  email:string,
  category:"Visa Details"
  clientName: string;
  visaNumber: string;
  sponsor: string;
  consultantName: string;
  remarks:string;
  visaEndDate: Date;
  visaEntryDate: Date;
  visaExpiryDate:Date;
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  reminderDates:Date[],
  completed:boolean
}

export interface IQAMARenewals {
  id:string,
  email:string,
  category:"IQAMA Renewals"
  employeeName: string;
  iqamaNumber: string;
  remarks:string;
  expiryDate: Date;
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  reminderDates:Date[],
  completed:boolean
}

export interface InsuranceRenewals {
  id:string,
  email:string,
  category: 'Insurance Renewals';
  employeeName: string;
  insuranceStartDate: Date;
  insuranceEndDate: Date;
  insuranceCompany: string;
  insuranceCategory:string;
  remarks:string;
  employeeInsuranceValue: string;  
  spouseInsuranceValue?: string;    
  childrenInsuranceValues?: string[]; //upto 4 childrens
  value: string;  //consider this is the total sum insured
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  reminderDates:Date[],
  completed:boolean
}

export interface HouseRentalRenewal {
  id:string,
  email:string,
  category: 'House Rental Renewal';
  houseOwnerName:string,
  location:string,
  consultantName:string,
  startDate:Date,
  endDate:Date,
  rentAmount:string,  
  remarks:string;
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  reminderDates:Date[],
  completed:boolean
}

export type FormData = Agreements | PurchaseOrder | VisaDetails | IQAMARenewals | InsuranceRenewals | HouseRentalRenewal;


export type Category =
  | "Agreements"
  | "Purchase Order"
  | "Visa Details"
  | "IQAMA Renewals"
  | "Insurance Renewals" 
  | "House Rental Renewal"
  
import { differenceInDays } from 'date-fns';

export const categorizeData = (data: FormData[]): {
  next30Days: FormData[],
  next30to60Days: FormData[],
  next60to90Days: FormData[],
  laterThan90Days: FormData[],
  renewal: FormData[]
} => {
  const today = new Date();

  const renewal = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) < 1
  })

  const next30Days = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) > 1 && endDate && differenceInDays(endDate, today) <= 30;
  });

  const next30to60Days = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) > 30 && differenceInDays(endDate, today) <= 60;
  });

  const next60to90Days = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) > 60 && differenceInDays(endDate, today) <= 90;
  });

  const laterThan90Days = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) > 90;
  });

  return { next30Days, next30to60Days, next60to90Days, laterThan90Days, renewal };
};


type SortType = 'newest' | 'oldest' | 'renewal';

const sortData = (data: FormData[], sortBy: SortType): FormData[] => {
  switch (sortBy) {
    case 'newest':
      return [...data].sort((a, b) => {
        const endDateA = getEndDate(a)?.getTime() || 0;
        const endDateB = getEndDate(b)?.getTime() || 0;
        return endDateB - endDateA;
      });
    case 'oldest':
      return [...data].sort((a, b) => {
        const endDateA = getEndDate(a)?.getTime() || 0;
        const endDateB = getEndDate(b)?.getTime() || 0;
        return endDateA - endDateB;
      });
    case 'renewal':
      return data.filter(item => {
        const endDate = getEndDate(item);
        return endDate && differenceInDays(endDate, new Date()) < 0;
      });
    default:
      return data;
  }
};

export const getEndDate = (item: FormData): Date | null => {
  if ('endDate' in item) return item.endDate;
  if ('poEndDate' in item) return item.poEndDate;
  if ('visaEndDate' in item) return item.visaEndDate;
  if ('expiryDate' in item) return item.expiryDate;
  if ('insuranceEndDate' in item) return item.insuranceEndDate;
  return null;
};


// export const parseResponse = (data:any):FormData[]=>{
//   return data.map((item:any) => {
//     const baseData = {
//       id: item.id,
//       category: item.category,
//       remarks: item.remarks,
//       wantsCustomReminders: item.wantsCustomReminders,
//       customReminderDates: item.customReminderDates.map((date:string) => new Date(date)),
//       reminderDates: item.reminderDates.map((date:string) => new Date(date)),
//     };

//     switch (item.category){
//       case "Agreements":
//         return {
//           ...baseData,
//           clientName: item.clientName,
//           vendorCode: item.vendorCode,
//           startDate: new Date(item.startDate),
//           endDate: new Date(item.endDate),
//         } as Agreements;

//       case "Purchase Order":
//         return {
//           ...baseData,
//           clientName: item.clientName,
//           consultant: item.consultant,
//           poNumber: item.poNumber,
//           poIssueDate: new Date(item.poIssueDate),
//           poEndDate: new Date(item.poEndDate),
//           entryDate: new Date(item.entryDate),
//         } as PurchaseOrder;

//       case "Visa Details":
//         return {
//           ...baseData,
//           clientName: item.clientName,
//           visaNumber: item.visaNumber,
//           sponsor: item.sponsor,
//           consultantName: item.consultantName,
//           visaEndDate: new Date(item.visaEndDate),
//           visaEntryDate: new Date(item.visaEntryDate),
//         } as VisaDetails;

//       case "IQAMA Renewals":
//         return {
//           ...baseData,
//           employeeName: item.employeeName,
//           iqamaNumber: item.iqamaNumber,
//           expiryDate: new Date(item.expiryDate),
//         } as IQAMARenewals;

//       case "Insurance Renewals":
//         return {
//           ...baseData,
//           employeeName: item.employeeName,
//           insuranceStartDate: new Date(item.insuranceStartDate),
//           insuranceEndDate: new Date(item.insuranceEndDate),
//           insuranceCompany: item.insuranceCompany,
//           insuranceCategory: item.insuranceCategory,
//           value: item.value,
//           employeeInsuranceValue:item.employeeInsuranceValue,

//         } as InsuranceRenewals;

//         case "House Rental Renewal":
//           return {
//             ...baseData,
//             consultantName:item.consultantName,
//             startDate:item.startDate,
//             endDate:item.endDate,
//             houseOwnerName:item.houseOwnerName,
//             location:item.location,
//             rentAmount:item.rentAmount,
//           } as HouseRentalRenewal;

//       default:
//         throw new Error(`Unknown category: ${item.category}`);
//     }
//   })
// }

export const parseDates = (data: FormData[]): FormData[] => {
  return data.map((item) => {
    switch (item.category) {
      case 'Agreements':
        return {
          ...item,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          customReminderDates: item.customReminderDates.map((date) => new Date(date)),
          reminderDates: item.reminderDates.map((date) => new Date(date)),
        };
      case 'Purchase Order':
        return {
          ...item,
          poIssueDate: new Date(item.poIssueDate),
          poEndDate: new Date(item.poEndDate),
          entryDate: new Date(item.entryDate),
          customReminderDates: item.customReminderDates.map((date) => new Date(date)),
          reminderDates: item.reminderDates.map((date) => new Date(date)),
        };
      case 'Visa Details':
        return {
          ...item,
          visaEndDate: new Date(item.visaEndDate),
          visaEntryDate: new Date(item.visaEntryDate),
          customReminderDates: item.customReminderDates.map((date) => new Date(date)),
          reminderDates: item.reminderDates.map((date) => new Date(date)),
        };
      case 'IQAMA Renewals':
        return {
          ...item,
          expiryDate: new Date(item.expiryDate),
          customReminderDates: item.customReminderDates.map((date) => new Date(date)),
          reminderDates: item.reminderDates.map((date) => new Date(date)),
        };
      case 'Insurance Renewals':
        return {
          ...item,
          insuranceStartDate: new Date(item.insuranceStartDate),
          insuranceEndDate: new Date(item.insuranceEndDate),
          customReminderDates: item.customReminderDates.map((date) => new Date(date)),
          reminderDates: item.reminderDates.map((date) => new Date(date)),
        };
      case 'House Rental Renewal':
        return {
          ...item,
          endDate: new Date(item.endDate),
          startDate:new Date(item.startDate),
          customReminderDates:item.customReminderDates.map((date)=>new Date(date)),
          reminderDates: item.reminderDates.map((date) => new Date(date)),
        }
      default:
        return item;
    }
  });
};

export const parseDateForSingleItem = (item:FormData):FormData=>{
  switch (item.category) {
    case 'Agreements':
      return {
        ...item,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        customReminderDates: item.customReminderDates.map((date) => new Date(date)),
        reminderDates: item.reminderDates.map((date) => new Date(date)),
      };
    case 'Purchase Order':
      return {
        ...item,
        poIssueDate: new Date(item.poIssueDate),
        poEndDate: new Date(item.poEndDate),
        entryDate: new Date(item.entryDate),
        customReminderDates: item.customReminderDates.map((date) => new Date(date)),
        reminderDates: item.reminderDates.map((date) => new Date(date)),
      };
    case 'Visa Details':
      return {
        ...item,
        visaEndDate: new Date(item.visaEndDate),
        visaEntryDate: new Date(item.visaEntryDate),
        customReminderDates: item.customReminderDates.map((date) => new Date(date)),
        reminderDates: item.reminderDates.map((date) => new Date(date)),
      };
    case 'IQAMA Renewals':
      return {
        ...item,
        expiryDate: new Date(item.expiryDate),
        customReminderDates: item.customReminderDates.map((date) => new Date(date)),
        reminderDates: item.reminderDates.map((date) => new Date(date)),
      };
    case 'Insurance Renewals':
      return {
        ...item,
        insuranceStartDate: new Date(item.insuranceStartDate),
        insuranceEndDate: new Date(item.insuranceEndDate),
        customReminderDates: item.customReminderDates.map((date) => new Date(date)),
        reminderDates: item.reminderDates.map((date) => new Date(date)),
      };
    default:
      return {
        ...item,
        endDate: new Date(item.endDate),
        startDate:new Date(item.startDate),
        customReminderDates:item.customReminderDates.map((date)=>new Date(date)),
        reminderDates: item.reminderDates.map((date) => new Date(date)),
      }
  }
}