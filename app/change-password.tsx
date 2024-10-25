import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router, useNavigation } from 'expo-router';
import { useEmailSigninMutation, useResetPassword } from '@/hooks/userHooks';
import { useUser } from '@/components/userContext';
import useOnNavigationFocus from '@/hooks/useNavigationFocus';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePassword = () => {
  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<ChangePasswordForm>();
  const [isVerified, setIsVerified] = useState(false);
  const {user} = useUser()
  const { mutateAsync: login, isLoading: isLoginLoading } = useEmailSigninMutation(false); // Login mutation
  const { mutateAsync: resetPassword, isLoading: isResetLoading } = useResetPassword();
  const [newPasswordFieldsEnabled, setNewPasswordFieldsEnabled] = useState(false);
  const watchNewPassword = watch('newPassword', '');

  const loading = isLoginLoading || isResetLoading
// const navigation = useNavigation()
//   useEffect(()=>{
//     reset()
//   },[navigation])

  useOnNavigationFocus(reset)
  
  const handleVerifyCurrentPassword = async (data: ChangePasswordForm) => {
    try {
        if (user){
            await login({email:user.email, password: data.currentPassword,userName:'' }); 
            setNewPasswordFieldsEnabled(true); 
            setIsVerified(true);
        }
    } catch (error) {
      Alert.alert('Error', 'Current password is incorrect.');
    }
  };

  const handlePasswordReset = async (data: ChangePasswordForm) => {
    if (data.newPassword !== data.confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
        if (user){
            await resetPassword({ email:user.email, password: data.newPassword }); 
            Alert.alert('Success', 'Password reset successfully!');
            router.push('/login');
        }
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
        {loading && <ActivityIndicator  size={'large'}/>}
      {!isVerified && (
        <>
          <Controller
            control={control}
            name="currentPassword"
            rules={{ required: 'Current password is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor="#777"
              />
            )}
          />
          {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword.message}</Text>}

          <TouchableOpacity 
            style={[styles.button, isLoginLoading && styles.disabledButton]} 
            onPress={handleSubmit(handleVerifyCurrentPassword)}
            disabled={isLoginLoading}
          >
            <Text style={styles.buttonText}>Verify Current Password</Text>
          </TouchableOpacity>
        </>
      )}

      {newPasswordFieldsEnabled && (
        <>
          <Controller
            control={control}
            name="newPassword"
            rules={{ required: 'New password is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor="#777"
              />
            )}
          />
          {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}

          <Controller
            control={control}
            name="confirmNewPassword"
            rules={{ required: 'Please confirm your new password' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor="#777"
              />
            )}
          />
          {errors.confirmNewPassword && <Text style={styles.errorText}>{errors.confirmNewPassword.message}</Text>}
          {watchNewPassword && (
            <TouchableOpacity 
              style={[styles.button, isResetLoading && styles.disabledButton]} 
              onPress={handleSubmit(handlePasswordReset)}
              disabled={isResetLoading}
            >
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
