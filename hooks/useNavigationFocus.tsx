import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const useOnNavigationFocus = (callback:()=>void) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (typeof callback === 'function') {
        callback();
      }
    });

    return unsubscribe;
  }, [navigation, callback]);
};

export default useOnNavigationFocus;
