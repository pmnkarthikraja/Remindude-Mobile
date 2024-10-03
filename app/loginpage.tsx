import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Asset } from 'expo-asset';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useForm,Controller} from 'react-hook-form'
import { User } from '@/utils/user';

export interface LoginProps{
  onlogin:()=>void
}

const Login:FunctionComponent<LoginProps>=({
  onlogin
})=> {
  const { register, handleSubmit, watch, clearErrors, setValue, formState: { errors },control } = useForm<User>();

  const image = Asset.fromModule(require('../assets/images/login-image.png')).uri;  //on mobile, raw path is not working. thats why we're giving this.ßß
  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Functionality to be implemented.");
  };

  const handleLogin = () => {
    const setToken = async () =>{
      await AsyncStorage.setItem('token','authenticatedtoken')
    }
    setToken()
    if(typeof onlogin=='function'){
      onlogin()
    }
    router.navigate('/')
  };

  const handleSignUp = () => {
    router.push('/signup')
  };

  console.log("watch data:",watch())

  return (
    <ImageBackground source={{uri:image}} style={styles.backgroundImage}>
    <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
      <View style={styles.container}>
      <Image source={{uri:image}} style={styles.image} onError={e=>console.log(e.nativeEvent.error)}/>
        <Text style={styles.title}>Login</Text>

        <Controller
        control={control}
        name="email"
        rules={{ required: 'Email is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
             placeholderTextColor="#777777"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
             placeholderTextColor="#777777"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
        
        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Button title="Submit"  color={'blue'} onPress={handleSubmit(onlogin)} />

        <View style={styles.signInOptionsContainer}>
          <Text style={styles.note}>Or sign in using</Text>
          <TouchableOpacity style={styles.googleButton}>
            <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/281/281764.png'}} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Create your account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  </ImageBackground>
  );
}

export default Login


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  image:{
    width:150,
    height:125,
    transform:'rotate(14deg)',
    resizeMode:'contain'
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#777777',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: 'Roboto',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#007BFF',
    fontFamily: 'Roboto',
  },
  button: {
    backgroundColor: '#007BFF',
    width: '100%',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  signInOptionsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  note: {
    color: '#777777',
    fontFamily: 'Roboto',
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    width: 200,
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    color: '#777777',
    fontFamily: 'Roboto',
    marginVertical:10
  },
  signUpLink: {
    color: '#007BFF',
  },
});