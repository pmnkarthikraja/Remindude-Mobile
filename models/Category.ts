import { Category } from "@/utils/category";
import { BSON, ObjectSchema, Object } from "realm";

// AssignedTo Schema
export class AssignedTo extends Object<AssignedTo> {
    email!: string;
    reminderEnabled!: boolean;
  
    static schema: ObjectSchema = {
      name: "AssignedTo",
      // embedded: true, // Embedded object
      properties: {
        email: "string",
        reminderEnabled: "bool",
      },
    };
  }

export class FormData extends Object<FormData> {
    _id: BSON.ObjectId = new BSON.ObjectId();
    email!: string;
    remarks?: string;
    wantsCustomReminders!: boolean;
    customReminderDates!: Date[];
    reminderDates!: Date[];
    completed!: boolean;
    assignedTo?: AssignedTo;
    assignedBy?: string;
    category!: Category; // Differentiates between the types
  
    static schema: ObjectSchema = {
      name: "FormData",
      primaryKey: "_id",
      properties: {
        _id: "objectId",
        email: "string",
        remarks: "string?",
        wantsCustomReminders: "bool",
        customReminderDates: "date[]",
        reminderDates: "date[]",
        completed: "bool",
        assignedTo: "AssignedTo?",
        assignedBy: "string?",
        category: "string", // Stores the type (e.g., "Agreements", "Purchase Order")
      },
    };
  }
  

  // export class Agreements extends FormData {
  //   clientName!: string;
  //   vendorCode!: string;
  //   startDate!: Date;
  //   endDate!: Date;
  
  //   static schema: ObjectSchema = {
  //     name: "Agreements",
  //     embedded: false,
  //     properties: {
  //       ...FormData.schema.properties,
  //       clientName: "string",
  //       vendorCode: "string",
  //       startDate: "date",
  //       endDate: "date",
  //     },
  //   };
  // }

  export class Agreements extends FormData {
    clientName!: string;
    vendorCode!: string;
    startDate!: Date;
    endDate!: Date;
  
    static schema: ObjectSchema = {
      name: "Agreements",
      primaryKey: "_id",
      properties: {
        _id: "objectId",
        email: "string",
        clientName: "string",
        vendorCode: "string",
        startDate: "date",
        endDate: "date",
        wantsCustomReminders: "bool",
        customReminderDates: "date[]",
        reminderDates: "date[]",
        completed: "bool",
        assignedTo: "AssignedTo?",
        assignedBy: "string?",
      },
    };
  }
  
  export class PurchaseOrder extends FormData {
    clientName!: string;
    consultant!: string;
    poNumber!: string;
    poIssueDate!: Date;
    poEndDate!: Date;
    entryDate!: Date;
  
    static schema: ObjectSchema = {
      name: "PurchaseOrder",
      embedded: false,
      properties: {
        ...FormData.schema.properties,
        clientName: "string",
        consultant: "string",
        poNumber: "string",
        poIssueDate: "date",
        poEndDate: "date",
        entryDate: "date",
      },
    };
  }
  

export class VisaDetails extends FormData {
    clientName!: string;
    visaNumber!: string;
    sponsor!: string;
    consultantName!: string;
    visaEndDate!: Date;
    visaEntryDate!: Date;
    visaExpiryDate!: Date;
  
    static schema: ObjectSchema = {
      name: "VisaDetails",
      primaryKey: "_id",
      properties: {
        ...FormData.schema.properties,
        clientName: "string",
        visaNumber: "string",
        sponsor: "string",
        consultantName: "string",
        visaEndDate: "date",
        visaEntryDate: "date",
        visaExpiryDate: "date",
      },
    };
  }
  

  export class IQAMARenewals extends FormData {
    employeeName!: string;
    iqamaNumber!: string;
    expiryDate!: Date;
    startDate!: Date;
    endDate!: Date;
  
    static schema: ObjectSchema = {
      name: "IQAMARenewals",
      primaryKey: "_id",
      properties: {
        ...FormData.schema.properties,
        employeeName: "string",
        iqamaNumber: "string",
        expiryDate: "date",
        startDate: "date",
        endDate: "date",
      },
    };
  }
  

  export class InsuranceRenewals extends FormData {
    employeeName!: string;
    insuranceStartDate!: Date;
    insuranceEndDate!: Date;
    insuranceCompany!: string;
    insuranceCategory!: string;
    employeeInsuranceValue!: string;
    spouseInsuranceValue?: string;
    childrenInsuranceValues!: (string | null)[]; // Elements can be null
    value!: string;
  
    static schema: ObjectSchema = {
      name: "InsuranceRenewals",
      primaryKey: "_id",
      properties: {
        ...FormData.schema.properties,
        employeeName: "string",
        insuranceStartDate: "date",
        insuranceEndDate: "date",
        insuranceCompany: "string",
        insuranceCategory: "string",
        employeeInsuranceValue: "string",
        spouseInsuranceValue: "string?",
        childrenInsuranceValues: "string?[]", // Correctly allows nullable elements
        value: "string",
      },
    };
  }
  
  

  export class HouseRentalRenewal extends FormData {
    houseOwnerName!: string;
    location!: string;
    consultantName!: string;
    startDate!: Date;
    endDate!: Date;
    rentAmount!: string;
  
    static schema: ObjectSchema = {
      name: "HouseRentalRenewal",
      primaryKey: "_id",
      properties: {
        ...FormData.schema.properties,
        houseOwnerName: "string",
        location: "string",
        consultantName: "string",
        startDate: "date",
        endDate: "date",
        rentAmount: "string",
      },
    };
  }
  
