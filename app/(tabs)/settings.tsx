import { Colors } from '@/constants/Colors';
import { useProfileContext } from '@/hooks/useProfile';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Avatar, Button, Label, ListItem, Separator, SizeTokens, Stack as StackTamagui, Switch, Text, XStack, YStack } from 'tamagui';


export default function SettingsScreen() {
  const colorscheme = useColorScheme()
  const {profile,userName,email}= useProfileContext()

  return (
    <LinearGradient 
    colors={[ colorscheme =='light' ? '#a1c4fd':'#252C39', colorscheme=='light'?'white':'transparent']}
    style={{ flex: 1,paddingTop:50 }}
    >
    <YStack f={1} p="$4" space>
    <Stack.Screen options={{headerShown:false}}/>
      <StackTamagui space="$4">

        <XStack ai="center" jc="space-between">
          <XStack ai="center">
            <Avatar circular size="$7">
              <Avatar.Image src={profile} />
              <Avatar.Fallback bg="$gray4" />
            </Avatar>
            <YStack ml="$3">
              <Text color={colorscheme=='light'?'black':'white'}  fontWeight="bold">{userName}</Text>
              <Text  color="$gray9">{email}</Text>
            </YStack>
          </XStack>
          <Button
            size="$4"
            onPress={()=>router.navigate('/(tabs)/profile')}
          >
            Edit
          </Button>
        </XStack>

        <Separator my="$4" />

        <XStack gap="$3" $xs={{ flexDirection: 'column' }}>
        <SwitchWithLabel size="$4" />
      </XStack>

        <YStack space >       
          <ListItem borderRadius={10} backgroundColor={'$accentBackground'} title="Change Password" />
          <ListItem borderRadius={10} backgroundColor={'$accentBackground'} title="Privacy" />
          <ListItem borderRadius={10} backgroundColor={'$accentBackground'} title="Language" />
        </YStack>

      </StackTamagui>
    </YStack>
    </LinearGradient>
  );
}



export function SwitchWithLabel(props: { size: SizeTokens; defaultChecked?: boolean }) {
  const id = `switch-${props.size.toString().slice(1)}-${props.defaultChecked ?? ''}}`
  return (
    <XStack width={'70%'} alignItems="center" gap="$4">
      {/* <Label
        paddingRight="$0"
        minWidth={90}
        justifyContent="flex-end"
        size={props.size}
        htmlFor={id}
      >
        Notification
      </Label> */}
      <ListItem borderRadius={10} backgroundColor={'$accentBackground'} title="Notifications" />
      <Separator minHeight={20} vertical />
      <Switch id={id} size={props.size} defaultChecked={props.defaultChecked} backgroundColor={'$accentBackground'}>
        <Switch.Thumb animation='bouncy'  backgroundColor={Colors.light.tint}/>
      </Switch>
    </XStack>
  )
}