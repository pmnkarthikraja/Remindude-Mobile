import { useResetPassword, useSendOTPMutation, useVerifyOTPMutation } from '@/hooks/userHooks';
import React, { useState, useEffect, FunctionComponent } from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

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
    const [loading, setLoading] = useState(false);
    const { data: resetPasswordData, isSuccess: isPasswordResetSuccess, isLoading: isResetPasswordLoading, isError: isResetPasswordError, error: resetPasswordError, mutateAsync: resetPassword, reset: resetResetPassword } = useResetPassword()
    const { isLoading: isSendOtpLoading, isError: isSendOtpError, error: sendOtpError, mutateAsync: sendOtpMutation } = useSendOTPMutation()
    const { data: verifyOtpData, isLoading: isVerifyOtpLoading, isError: isVerifyOtpError, error: verifyOtpError, mutateAsync: verifyOtpMutation } = useVerifyOTPMutation()

    // Shared value to handle animation progress
    const animationProgress = useSharedValue(0);

    useEffect(() => {
        animationProgress.value = withTiming(step, { duration: 500 });
    }, [step]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(animationProgress.value > 0 ? 1 : 0, { duration: 500 }),
            transform: [{ translateY: withTiming(animationProgress.value * 100 - 100, { duration: 500 }) }],
        };
    });

    const sendOTP = async () => {
        if (email) {
            setLoading(true);
            try {
                await sendOtpMutation({
                    email,
                    accountVerification: false,
                    userName: '',
                    type: 'forgotPassword'
                });
                setLoading(false);
                Alert.alert('OTP sent', `OTP sent to ${email}`);
                setStep(2); // Proceed to OTP step
            } catch (error) {
                setLoading(false);
                Alert.alert('Error', 'Failed to send OTP');
            }
        } else {
            Alert.alert('Error', 'Please enter a valid email address');
        }
    };

    // Verify OTP Request
    const verifyOTP = async () => {
        if (otp) {
            setLoading(true);
            try {
                await verifyOtpMutation({
                    email,
                    otp
                });
                setLoading(false);
                Alert.alert('Success', 'OTP verified. Please reset your password.');
                setStep(3); // Proceed to password reset step
            } catch (error) {
                setLoading(false);
                Alert.alert('Error', 'Incorrect OTP');
            }
        } else {
            Alert.alert('Error', 'Please enter the OTP');
        }
    };

    const doResetPassword = async () => {
        if (newPassword) {
            setLoading(true);
            try {
                await resetPassword({
                    email,
                    password: newPassword
                });
                setLoading(false);
                Alert.alert('Success', 'Password has been reset successfully');
                triggerModal()
            } catch (error) {
                setLoading(false);
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
                onRequestClose={() => triggerModal()}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={triggerModal}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    {loading ? (
                        <ActivityIndicator size="large" color="#007BFF" />
                    ) : (
                        <>
                            {step === 1 && (
                                <Animated.View style={[styles.animatedView, animatedStyle]}>
                                    <Text style={styles.title}>Forgot Password</Text>
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
                                </Animated.View>
                            )}

                            {step === 2 && (
                                <Animated.View style={[styles.animatedView, animatedStyle]}>
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
                                </Animated.View>
                            )}

                            {step === 3 && (
                                <Animated.View style={[styles.animatedView, animatedStyle]}>
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
                                </Animated.View>
                            )}
                        </>
                    )}
                </View>
            </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    animatedView: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        color: '#000',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'transparent',
        padding: 10,
    },
    closeButtonText: {
        color: 'blue',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotButton: {
        padding: 10,
        alignItems: 'center',
    },
    forgotText: {
        color: '#007BFF',
        fontSize: 16,
    },
});

export default ForgotPasswordModal;
