import { useUser } from '@/components/userContext';
import { Colors } from '@/constants/Colors';
import { useProfileContext } from '@/hooks/useProfile';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableHighlight, useColorScheme } from 'react-native';
import { Avatar, Button, ListItem, Separator, SizeTokens, Stack as StackTamagui, Switch, Text, XStack, YStack } from 'tamagui';

export default function SettingsScreen() {
  const colorscheme = useColorScheme()
  const {loading,user,logout} =useUser()
  console.log("user: ",user?.googleId)
  const {profile} = useProfileContext()
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

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
              <Avatar.Image src={user?.profilePicture || profile} />
              <Avatar.Fallback bg="$gray4" />
            </Avatar>
            <YStack ml="$3">
              <Text color={colorscheme=='light'?'black':'white'}  fontWeight="bold">{user?.userName}</Text>
              <Text  color="$gray9">{user?.email}</Text>
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
      </XStack>

        <YStack space >       
          <ListItem  disabled={user?.googleId!==undefined} onPress={()=>{
            router.navigate('/change-password')
          }} borderRadius={10} backgroundColor={'$accentBackground'} 
          title="Change Password"
          />
          <ListItem borderRadius={10} backgroundColor={'$accentBackground'} title="Privacy" />
          <ListItem borderRadius={10} backgroundColor={'$accentBackground'} title="Language" />
        </YStack>

        <TouchableHighlight style={styles.gotologin} onPress={logout}>
        <Text>Logout</Text>
       </TouchableHighlight>

      </StackTamagui>
    </YStack>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gotologin: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 5,
    padding: 5,
    width: 100,
    justifyContent: 'center',
    alignSelf:'center'
  },
})



export function SwitchWithLabel(props: { size: SizeTokens; defaultChecked?: boolean }) {
  const id = `switch-${props.size.toString().slice(1)}-${props.defaultChecked ?? ''}}`
  return (
    <XStack width={'70%'} alignItems="center" gap="$4">
      <ListItem borderRadius={10} backgroundColor={'$accentBackground'} title="Notifications" />
      <Separator minHeight={20} vertical />
      <Switch id={id} size={props.size} defaultChecked={props.defaultChecked} backgroundColor={'$accentBackground'}>
        <Switch.Thumb animation='bouncy'  backgroundColor={Colors.light.tint}/>
      </Switch>
    </XStack>
  )
}