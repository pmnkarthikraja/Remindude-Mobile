type DateString = string;

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
  }
  

export interface Agreements {
  id:string,
  category:"Agreements"
  clientName: string;
  vendorCode: string;
  remarks:string;
  startDate: Date; 
  endDate: Date;
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
}

export interface OnboardingConsultant {
  id:string,
  category:"Onboarding Consultant"
  employeeName: string;
  iqamaNumber: string;
  remarks:string;
  expiryDate: Date;
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
}

export type Category =
  | "Agreements"
  | "Purchase Order"
  | "Visa Details"
  | "Onboarding Consultant"
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
"Onboarding Consultant": OnboardingConsultant;
"Insurance Renewals": InsuranceRenewals;
};

export type FormData = Agreements | PurchaseOrder | VisaDetails | OnboardingConsultant | InsuranceRenewals;


// export interface CategoryFormData<T extends Category> {
//     category: T; 
//     fields: CategoryFields[T]; 
//   }


  