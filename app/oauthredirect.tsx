import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function OAuthRedirectScreen() {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
