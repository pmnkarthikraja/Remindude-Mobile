import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MasterSwitchData, userApi } from "../api/userApi";
import { User } from "@/utils/user";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AxiosErrorType {
  message: string,
  success: boolean
}


export const useEmailSignupMutation = (validatePassword:boolean) => {
  const queryClient = useQueryClient();

  return useMutation(
    (userDetails: User) => userApi.signup(userDetails),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userDetails');
        if (!validatePassword){
          localStorage.setItem('token',data.data.token)
        }
        setTimeout(() => {
          window.location.href='/home'
        }, 1500);
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on onRegister", e);
      }
    }
  );
};

export const useDeleteUserAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (email:string) => {
      return userApi.deleteUserAccount(email);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userDetails');
        localStorage.removeItem('token')
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on delete user", e);
      }
    }
  );
};


export const useAuthUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
  AxiosResponse<{ message: string, success: boolean, user: User }, AxiosError<AxiosErrorType>>, 
  AxiosError<AxiosErrorType>, 
  string,
  unknown
  >(
    'userDetails', 
    async (token:string)=> {
      return userApi.authToken(token)},
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userDetails');
      },
      onError: (e) => {
        console.log("Error during authentication", e);
      }
    }
  );
};

interface OTPPayload {
  email: string,
  accountVerification: boolean,
  type:'forgotPassword'|'verification',
  userName:string | undefined
}

export const useSendOTPMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: OTPPayload) => userApi.sendOTP(payload.email, payload.accountVerification,payload.type,payload.userName),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userclient');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on sending otp: ", e)
      }
    }
  )
}

interface VerifyOTPPayload{
  email:string,
  otp:string
}

export const useVerifyOTPMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: VerifyOTPPayload) => userApi.verifyOTP(payload.email, payload.otp),
    {
      onSuccess: (data) => {
        console.log("on verified data: ",data.data)
        queryClient.invalidateQueries('userclient');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on verifying otp: ", e)
      }
    }
  )
}

interface ValidatePasswordPayload{
  email:string,
  password:string,
}

export const useValidatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: ValidatePasswordPayload) => userApi.validatePassword(payload.email, payload.password),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userclient');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on validating password: ", e)
      }
    }
  )
}

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: ValidatePasswordPayload) => userApi.resetPassword(payload.email, payload.password),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userclient');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on reseting password: ", e)
      }
    }
  )
}

interface GoogleUser {
  email: string,
  familyName: string,
  givenName: string,
  id: string,
  imageUrl: string,
  serverAuthCode: string,
  name: string
  authentication: {
    accessToken: string,
    idToken: string,
    refreshToken: string
  }
}

export const useEmailSigninMutation = (validatePassword:boolean) => {
  const queryClient = useQueryClient();

  return useMutation(
    (user: User) => userApi.login(user),
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries('userDetails');
        if (!validatePassword){
          await AsyncStorage.setItem('token',data.data.token)
        }
        setTimeout(() => {
          router.replace('/(tabs)')
        }, 500)
        console.log("on login mutation success: ", data);
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on onLogin", e);
      }
    }
  );
};

interface EditProfilePayload{
  email:string,
  password:string,
  userName:string,
  profilePicture:Blob|string
}

export const useEditProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (user: EditProfilePayload) => userApi.editProfile(user.email,user.password,user.userName,user.profilePicture),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userDetails');
        console.log("on edit profile mutation success: ", data);
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on edit profile", e);
      }
    }
  );
};



export const useGetMasterSwitchData = (email:string,refetchInterval?: number) => {
  return  useQuery({
      queryKey: ['masterSwitchData'],
      queryFn: async () => {
        return await userApi.getMasterSwitchData(email)
      },
      onError:(e:AxiosError<AxiosErrorType>)=>e,
      refetchInterval:false,
    })
}

export const useToggleMasterSwitchData = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data:MasterSwitchData) => userApi.toggleMasterSwitchData(data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('masterSwitchData');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on toggle master switch", e);
      }
    }
  );
};

