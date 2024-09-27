import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button, Input, XStack, YStack, Text } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { ArrowLeft, Mail, Pencil, User } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useProfileContext } from '@/hooks/useProfile';

export default function ProfileUpdateScreen() {
    const {profile,setProfile,userName,setUserName,email,setEmail}=useProfileContext()

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            // setImage(result.assets[0].uri);
            setProfile(result.assets[0].uri)
            console.log(result.assets[0].fileSize)
        }
    };
    const colorscheme = useColorScheme()

    return (
        <LinearGradient
            colors={[colorscheme == 'light' ? '#a1c4fd' : '#252C39', colorscheme == 'light' ? 'white' : 'transparent']}
            style={{ flex: 1, paddingTop: 50 }}
        >
            <YStack f={1} p="$4" space>
            <XStack style={{alignItems:'center'}}  onPress={()=>router.navigate('/(tabs)/settings')}>
          <ArrowLeft color={colorscheme=='light'?'black' :'white'} size={25}/>
            <ThemedText>Profile</ThemedText>
        </XStack>
                <XStack ai="center" jc="center" mt="$6" onPress={pickImage}>
                    <Avatar circular size="$10">
                       <Avatar.Image src={profile}/>
                        <Avatar.Fallback bg="$gray4" />
                    </Avatar>
                    <Pencil style={{ position: 'absolute', top: '50%', right: '35%', }} color={'white'} fill={'transparent'} size={35} />
                </XStack>

            
                <XStack>
                    <User color={colorscheme=='light'?'black': 'white'} />
                    <ThemedText>Username</ThemedText>
                </XStack>

                <Input
                    placeholder="UserName"
                    maxLength={40}
                    value={userName}
                    onChangeText={setUserName}
                >
                </Input>

                <XStack>
                    <Mail color={colorscheme=='light'?'black': 'white'} />
                    <ThemedText> Email</ThemedText>
                </XStack>
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                >
                </Input>

                <Button backgroundColor={Colors.light.tint} mt="$6" size="$5" onPress={() => router.navigate('/')}>
                    Save
                </Button>

            </YStack>
        </LinearGradient>
    );
}
