export interface OtherCategoryData {
   id:string,
   category:string,
   clientName: string;
   remarks:string,
   startDate:Date,
   endDate:Date,
   poIssueDate: Date;
  poEndDate: Date;
  visaEndDate: Date;
  visaEntryDate: Date;
  expiryDate: Date;
  insuranceStartDate: Date;
  insuranceEndDate: Date;
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  }
  

export interface Agreements {
  id:string,
  category:"Agreements"
  clientName: string;
  vendorCode: string;
  remarks:string;
  startDate: Date; 
  endDate: Date;
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  reminderDates:Date[]
}

export interface PurchaseOrder {
  id:string,
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
  reminderDates:Date[]
}

export interface VisaDetails {
  id:string,
  category:"Visa Details"
  clientName: string;
  visaNumber: string;
  sponsor: string;
  consultantName: string;
  remarks:string;
  visaEndDate: Date;
  visaEntryDate: Date;
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  reminderDates:Date[]
}

export interface IQAMARenewals {
  id:string,
  category:"IQAMA Renewals"
  employeeName: string;
  iqamaNumber: string;
  remarks:string;
  expiryDate: Date;
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  reminderDates:Date[]
}

export interface InsuranceRenewals {
  id:string,
  category: 'Insurance Renewals';
  employeeName: string;
  insuranceStartDate: Date;
  insuranceEndDate: Date;
  insuranceCompany: string;
  insuranceCategory:string;
  remarks:string;
  value: string; 
  wantsCustomReminders:boolean;
  customReminderDates:Date[];
  reminderDates:Date[]
}

export type Category =
  | "Agreements"
  | "Purchase Order"
  | "Visa Details"
  | "IQAMA Renewals"
  | "Insurance Renewals"
  // | "IQAMA Renewals"
  // | "Interview Schedule"
  // | "VAT Submission"
  // | "Bills Payments"
  // | "Room Rent Collection"
  // | "Room Rent Pay"
  // | "Saudi Salary Processing"
  // | "WithHolding Tax"
  // | "Reimbursements"
  // | "Deduction"
  // | "GOSI Payments"
  // | "Saudization Payment collection"
  // | "Employee Issue Tracking"

type CategoryFields = {
Agreements: Agreements;
"Purchase Order": PurchaseOrder;
"Visa Details": VisaDetails;
"IQAMA Renewals": IQAMARenewals;
"Insurance Renewals": InsuranceRenewals;
};

export type FormData = Agreements | PurchaseOrder | VisaDetails | IQAMARenewals | InsuranceRenewals;


// export interface CategoryFormData<T extends Category> {
//     category: T; 
//     fields: CategoryFields[T]; 
//   }


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
