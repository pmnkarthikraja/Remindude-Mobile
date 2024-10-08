import axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MasterSwitchData, userApi } from "../api/userApi";
import { User } from "@/utils/user";
import { router, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { FormData } from "@/utils/category";
import { useUser } from "@/components/userContext";

interface AxiosErrorType {
  message: string,
  success: boolean
}


export const useCreateFormDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (formData: FormData) => axios.post('https://remindude.vercel.app/formdata',{
        ...formData
      }),
    {
      onSuccess: (data) => {
        console.log("successfully added:",data)
        queryClient.invalidateQueries('formdata');
        // if (!validatePassword){
        //   localStorage.setItem('token',data.data.token)
        // }
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on adding formdata", e);
      }
    }
  );
};

export const useUpdateFormDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (formData: FormData) => axios.put(`https://remindude.vercel.app/formdata/${formData.id}`,{
      ...formData
    }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('formdata');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on updating formdata", e);
      }
    }
  );
};

export const useDeleteFormDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id:string) => axios.delete(`https://remindude.vercel.app/formdata/${id}`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('formdata');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on deleting formdata", e);
      }
    }
  );
};


export const useGetFormData = () => {
  const { user } = useUser();
  const email = user?.email
  console.log("email:",email)

  return useQuery({
    queryKey: ['formdata',email],
    queryFn: async () => {
      const res = await axios.get(
        `https://remindude.vercel.app/formdata/${email}`,
        {
          params: {
            email,  
          },
        }
      );
      console.log("result data",res.data)
      return res.data as FormData[]; 
    },
    onError: (error: AxiosError<any>) => {
      console.error('Error fetching form data:', error);
      return error.response?.data?.message || 'Error fetching form data';
    },
    enabled: !!email,
    refetchOnWindowFocus: false, 
    staleTime: 5 * 60 * 1000, 
  });
};
