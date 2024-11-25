import { PropsWithChildren } from "react";
import { RealmProvider } from '@realm/react'
import { Agreements, AssignedTo, FormData, HouseRentalRenewal, IQAMARenewals, InsuranceRenewals, PurchaseOrder, VisaDetails } from "@/models/Category";
import React from "react";



export default function RealmCustomProvider({ children }: PropsWithChildren) {
  return <RealmProvider 
  deleteRealmIfMigrationNeeded={true} 
  schemaVersion={2} 
  schema={[Agreements, AssignedTo, FormData, HouseRentalRenewal, IQAMARenewals, InsuranceRenewals, PurchaseOrder, VisaDetails]}
  >
    {children}
  </RealmProvider>
}