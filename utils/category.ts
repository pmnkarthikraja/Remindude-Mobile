export interface AssignedTo{
  email:string,
  reminderEnabled:boolean
}

export interface BaseFormData {
  id: string;
  email: string;
  remarks?: string;
  wantsCustomReminders: boolean;
  customReminderDates: Date[];
  reminderDates: Date[];
  completed: boolean,
  assignedTo?: AssignedTo | undefined,  //example kannan, assigning task to karthik and deepika
  assignedBy?: string | undefined  //email  // consider i am karthik, task assigned by kannan or undefined (if no one assigned me a task)
}

export interface Agreements extends BaseFormData {
  category:"Agreements"
  clientName: string;
  vendorCode: string;
  startDate: Date; 
  endDate: Date;
}

export interface PurchaseOrder extends BaseFormData {
  category:"Purchase Order"
  clientName: string;
  consultant: string;
  poNumber: string;
  poIssueDate: Date;
  poEndDate: Date;
  entryDate: Date;
}

export interface VisaDetails  extends BaseFormData{
  category:"Visa Details"
  clientName: string;
  visaNumber: string;
  sponsor: string;
  consultantName: string;
  visaEndDate: Date;
  visaEntryDate: Date;
  visaExpiryDate:Date;
}

export interface IQAMARenewals  extends BaseFormData{
  category:"IQAMA Renewals"
  employeeName: string;
  iqamaNumber: string;
  expiryDate: Date;
}

export interface InsuranceRenewals  extends BaseFormData{
  category: 'Insurance Renewals';
  employeeName: string;
  insuranceStartDate: Date;
  insuranceEndDate: Date;
  insuranceCompany: string;
  insuranceCategory:string;
  employeeInsuranceValue: string;  
  spouseInsuranceValue?: string;    
  childrenInsuranceValues?: string[]; //upto 4 childrens
  value: string;  //consider this is the total sum insured
}

export interface HouseRentalRenewal  extends BaseFormData{
  category: 'House Rental Renewal';
  houseOwnerName:string,
  location:string,
  consultantName:string,
  startDate:Date,
  endDate:Date,
  rentAmount:string,  
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

export const categorizeData1 = (data: FormData[]): {
  next30Days: FormData[],
  next30to60Days: FormData[],
  next60to90Days: FormData[],
  laterThan90Days: FormData[],
  renewal: FormData[],
  assignedTasksToOthers:FormData[]
} => {
  const today = new Date();

  const renewal = data.filter(item => {
    const endDate = getEndDate(item);
    return endDate && differenceInDays(endDate, today) < 1
  })

  const assignedTasksToOthers = data.filter(item=> {
      if (!!item.assignedTo){
        return true
      }
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

  return { next30Days, next30to60Days, next60to90Days, laterThan90Days, renewal , assignedTasksToOthers};
};

export const categorizeData = (data: FormData[]): {
  next30Days: FormData[],
  next30to60Days: FormData[],
  next60to90Days: FormData[],
  laterThan90Days: FormData[],
  renewal: FormData[],
  assignedTasksToOthers: FormData[],
  assignedTasksToYou: FormData[],
} => {
  const today = new Date();

  return data.reduce((acc, item) => {
    const endDate = getEndDate(item);
    
    if (endDate) {
      const diffDays = differenceInDays(endDate, today);

      if (diffDays < 1 && !item.assignedTo && !item.assignedBy) {
        acc.renewal.push(item); // renewal task
      } else if (diffDays >0 && diffDays <= 30 && !item.assignedTo && !item.assignedBy) {
        acc.next30Days.push(item); // within the next 30 days
      } else if (diffDays> 30 && diffDays<= 60 && !item.assignedTo && !item.assignedBy) {
        acc.next30to60Days.push(item); // between 30 to60 days
      } else if (diffDays> 60 && diffDays <= 90 && !item.assignedTo && !item.assignedBy) {
        acc.next60to90Days.push(item); // between 60 to 90 days
      } else if (diffDays > 90 && !item.assignedBy && !item.assignedTo) {
        acc.laterThan90Days.push(item); // more than 90 days
      }
    }

    if (item.assignedTo) {
      acc.assignedTasksToOthers.push(item); // assigned tasks to others
    }

    if (item.assignedBy) {
      acc.assignedTasksToYou.push(item)
    }

    return acc;
  }, {
    next30Days: [] as FormData[],
    next30to60Days: [] as FormData[],
    next60to90Days: [] as FormData[],
    laterThan90Days: [] as FormData[],
    renewal: [] as FormData[],
    assignedTasksToOthers: [] as FormData[],
    assignedTasksToYou:[] as  FormData[],

  });
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



//test data--------

const emails: string[] = ["karthik@example.com", "kannan@example.com", "deepika@example.com", "alex@example.com", "jane@example.com"];
const clientNames: string[] = ["Client A", "Client B", "Client C", "Client D", "Client E"];
const vendorCodes: string[] = ["VC001", "VC002", "VC003", "VC004", "VC005"];

function getRandomEmail(): string {
  return emails[Math.floor(Math.random() * emails.length)];
}

function getRandomRemarks(): string | undefined {
  const remarks = ["Sample remarks", "Additional info", undefined];
  return remarks[Math.floor(Math.random() * remarks.length)];
}

function getRandomAssignedTo(): AssignedTo {
  return {
    email: getRandomEmail(),
    reminderEnabled: Math.random() < 0.5,
  }
}

function getRandomAssignedBy(): string | undefined {
  const assignedByOptions = [...emails, undefined];
  return assignedByOptions[Math.floor(Math.random() * assignedByOptions.length)];
}

function getRandomClientName(): string {
  return clientNames[Math.floor(Math.random() * clientNames.length)];
}

function getRandomVendorCode(): string {
  return vendorCodes[Math.floor(Math.random() * vendorCodes.length)];
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomDates(min: number, max: number): Date[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  return Array.from({ length: count }, () => getRandomDate(new Date(), new Date(2025, 11, 31)));
}

export const testAgreementsData: Agreements[] = Array.from({ length: 200 }, (_, i) => ({
  id: `${(i + 1).toString().padStart(3, '0')}`,
  email: getRandomEmail(),
  remarks: getRandomRemarks(),
  wantsCustomReminders: Math.random() < 0.5,
  customReminderDates: getRandomDates(0, 3),
  reminderDates: getRandomDates(1, 3),
  completed: Math.random() < 0.5,
  // assignedTo: getRandomAssignedTo(),
  // assignedBy: getRandomAssignedBy(),
  category: "Agreements",
  clientName: getRandomClientName(),
  vendorCode: getRandomVendorCode(),
  startDate: getRandomDate(new Date(2023, 0, 1), new Date()),
  endDate: getRandomDate(new Date(), new Date(2025, 11, 31)),
}));
