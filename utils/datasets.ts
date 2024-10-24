
const enddate = (days:number) => new Date(new Date().setDate(new Date().getDate()+days))

// export const agreementsData: Agreements[] = [
//   {
//     id:uuid.v4().toString(),
//     category:'Agreements',
//     clientName: "Karthikraja",
//     vendorCode: "V143",
//     remarks:'',
//     startDate: enddate(-60),
//     endDate: enddate(-10),
//     wantsCustomReminders:true,
//     customReminderDates:[
//       enddate(10),
//       enddate(40)
//     ],
//     reminderDates:[]
//   },
//   {
//     id:uuid.v4().toString(),
//     category:'Agreements',
//     clientName: "Deepika",
//     vendorCode: "V123",
//     remarks:'',
//     startDate: new Date(),
//     endDate: enddate(3),
//     wantsCustomReminders:true,
//     customReminderDates:[
//       enddate(10),
//       enddate(40)
//     ],
//     reminderDates:[]
//   },
//   {
//     id:uuid.v4().toString(),
//     category:'Agreements',
//     clientName: "Client B",
//     vendorCode: "V456",
//     remarks:'',
//     startDate: new Date(),
//     endDate: enddate(90),
//     wantsCustomReminders:true,
//     customReminderDates:[
//       enddate(10),
//       enddate(40)
//     ],
//     reminderDates:[]
//   },
//   {
//     id:uuid.v4().toString(),
//     category:'Agreements',
//     clientName: "Client C",
//     vendorCode: "V789",
//     remarks:'',
//     startDate: new Date(),
//     endDate: enddate(32),
//     wantsCustomReminders:true,
//     customReminderDates:[
//       enddate(10),
//       enddate(40)
//     ],
//     reminderDates:[]
//   },
//   {
//     id:uuid.v4().toString(),
//     category:'Agreements',
//     clientName: "Client D",
//     vendorCode: "V321",
//     remarks:'',
//     startDate: new Date(),
//     endDate: enddate(64),
//     wantsCustomReminders:true,
//     customReminderDates:[
//       enddate(10),
//       enddate(40)
//     ],
//     reminderDates:[]
//   },
//   {
//     id:uuid.v4().toString(),
//     category:'Agreements',
//     clientName: "Client E",
//     vendorCode: "V654",
//     remarks:'',
//     startDate: new Date(),
//     endDate: enddate(100),
//     wantsCustomReminders:true,
//     customReminderDates:[
//       enddate(10),
//       enddate(40)
//     ],
//     reminderDates:[]
//   },
//   ];
  
//   export const purchaseOrderData: PurchaseOrder[] = [
//     {
//       id:uuid.v4().toString(),
//       category:'Purchase Order',
//       clientName: "Client A",
//       consultant: "Consultant 1",
//       poNumber: "PO-001",
//       remarks:'',
//       poIssueDate: new Date(),
//       poEndDate:  enddate(90),
//       entryDate: new Date(),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//     reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'Purchase Order',
//       clientName: "Client B",
//       consultant: "Consultant 2",
//       poNumber: "PO-002",
//       remarks:'',
//       poIssueDate: new Date(),
//       poEndDate:  enddate(90),
//       entryDate: new Date(),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//     reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'Purchase Order',
//       clientName: "Client C",
//       consultant: "Consultant 3",
//       poNumber: "PO-003",
//       remarks:'',
//       poIssueDate: new Date(),
//       poEndDate:  enddate(40),
//       entryDate: new Date(),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//     reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'Purchase Order',
//       clientName: "Client D",
//       consultant: "Consultant 4",
//       poNumber: "PO-004",
//       remarks:'',
//       poIssueDate: new Date(),
//       poEndDate:  enddate(23),
//       entryDate: new Date(),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//     reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'Purchase Order',
//       clientName: "Client E",
//       consultant: "Consultant 5",
//       poNumber: "PO-005",
//       remarks:'',
//       poIssueDate: new Date(),
//       poEndDate:  enddate(10),
//       entryDate: new Date(),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//     reminderDates:[]
//     },
//   ];
  
