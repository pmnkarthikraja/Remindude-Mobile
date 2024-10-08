import { useUser } from "@/components/userContext";
import { FormData, parseResponse } from "@/utils/category";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";


export const useFormData = () => {
  const [formData, setFormData] = useState<FormData[]>([]); 
  const [formError, setFormError] = useState(''); 
  const [formLoading, setFormLoading] = useState(false); 
  const isFocused = useIsFocused();

  const { user, loading: userLoading } = useUser(); 
  const combinedLoading = formLoading || userLoading;
    const combinedError =  formError;

  useEffect(() => {
    const loadFormData = async () => {
      if (!user) return; 

      setFormLoading(true); 
      try {
        console.log("user",user.email)
        const result = await axios.get(
          `https://remindude.vercel.app/formdata/${user?.email || 'pmnkarthikraja@gmail.com'}`,
          {
            params: {
              email: user?.email || 'pmnkarthikraja@gmail.com',
            },
          }
        );
        
        const transformed = parseResponse(result.data);
        setFormData(transformed);
        setFormLoading(false)
      } catch (err:any) {
        setFormError(err.message || 'Error loading form data');
        console.error('Error loading form data:', err);
      } finally {
        setFormLoading(false); 
      }
    };

    if (isFocused && !userLoading) {
      loadFormData();
    }

    loadFormData();


  }, [ userLoading, user]);

  return {
    formData,
    loading: combinedLoading, 
    error: combinedError,   
  };
};

export default useFormData;
