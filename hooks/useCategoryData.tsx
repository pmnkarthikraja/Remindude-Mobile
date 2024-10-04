import { FormData } from '@/utils/category';
import { agreementsData, insuranceRenewalData, iqamaRenewals, purchaseOrderData, visaDetailsData } from '@/utils/datasets';
import React, { createContext, FunctionComponent, ReactNode, useContext, useState } from 'react';

interface CategoryDataContext {
  formdata: FormData[];
  setFormData: (formData:FormData[]) => void;
}

const CategoryContext = createContext<CategoryDataContext | undefined>(undefined);


export const CategoryDataProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
const [formdata,setFormData]=useState<FormData[]>([

])

  return (
    <CategoryContext.Provider value={{ formdata, setFormData }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryDataContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategorydata context must be used within a CategoryDataProvider');
  }
  return context;
};
