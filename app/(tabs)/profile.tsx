import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button, Input, XStack, YStack, Text } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { ArrowLeft, Mail, Pencil, User as UserIcon } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useProfileContext } from '@/hooks/useProfile';
import { useEditProfileMutation } from '@/hooks/userHooks';
import { useUser } from '@/components/userContext';
import Toast from 'react-native-toast-message';

export default function ProfileUpdateScreen() {
    const { profile: defaultProfilePic } = useProfileContext()
    const { user, loading } = useUser()
    const [profile, setProfile] = useState<string>(defaultProfilePic)
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const { isLoading, isError, error:profileupdateErr, mutateAsync: doEditProfile } = useEditProfileMutation()
    const colorscheme = useColorScheme()

    useEffect(() => {
        if (user) {
            setUserName(user.userName);
            setEmail(user.email);
            setProfile(user.profilePicture || defaultProfilePic);
        }
    }, [user]);

    if (loading) {
        return <ActivityIndicator size={'large'} />
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const base64String = result.assets[0].base64 || ''
            const sizeInBytes = (base64String.length * 3) / 4;

            // Check if the size exceeds 2 MB (2 * 1024 * 1024 bytes)
            if (sizeInBytes > 2 * 1024 * 1024) {
                Toast.show({
                    text1: 'Image too large',
                    text2: 'Please select an image smaller than 2 MB.',
                    type: 'error',
                    position: 'top',
                    visibilityTime: 3000,
                    text1Style: {
                        zIndex: 1000,
                    },
                    text2Style: {
                        zIndex: 1200
                    }
                });
                return;
            }
            const data = `data:image/*;base64,${result.assets[0].base64}`
            setProfile(data)
        }
    };

    const onSave = async () => {
        if (user != null) {
            await doEditProfile({
                email: user.email,
                password: user.password || '',
                profilePicture: profile,
                userName: userName
            })
            router.navigate('/')
        }
    }

    return (
        <LinearGradient
            colors={[colorscheme == 'light' ? '#a1c4fd' : '#252C39', colorscheme == 'light' ? 'white' : 'transparent']}
            style={{ flex: 1, paddingTop: 50 }}
        >
            <YStack f={1} p="$4" space>
                <XStack style={{ alignItems: 'center' }} onPress={() => router.navigate('/(tabs)/settings')}>
                    <ArrowLeft color={colorscheme == 'light' ? 'black' : 'white'} size={25} />
                    <ThemedText>Profile</ThemedText>
                </XStack>
                <Toast position='top' type='error' />

                {isLoading && <ActivityIndicator size={'large'} />}
                <Text style={{color:'red'}}>{profileupdateErr?.response?.data.message || profileupdateErr?.message}</Text>
                <XStack ai="center" jc="center" mt="$6" onPress={pickImage}>
                    <Avatar circular size="$10">
                        <Avatar.Image src={profile} />
                        <Avatar.Fallback bg="$gray4" />
                    </Avatar>
                    <Pencil style={{ position: 'absolute', top: '50%', right: '35%', }} color={'white'} fill={'transparent'} size={35} />
                </XStack>


                <XStack>
                    <UserIcon color={colorscheme == 'light' ? 'black' : 'white'} />
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
                    <Mail color={colorscheme == 'light' ? 'black' : 'white'} />
                    <ThemedText> Email</ThemedText>
                </XStack>
                <Input
                    placeholder="Email"
                    value={user?.email}
                    onChangeText={setEmail}
                    disabled
                    disabledStyle={{
                        backgroundColor: '$background025'
                    }}
                >
                </Input>

                <Button backgroundColor={Colors.light.tint} mt="$6" size="$5"
                    onPress={onSave}>
                    Save
                </Button>

            </YStack>
        </LinearGradient>
    );
}
