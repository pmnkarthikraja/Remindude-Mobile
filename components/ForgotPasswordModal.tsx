import { useResetPassword, useSendOTPMutation, useVerifyOTPMutation } from '@/hooks/userHooks';
import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    Alert,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import LoadingWidget from './LoadingWidget';

export interface ForgotPasswordModalProps {
    triggerModal: () => void,
    modalVisible: boolean
}

const ForgotPasswordModal: FunctionComponent<ForgotPasswordModalProps> = ({
    modalVisible,
    triggerModal
}) => {
    const [step, setStep] = useState(1); // Track step: 1 = enter email, 2 = enter OTP, 3 = reset password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const {   isLoading: isResetPasswordLoading,  mutateAsync: resetPassword } = useResetPassword()
    const { isLoading: isSendOtpLoading,  error: sendOtpError, mutateAsync: sendOtpMutation } = useSendOTPMutation()
    const {  isLoading: isVerifyOtpLoading, mutateAsync: verifyOtpMutation } = useVerifyOTPMutation()

    const loading = isResetPasswordLoading || isSendOtpLoading || isVerifyOtpLoading


    useEffect(()=>{
        setEmail('')
        setOtp('')
        setNewPassword('')
    },[triggerModal])

    const sendOTP = async () => {
        if (email) {
            try {
                await sendOtpMutation({
                    email,
                    accountVerification: false,
                    userName: '',
                    type: 'forgotPassword'
                });
                Alert.alert('OTP sent', `OTP sent to ${email}`);
                setStep(2); // Proceed to OTP step
            } catch (error) {
                console.log("error on send otp",error)
            }
        } else {
            Alert.alert('Error', 'Please enter a valid email address');
        }
    };

    // Verify OTP Request
    const verifyOTP = async () => {
        if (otp) {
            try {
                await verifyOtpMutation({
                    email,
                    otp
                });
                Alert.alert('Success', 'OTP verified. Please reset your password.');
                setStep(3); 
            } catch (error) {
                Alert.alert('Error', 'Incorrect OTP');
            }
        } else {
            Alert.alert('Error', 'Please enter the OTP');
        }
    };

    const doResetPassword = async () => {
        if (newPassword) {
            try {
                await resetPassword({
                    email,
                    password: newPassword
                });
                Alert.alert('Success', 'Password has been reset successfully');
                triggerModal()
            } catch (error) {
                Alert.alert('Error', 'Failed to reset password');
            }
        } else {
            Alert.alert('Error', 'Please enter a new password');
        }
    };

    return (
            <Modal
            visible={modalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={triggerModal}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                activeOpacity={0.7}
                                onPress={() => { triggerModal(); setStep(1); }}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>

                            {loading ? (
                                <LoadingWidget/>
                            ) : (
                                <>
                                    {step === 1 && (
                                        <View style={[styles.animatedView]}>
                                            <Text style={styles.title}>Forgot Password</Text>
                                            {<Text style={styles.errorText}>{sendOtpError?.response?.data.message || sendOtpError?.message }</Text>}

                                            <TextInput
                                                placeholder="Enter your email"
                                                value={email}
                                                onChangeText={setEmail}
                                                style={styles.input}
                                                placeholderTextColor="#aaa"
                                            />
                                            <TouchableOpacity style={styles.button} onPress={sendOTP}>
                                                <Text style={styles.buttonText}>Send OTP</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {step === 2 && (
                                        <View style={[styles.animatedView ]}>
                                            <Text style={styles.title}>Enter OTP</Text>
                                            <TextInput
                                                placeholder="Enter OTP"
                                                value={otp}
                                                onChangeText={setOtp}
                                                style={styles.input}
                                                placeholderTextColor="#aaa"
                                            />
                                            <TouchableOpacity style={styles.button} onPress={verifyOTP}>
                                                <Text style={styles.buttonText}>Verify OTP</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {step === 3 && (
                                        <View style={[styles.animatedView]}>
                                            <Text style={styles.title}>Reset Password</Text>
                                            <TextInput
                                                placeholder="Enter new password"
                                                secureTextEntry
                                                value={newPassword}
                                                onChangeText={setNewPassword}
                                                style={styles.input}
                                                placeholderTextColor="#aaa"
                                            />
                                            <TouchableOpacity style={styles.button} onPress={doResetPassword}>
                                                <Text style={styles.buttonText}>Reset Password</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalView: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    title: {
        fontSize: 22,
        marginBottom: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: '#333',
    },
    button: {
        width: '100%',
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    animatedView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center', 
    },
    errorText:{
        color:'red',
        marginVertical:10
    }
});

export default ForgotPasswordModal;
