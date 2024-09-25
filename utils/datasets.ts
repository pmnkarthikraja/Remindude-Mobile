import { Agreements, CategoryFormData, InsuranceRenewals, OnboardingConsultant, OtherCategoryData, PurchaseOrder, VisaDetails } from "./category";
import uuid from 'react-native-uuid';


export const agreementsData: Agreements[] = [
    {
      id:uuid.v4().toString(),
      category:'Agreements',
      clientName: "Client A",
      vendorCode: "V123",
      remarks:'',
      startDate: new Date(),
      endDate: new Date(new Date().getDate()+10)
    },
    {
      id:uuid.v4().toString(),
      category:'Agreements',
      clientName: "Client B",
      vendorCode: "V456",
      remarks:'',
      startDate: new Date(),
      endDate: new Date(new Date().getDate()+30)
    },
    {
      id:uuid.v4().toString(),
      category:'Agreements',
      clientName: "Client C",
      vendorCode: "V789",
      remarks:'',
      startDate: new Date(),
      endDate: new Date(new Date().getDate()+19)
    },
    {
      id:uuid.v4().toString(),
      category:'Agreements',
      clientName: "Client D",
      vendorCode: "V321",
      remarks:'',
      startDate: new Date(),
      endDate: new Date(new Date().getDate()+20)
    },
    {
      id:uuid.v4().toString(),
      category:'Agreements',
      clientName: "Client E",
      vendorCode: "V654",
      remarks:'',
      startDate: new Date(),
      endDate: new Date(new Date().getDate()+90)
    },
  ];
  
  export const purchaseOrderData: PurchaseOrder[] = [
    {
      id:uuid.v4().toString(),
      category:'Purchase Order',
      clientName: "Client A",
      consultant: "Consultant 1",
      poNumber: "PO-001",
      remarks:'',
      poIssueDate: new Date(),
      poEndDate:  new Date(new Date().getDate()+90),
      entryDate: new Date(),
    },
    {
      id:uuid.v4().toString(),
      category:'Purchase Order',
      clientName: "Client B",
      consultant: "Consultant 2",
      poNumber: "PO-002",
      remarks:'',
      poIssueDate: new Date(),
      poEndDate:  new Date(new Date().getDate()+90),
      entryDate: new Date(),
    },
    {
      id:uuid.v4().toString(),
      category:'Purchase Order',
      clientName: "Client C",
      consultant: "Consultant 3",
      poNumber: "PO-003",
      remarks:'',
      poIssueDate: new Date(),
      poEndDate:  new Date(new Date().getDate()+40),
      entryDate: new Date(),
    },
    {
      id:uuid.v4().toString(),
      category:'Purchase Order',
      clientName: "Client D",
      consultant: "Consultant 4",
      poNumber: "PO-004",
      remarks:'',
      poIssueDate: new Date(),
      poEndDate:  new Date(new Date().getDate()+55),
      entryDate: new Date(),
    },
    {
      id:uuid.v4().toString(),
      category:'Purchase Order',
      clientName: "Client E",
      consultant: "Consultant 5",
      poNumber: "PO-005",
      remarks:'',
      poIssueDate: new Date(),
      poEndDate:  new Date(new Date().getDate()+20),
      entryDate: new Date(),
    },
  ];
  
  export const visaDetailsData: VisaDetails[] = [
    {
      id:uuid.v4().toString(),
      category:'Visa Details',
      clientName: "Client A",
      visaNumber: "VN-001",
      sponsor: "Sponsor A",
      consultantName: "Consultant 1",
      remarks:'',
      visaEndDate: new Date(),
      visaEntryDate: new Date(new Date().getDate()+1),
    },
    {
      id:uuid.v4().toString(),
      category:'Visa Details',
      clientName: "Client B",
      visaNumber: "VN-002",
      sponsor: "Sponsor B",
      consultantName: "Consultant 2",
      remarks:'',
      visaEndDate: new Date(),
      visaEntryDate: new Date(new Date().getDate()+1),
    },
    {
      id:uuid.v4().toString(),
      category:'Visa Details',
      clientName: "Client C",
      visaNumber: "VN-003",
      sponsor: "Sponsor C",
      consultantName: "Consultant 3",
      remarks:'',
      visaEndDate: new Date(),
      visaEntryDate: new Date(new Date().getDate()+1),
    },
    {
      id:uuid.v4().toString(),
      category:'Visa Details',
      clientName: "Client D",
      visaNumber: "VN-004",
      sponsor: "Sponsor D",
      consultantName: "Consultant 4",
      remarks:'',
      visaEndDate: new Date(),
      visaEntryDate: new Date(new Date().getDate()+1),
    },
    {
      id:uuid.v4().toString(),
      category:'Visa Details',
      clientName: "Client E",
      visaNumber: "VN-005",
      sponsor: "Sponsor E",
      consultantName: "Consultant 5",
      remarks:'',
      visaEndDate: new Date(),
      visaEntryDate: new Date(new Date().getDate()+1),
    },
  ];
  
  export const onboardingData: OnboardingConsultant[] = [
    {
      id:uuid.v4().toString(),
      category:'Onboarding Consultant',
      employeeName: "John Doe",
      iqamaNumber: "IQ-001",
      remarks:'',
      expiryDate: new Date(new Date().getDate()+11),
    },
    {
      id:uuid.v4().toString(),
      category:'Onboarding Consultant',
      employeeName: "Jane Smith",
      iqamaNumber: "IQ-002",
      remarks:'',
      expiryDate: new Date(new Date().getDate()+11),
    },
    {
      id:uuid.v4().toString(),
      category:'Onboarding Consultant',
      employeeName: "Alice Johnson",
      iqamaNumber: "IQ-003",
      remarks:'',
      expiryDate: new Date(new Date().getDate()+11),
    },
    {
      id:uuid.v4().toString(),
      category:'Onboarding Consultant',
      employeeName: "Bob Brown",
      iqamaNumber: "IQ-004",
      remarks:'',
      expiryDate: new Date(new Date().getDate()+11),
    },
    {
      id:uuid.v4().toString(),
      category:'Onboarding Consultant',
      employeeName: "Charlie White",
      iqamaNumber: "IQ-005",
      remarks:'',
      expiryDate: new Date(new Date().getDate()+11),
    },
  ];
  
  export const insuranceRenewalData: InsuranceRenewals[] = [
    {
      id:uuid.v4().toString(),
      category: 'Insurance Renewals',
      employeeName: "John Doe",
      insuranceStartDate: new Date(),
      insuranceEndDate: new Date(new Date().getDate()+91),
      insuranceCompany: "Insurance Co A",
      value: "1000",
      insuranceCategory:'Bajaj',
      remarks:''
    },
    {
      id:uuid.v4().toString(),
      category: 'Insurance Renewals',
      employeeName: "Jane Smith",
      insuranceStartDate: new Date(),
      insuranceEndDate: new Date(new Date().getDate()+91),
      insuranceCompany: "Insurance Co B",
      value: "1000",
      insuranceCategory:'Bajaj',
      remarks:''
    },
    {
      id:uuid.v4().toString(),
      category: 'Insurance Renewals',
      employeeName: "Alice Johnson",
      insuranceStartDate: new Date(),
      insuranceEndDate: new Date(new Date().getDate()+41),
      insuranceCompany: "Insurance Co C",
      value: "1000",
      insuranceCategory:'Bajaj',
      remarks:''
    },
    {
      id:uuid.v4().toString(),
      category: 'Insurance Renewals',
      employeeName: "Bob Brown",
      insuranceStartDate: new Date(),
      insuranceEndDate: new Date(new Date().getDate()+21),
      insuranceCompany: "Insurance Co D",
      value: "1000",
      insuranceCategory:'Bajaj',
      remarks:''
    },
    {
      id:uuid.v4().toString(),
      category: 'Insurance Renewals',
      employeeName: "Charlie White",
      insuranceStartDate: new Date(),
      insuranceEndDate: new Date(new Date().getDate()+41),
      insuranceCompany: "Insurance Co E",
      value: "1000",
      insuranceCategory:'Bajaj',
      remarks:''
    },
  ];
  

  export const otheCategoriesData: OtherCategoryData[] = [
    {
      clientName: "Client A",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
    },
    {
      clientName: "Client B",
      startDate: "2023-03-15",
      endDate: "2024-03-15",
    },
    {
      clientName: "Client C",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
    },
    {
      clientName: "Client D",
      startDate: "2023-02-20",
      endDate: "2023-11-20",
    },
    {
      clientName: "Client E",
      startDate: "2023-05-10",
      endDate: "2024-05-10",
    },
  ];
