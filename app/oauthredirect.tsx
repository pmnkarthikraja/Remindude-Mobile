import LoadingWidget from '@/components/LoadingWidget';
import React from 'react';
import { View } from 'react-native';

export default function OAuthRedirectScreen() {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LoadingWidget/>
    </View>
  );
}
