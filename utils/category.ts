type DateString = string;

export interface OtherCategoryData {
    clientName: string;
    startDate: DateString; 
    endDate: DateString;
  }
  

export interface Agreements {
  category:"Agreements"
  clientName: string;
  vendorCode: string;
  remarks:string;
  startDate: Date; 
  endDate: Date;
}

export interface PurchaseOrder {
  category:"Purchase Order"
  clientName: string;
  consultant: string;
  remarks:string;
  poNumber: string;
  poIssueDate: Date;
  poEndDate: Date;
  entryDate: Date;
}

export interface VisaDetails {
  category:"Visa Details"
  clientName: string;
  visaNumber: string;
  sponsor: string;
  consultantName: string;
  remarks:string;
  visaEndDate: Date;
  visaEntryDate: Date;
}

export interface OnboardingConsultant {
  category:"Onboarding Consultant"
  employeeName: string;
  iqamaNumber: string;
  remarks:string;
  expiryDate: Date;
}

export interface InsuranceRenewals {
  category: 'Insurance Renewals';
  employeeName: string;
  insuranceStartDate: Date;
  insuranceEndDate: Date;
  insuranceCompany: string;
  insuranceCategory:string;
  remarks:string;
  value: string; 
}

export type Category =
  | "Agreements"
  | "Purchase Order"
  | "Visa Details"
  | "Onboarding Consultant"
  | "Insurance Renewals";

type CategoryFields = {
Agreements: Agreements;
"Purchase Order": PurchaseOrder;
"Visa Details": VisaDetails;
"Onboarding Consultant": OnboardingConsultant;
"Insurance Renewals": InsuranceRenewals;
};


export interface CategoryFormData<T extends Category> {
    category: T; 
    fields: CategoryFields[T]; 
  }


  