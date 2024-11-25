import { useUser } from "@/components/userContext";
import { FormData, parseDateForSingleItem } from "@/utils/category";
import axios, { AxiosError } from "axios";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {} from '@realm/react'

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
        queryClient.invalidateQueries('formdata');
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

  const { data, error, isLoading ,refetch,isError} = useQuery({
    queryKey: ['formdata', email],
    queryFn: async () => {
      // const res = await axios.get(`https://remindude.vercel.app/formdata/${email}`, {
      //   params: { email },
      // });
      // return res.data as FormData[];
    },
    enabled: !!email,
    refetchOnWindowFocus: false, 
    staleTime: 5 * 60 * 1000, 
  });

  // const parsedData = useMemo(() => {
  //   if (!data) return [];
  //   return parseDates(data);
  // },[data]);

  return {
    data: [],
    error,
    isLoading,
    refetch,
    isError
  };
};

export const useGetFormDataById = (id:string) => {
  const { data, error, isLoading ,refetch,isError} = useQuery<FormData, AxiosError<any>>({
    queryKey: ['formdata', id],
    queryFn: async () => {
      const res = await axios.get(`https://remindude.vercel.app/formdata/id/${id}`, {
        params: { id },
      });
      return res.data as FormData
    },
    enabled: !!id,
    refetchOnWindowFocus: false, 
    staleTime: 5 * 60 * 1000, 
  });

  const parsedData = useMemo(() => {
    if (!data) return undefined;
    return parseDateForSingleItem(data);
  },[data]);

  return {
    data:parsedData,
    error,
    isLoading,
    refetch,
    isError
  };
};