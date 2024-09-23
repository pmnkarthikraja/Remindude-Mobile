// import {
//     Image,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
//   } from "react-native";
//   import React, { useState } from "react";
//   import { useNavigation } from "@react-navigation/native";
// import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
// import { Colors } from "@/constants/Colors";
// import { router } from "expo-router";
  
//   const SignupScreen = () => {
//     const navigation = useNavigation();
//     const [secureEntery, setSecureEntery] = useState(true);
  
//     const handleGoBack = () => {
//       navigation.goBack();
//     };
  
//     const handleLogin = () => {
//         router.push('/login')
//     };
  
//     return (
//       <View style={styles.container}>
//         <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
//           <Ionicons
//             name={"arrow-back-outline"}
//             color={Colors.light.tint}
//             size={25}
//           />
//         </TouchableOpacity>
//         <View style={styles.textContainer}>
//           <Text style={styles.headingText}>Let's get</Text>
//           <Text style={styles.headingText}>started</Text>
//         </View>
//         {/* form  */}
//         <View style={styles.formContainer}>
//           <View style={styles.inputContainer}>
//             <Ionicons name={"mail-outline"} size={30} color={Colors.light.tint} />
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter your email"
//               placeholderTextColor={Colors.light.tint}
//               keyboardType="email-address"
//             />
//           </View>
//           <View style={styles.inputContainer}>
//             <SimpleLineIcons name={"lock"} size={30} color={Colors.light.tint} />
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter your password"
//               placeholderTextColor={Colors.light.tint}
//               secureTextEntry={secureEntery}
//             />
//             <TouchableOpacity
//               onPress={() => {
//                 setSecureEntery((prev) => !prev);
//               }}
//             >
//               <SimpleLineIcons name={"eye"} size={20} color={Colors.light.tint} />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.inputContainer}>
//             <SimpleLineIcons
//               name={"screen-smartphone"}
//               size={30}
//               color={Colors.light.tint}
//             />
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter your phone no"
//               placeholderTextColor={Colors.light.tint}
//               secureTextEntry={secureEntery}
//               keyboardType="phone-pad"
//             />
//           </View>
  
//           <TouchableOpacity style={styles.loginButtonWrapper}>
//             <Text style={styles.loginText}>Sign up</Text>
//           </TouchableOpacity>
//           <Text style={styles.continueText}>or continue with</Text>
//           <TouchableOpacity style={styles.googleButtonContainer}>
//             <Image
//             source={{uri:'https://cdn-icons-png.flaticon.com/128/281/281764.png'}} 
//               style={styles.googleImage}
//             />
//             <Text style={styles.googleText}>Google</Text>
//           </TouchableOpacity>
//           <View style={styles.footerContainer}>
//             <Text >Already have an account!</Text>
//             <TouchableOpacity onPress={handleLogin}>
//               <Text >Login</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   };
  
//   export default SignupScreen;
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: Colors.light.background,
//       padding: 20,
//     },
//     backButtonWrapper: {
//       height: 40,
//       width: 40,
//       backgroundColor: 'gray',
//       borderRadius: 20,
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     textContainer: {
//       marginVertical: 20,
//     },
//     headingText: {
//       fontSize: 32,
//     },
//     formContainer: {
//       marginTop: 20,
//     },
//     inputContainer: {
//       borderWidth: 1,
//       borderColor: Colors.light.tint,
//       borderRadius: 100,
//       paddingHorizontal: 20,
//       flexDirection: "row",
//       alignItems: "center",
//       padding: 2,
//       marginVertical: 10,
//     },
//     textInput: {
//       flex: 1,
//       paddingHorizontal: 10,
//     },
//     forgotPasswordText: {
//       textAlign: "right",
//       marginVertical: 10,
//     },
//     loginButtonWrapper: {
//       borderRadius: 100,
//       marginTop: 20,
//     },
//     loginText: {
//       fontSize: 20,
//       textAlign: "center",
//       padding: 10,
//     },
//     continueText: {
//       textAlign: "center",
//       marginVertical: 20,
//       fontSize: 14,
//     },
//     googleButtonContainer: {
//       flexDirection: "row",
//       borderWidth: 2,
//       borderRadius: 100,
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 10,
//       gap: 10,
//     },
//     googleImage: {
//       height: 20,
//       width: 20,
//     },
//     googleText: {
//       fontSize: 20,
//     },
//     footerContainer: {
//       flexDirection: "row",
//       justifyContent: "center",
//       alignItems: "center",
//       marginVertical: 20,
//       gap: 5,
//     },
//   });

import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Asset } from 'expo-asset';
import { router } from 'expo-router';
import { User } from '@/utils/user';

const Signup=()=> {

const image = Asset.fromModule(require('../assets/images/login-image.png')).uri;
  const handleSignout = () => {
    Alert.alert("User Registered Successfully!")
    console.log("handle sign out")
  }

  const navigateToLogin = () => {
    router.push('/login')

  };

  return (
    <ImageBackground source={{uri:image}} style={styles.backgroundImage}>
    <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
      <View style={styles.container}>
      <Image source={{uri:image}} style={styles.image} onError={e=>console.log(e.nativeEvent.error)}/>
        <Text style={styles.title}>Register your account</Text>
        <TextInput placeholder="Username" placeholderTextColor="#777777" style={styles.input} />
        <TextInput placeholder="Email" placeholderTextColor="#777777" style={styles.input} />
        <TextInput placeholder="Password" placeholderTextColor="#777777" secureTextEntry style={styles.input} />
        
        <TouchableOpacity onPress={handleSignout} style={styles.button}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <View style={styles.signInOptionsContainer}>
          <Text style={styles.note}>Or sign up using</Text>
          <TouchableOpacity style={styles.googleButton}>
            <Image source={{uri:'https://cdn-icons-png.flaticon.com/128/281/281764.png'}} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Already have an account?</Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.signUpLink}>Go to login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  </ImageBackground>
  );
}

export default Signup

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