import { useUser } from "@/components/userContext";
import { FormData, parseDateForSingleItem, parseDates } from "@/utils/category";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

interface AxiosErrorType {
  message: string,
  success: boolean
}

// const API_URL = 'http://localhost:4000'
const API_URL = 'https://remindude.vercel.app'

type BulkOperationPayload = {
  formData:FormData[]
  email:string
}

export const useBulkOperationFormData = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: BulkOperationPayload) => axios.post(`${API_URL}/formdata-bulkoperation`,{
      formDataArray:payload.formData,
      email:payload.email
    }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('formdata');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on bulk operation of formdata", e);
      }
    }
  );
};

export const useCreateFormDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (formData: FormData) => axios.post(`${API_URL}/formdata`,{
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
    (formData: FormData) => axios.put(`${API_URL}/formdata/${formData.id}`,{
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
    (id:string) => axios.delete(`${API_URL}/formdata/${id}`),
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
      const res = await axios.get(`${API_URL}/formdata/${email}`, {
        params: { email },
      });
      return res.data as FormData[];
    },
    enabled: !!email,
    refetchOnWindowFocus: false, 
    staleTime: 5 * 60 * 1000, 
  });

  const parsedData = useMemo(() => {
    if (!data) return [];
    return parseDates(data);
  },[data]);

  return {
    data: parsedData,
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
      const res = await axios.get(`${API_URL}/formdata/id/${id}`, {
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