//   export const visaDetailsData: VisaDetails[] = [
//     {
//       id:uuid.v4().toString(),
//       category:'Visa Details',
//       clientName: "Client A",
//       visaNumber: "VN-001",
//       sponsor: "Sponsor A",
//       consultantName: "Consultant 1",
//       remarks:'',
//       visaEndDate: new Date(),
//       visaEntryDate: enddate(29),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//     reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'Visa Details',
//       clientName: "Client B",
//       visaNumber: "VN-002",
//       sponsor: "Sponsor B",
//       consultantName: "Consultant 2",
//       remarks:'',
//       visaEndDate: new Date(),
//       visaEntryDate: enddate(99),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//     reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'Visa Details',
//       clientName: "Client C",
//       visaNumber: "VN-003",
//       sponsor: "Sponsor C",
//       consultantName: "Consultant 3",
//       remarks:'',
//       visaEndDate: new Date(),
//       visaEntryDate: enddate(59),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//     reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'Visa Details',
//       clientName: "Client D",
//       visaNumber: "VN-004",
//       sponsor: "Sponsor D",
//       consultantName: "Consultant 4",
//       remarks:'',
//       visaEndDate: new Date(),
//       visaEntryDate: enddate(49),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//     reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'Visa Details',
//       clientName: "Client E",
//       visaNumber: "VN-005",
//       sponsor: "Sponsor E",
//       consultantName: "Consultant 5",
//       remarks:'',
//       visaEndDate: new Date(),
//       visaEntryDate: enddate(19),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//     reminderDates:[]
//     },
//   ];
  
//   export const iqamaRenewals: IQAMARenewals[] = [
//     {
//       id:uuid.v4().toString(),
//       category:'IQAMA Renewals',
//       employeeName: "John Doe",
//       iqamaNumber: "IQ-001",
//       remarks:'',
//       expiryDate: enddate(30),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//       reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'IQAMA Renewals',
//       employeeName: "Jane Smith",
//       iqamaNumber: "IQ-002",
//       remarks:'',
//       expiryDate: enddate(80),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//       reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'IQAMA Renewals',
//       employeeName: "Alice Johnson",
//       iqamaNumber: "IQ-003",
//       remarks:'',
//       expiryDate: enddate(34),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//       reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'IQAMA Renewals',
//       employeeName: "Bob Brown",
//       iqamaNumber: "IQ-004",
//       remarks:'',
//       expiryDate: enddate(12),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//       reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category:'IQAMA Renewals',
//       employeeName: "Charlie White",
//       iqamaNumber: "IQ-005",
//       remarks:'',
//       expiryDate: enddate(56),
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//       reminderDates:[]
//     },
//   ];
  
//   export const insuranceRenewalData: InsuranceRenewals[] = [
//     {
//       id:uuid.v4().toString(),
//       category: 'Insurance Renewals',
//       employeeName: "John Doe",
//       insuranceStartDate: new Date(),
//       insuranceEndDate: enddate(45),
//       insuranceCompany: "Insurance Co A",
//       value: "1000",
//       insuranceCategory:'Bajaj',
//       remarks:'',
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//         enddate(40)
//       ],
//       reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category: 'Insurance Renewals',
//       employeeName: "Jane Smith",
//       insuranceStartDate: new Date(),
//       insuranceEndDate: enddate(25),
//       insuranceCompany: "Insurance Co B",
//       value: "1000",
//       insuranceCategory:'Bajaj',
//       remarks:'',
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//       ],
//       reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category: 'Insurance Renewals',
//       employeeName: "Alice Johnson",
//       insuranceStartDate: new Date(),
//       insuranceEndDate: enddate(22),
//       insuranceCompany: "Insurance Co C",
//       value: "1000",
//       insuranceCategory:'Bajaj',
//       remarks:'',
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//       ],
//       reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category: 'Insurance Renewals',
//       employeeName: "Bob Brown",
//       insuranceStartDate: new Date(),
//       insuranceEndDate: enddate(88),
//       insuranceCompany: "Insurance Co D",
//       value: "1000",
//       insuranceCategory:'Bajaj',
//       remarks:'',
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//       ],
//       reminderDates:[]
//     },
//     {
//       id:uuid.v4().toString(),
//       category: 'Insurance Renewals',
//       employeeName: "Charlie White",
//       insuranceStartDate: new Date(),
//       insuranceEndDate: enddate(32),
//       insuranceCompany: "Insurance Co E",
//       value: "1000",
//       insuranceCategory:'Bajaj',
//       remarks:'',
//       wantsCustomReminders:true,
//       customReminderDates:[
//         enddate(10),
//       ],
//       reminderDates:[]
//     },
//   ];
  
