import { Agreements, CategoryFormData, InsuranceRenewals, Onboarding, OtherCategoryData, PurchaseOrder, VisaDetails } from "./category";

export const agreementsData: Agreements[] = [
    {
      clientName: "Client A",
      vendorCode: "V123",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
    },
    {
      clientName: "Client B",
      vendorCode: "V456",
      startDate: "2023-03-15",
      endDate: "2024-03-15",
    },
    {
      clientName: "Client C",
      vendorCode: "V789",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
    },
    {
      clientName: "Client D",
      vendorCode: "V321",
      startDate: "2023-02-20",
      endDate: "2023-11-20",
    },
    {
      clientName: "Client E",
      vendorCode: "V654",
      startDate: "2023-05-10",
      endDate: "2024-05-10",
    },
  ];
  
  export const purchaseOrderData: PurchaseOrder[] = [
    {
      clientName: "Client A",
      consultant: "Consultant 1",
      poNumber: "PO-001",
      poIssueDate: "2023-01-10",
      poEndDate: "2023-02-10",
      entryDate: "2023-01-05",
    },
    {
      clientName: "Client B",
      consultant: "Consultant 2",
      poNumber: "PO-002",
      poIssueDate: "2023-02-15",
      poEndDate: "2023-03-15",
      entryDate: "2023-02-10",
    },
    {
      clientName: "Client C",
      consultant: "Consultant 3",
      poNumber: "PO-003",
      poIssueDate: "2023-03-20",
      poEndDate: "2023-04-20",
      entryDate: "2023-03-15",
    },
    {
      clientName: "Client D",
      consultant: "Consultant 4",
      poNumber: "PO-004",
      poIssueDate: "2023-04-25",
      poEndDate: "2023-05-25",
      entryDate: "2023-04-20",
    },
    {
      clientName: "Client E",
      consultant: "Consultant 5",
      poNumber: "PO-005",
      poIssueDate: "2023-05-30",
      poEndDate: "2023-06-30",
      entryDate: "2023-05-25",
    },
  ];
  
  export const visaDetailsData: VisaDetails[] = [
    {
      clientName: "Client A",
      visaNumber: "VN-001",
      sponsor: "Sponsor A",
      consultantName: "Consultant 1",
      visaEndDate: "2024-01-01",
      visaEntryDate: "2023-01-01",
    },
    {
      clientName: "Client B",
      visaNumber: "VN-002",
      sponsor: "Sponsor B",
      consultantName: "Consultant 2",
      visaEndDate: "2024-02-01",
      visaEntryDate: "2023-02-01",
    },
    {
      clientName: "Client C",
      visaNumber: "VN-003",
      sponsor: "Sponsor C",
      consultantName: "Consultant 3",
      visaEndDate: "2024-03-01",
      visaEntryDate: "2023-03-01",
    },
    {
      clientName: "Client D",
      visaNumber: "VN-004",
      sponsor: "Sponsor D",
      consultantName: "Consultant 4",
      visaEndDate: "2024-04-01",
      visaEntryDate: "2023-04-01",
    },
    {
      clientName: "Client E",
      visaNumber: "VN-005",
      sponsor: "Sponsor E",
      consultantName: "Consultant 5",
      visaEndDate: "2024-05-01",
      visaEntryDate: "2023-05-01",
    },
  ];
  
  export const onboardingData: Onboarding[] = [
    {
      employeeName: "John Doe",
      iqamaNumber: "IQ-001",
      expiryDate: "2024-01-01",
    },
    {
      employeeName: "Jane Smith",
      iqamaNumber: "IQ-002",
      expiryDate: "2024-02-01",
    },
    {
      employeeName: "Alice Johnson",
      iqamaNumber: "IQ-003",
      expiryDate: "2024-03-01",
    },
    {
      employeeName: "Bob Brown",
      iqamaNumber: "IQ-004",
      expiryDate: "2024-04-01",
    },
    {
      employeeName: "Charlie White",
      iqamaNumber: "IQ-005",
      expiryDate: "2024-05-01",
    },
  ];
  
  export const insuranceRenewalData: InsuranceRenewals[] = [
    {
      employeeName: "John Doe",
      insuranceStartDate: "2023-01-01",
      insuranceEndDate: "2024-01-01",
      insuranceCompany: "Insurance Co A",
      category: "Health",
      value: 1000,
    },
    {
      employeeName: "Jane Smith",
      insuranceStartDate: "2023-02-01",
      insuranceEndDate: "2024-02-01",
      insuranceCompany: "Insurance Co B",
      category: "Life",
      value: 2000,
    },
    {
      employeeName: "Alice Johnson",
      insuranceStartDate: "2023-03-01",
      insuranceEndDate: "2024-03-01",
      insuranceCompany: "Insurance Co C",
      category: "Dental",
      value: 3000,
    },
    {
      employeeName: "Bob Brown",
      insuranceStartDate: "2023-04-01",
      insuranceEndDate: "2024-04-01",
      insuranceCompany: "Insurance Co D",
      category: "Vision",
      value: 1500,
    },
    {
      employeeName: "Charlie White",
      insuranceStartDate: "2023-05-01",
      insuranceEndDate: "2024-05-01",
      insuranceCompany: "Insurance Co E",
      category: "Health",
      value: 2500,
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
  

 const data:CategoryFormData<'Agreements'>={
    category:'Agreements',
    fields:{
        clientName:'Rajesh',
        endDate:'12-09-1019',
        startDate:'22-11-2011',
        vendorCode:'23223'
    }
 }