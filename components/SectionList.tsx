import Item, { isFormData } from '@/app/(tabs)/category/Item';
import { FormData } from '@/utils/category';
import React, { FunctionComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';


import { useColorScheme } from 'react-native';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export type HeaderTitle = 'Renewal Pending' | 'Next 30 days' | 'Next 30 - 60 days' | 'Next 60 - 90 days' | 'Later 90 days' | 'Assigned To Others' | 'Assigned To You'

const BlinkingItem: FunctionComponent<{ item: FormData }> = React.memo(({ item }) => {
    const colorscheme = useColorScheme()
    const borderColor = useSharedValue(colorscheme == 'light' ? 'white' : 'transparent');
  
    React.useEffect(() => {
      borderColor.value = withRepeat(
        withTiming(colorscheme == 'light' ? '#ff7f50' : 'orange', { duration: 700, easing: Easing.linear, reduceMotion: ReduceMotion.Never }),
        -1,
        true
      );
    }, [borderColor]);
  
    const animatedBorderStyle = useAnimatedStyle(() => {
      return {
        borderColor: borderColor.value,
        borderWidth: 0.9,
        borderRadius: 10
      };
    });
  
    return (
      <Animated.View style={animatedBorderStyle}>
        {item && <Item item={item} key={item.id} />}
      </Animated.View>
    );
  });


const SectionItems: FunctionComponent<{ flattenedData: (FormData|HeaderTitle)[], renewal:FormData[] }> = ({ flattenedData ,renewal}) => {
   
   const makeKey = (item:FormData|HeaderTitle):string => {
    return isFormData(item) ? item.id : item
   }

    return (
     <FlatList showsVerticalScrollIndicator={true}  data={flattenedData} renderItem={item => 
    {
        if (isFormData(item.item) && renewal.includes(item.item)){
            return <BlinkingItem item={item.item} key={makeKey(item.item)} />
        }
        return <Item item={item.item} key={makeKey(item.item)} />
    }
    } 
     />
    // <Text>hii</Text>
    );
};

export default React.memo(SectionItems);

const ITEM_HEIGHT = 50;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sectionHeader: {
        padding: 10,
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemContainer: {
        padding: 10,
        // height: ITEM_HEIGHT,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemTitle: {
        fontSize: 16,
        color: '#555',
    },
});
