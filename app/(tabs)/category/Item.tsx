import { ThemedText } from '@/components/ThemedText';
import { useTimeElapseAnimation } from '@/components/TimeAnimationProvider';
import { useDeleteFormDataMutation } from '@/hooks/formDataHooks';
import { FormData, InsuranceRenewals } from '@/utils/category';
import { FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { CalendarClock, CheckCircle, CircleUser, FileText, IndianRupee, Tag, Trash, User, UserCheck2, Workflow } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import moment from 'moment';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Animated, Modal, Platform, StyleSheet, Switch, Text, useColorScheme, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { Button, Card, CardHeader, Paragraph, XStack, YStack } from 'tamagui';

const colors1 = {
  light: {
    primary: '#1E88E5',  // Teal Blue for primary icons 
    secondary: '#FFB300', // Amber for secondary icons 
    accent1: '#43A047',   // Green for Agreements
    accent2: '#F4511E',   // Red/Orange for Purchase Orders
    accent3: '#8E24AA',   // Purple for Visa Details
    accent4: '#039BE5',   // Light Blue for IQAMA Renewals
    accent5: '#C2185B',   // Pink for Insurance Renewals
    text: '#212121',      // Dark text color
    background: '#FAFAFA' // Light background color
  },
  dark: {
    primary: '#64B5F6',   // Lighter Teal Blue for dark mode icons
    secondary: '#FFA726', // Brighter Amber for secondary icons
    accent1: '#66BB6A',   // Softer green for dark mode
    accent2: '#FF7043',   // Softer red/orange for dark mode
    accent3: '#BA68C8',   // Softer purple for Visa Details
    accent4: '#4FC3F7',   // Lighter blue for IQAMA Renewals
    accent5: '#F06292',   // Softer pink for Insurance Renewals
    text: '#EEEEEE',      // Light text color
    background: '#303030' // Dark background color
  }
};

function calculateInsuredPeople(item:InsuranceRenewals){
  let count = 0
  const {employeeInsuranceValue,spouseInsuranceValue,childrenInsuranceValues} = item
  if (employeeInsuranceValue!=='' && employeeInsuranceValue!=='0'){
    count+=1
  }
  if (spouseInsuranceValue!=='' && spouseInsuranceValue!='0'){
    count+=1
  }
  if (childrenInsuranceValues && childrenInsuranceValues.length!==0){
    count+= childrenInsuranceValues.filter(d=>d!='').length
  }
  return count
}



const Item = React.memo(({ item }: { item: FormData }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorscheme = useColorScheme();
  const iconName = useTimeElapseAnimation()
  const { isLoading: deleteFormDataLoading, isError: isDeleteFormdataErr, mutateAsync: deleteFormData } = useDeleteFormDataMutation()
  const [modalState, setModalState] = useState<{ isVisible: boolean, itemId: string | null }>({ isVisible: false, itemId: null });
  const handleDelete = useCallback(async () => {
    try {
      await deleteFormData(item.id)
      closeModal()
      router.navigate('/')
    } catch (e) {
      console.log("error on axios:", e)
    }

    setModalState({ isVisible: false, itemId: null });
  }, [item.id]);

  const openModal = useCallback(() => setModalState({ isVisible: true, itemId: item.id }), [item.id]);
  const closeModal = useCallback(() => setModalState({ isVisible: false, itemId: null }), []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const backgroundColor = colorscheme == 'light'
    ? 'white'
    : 'transparent'

  const colors = {
    primary: '#1E88E5',  // Teal Blue for primary icons 
    secondary: '#1E88E5',
    accent1: '#1E88E5',
    accent2: '#1E88E5',
    accent3: '#1E88E5',
    accent4: '#1E88E5',
    accent5: '#C2185B',
    text: colorscheme == 'light' ? '#212121' : '#EEEEEE',
    background: colorscheme == 'light' ? '#FAFAFA' : "#303030"
  };




  const renderContent = useCallback((icon: 'timer-sand' | 'timer-sand-paused' | 'timer-sand-complete') => {
    switch (item.category) {
      case 'Agreements':
        return (
          <YStack>
            <XStack justifyContent='space-between'>
              <YStack>
                <XStack style={styles.itemText}>
                  <User size={20} color={colors.accent1} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.clientName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <Tag size={20} color={colors.secondary} />
                  <Text style={[styles.text, { color: colors.text }]}>Vendor Code: {item.vendorCode}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={colors.secondary} />
                  <Text style={[styles.text, { color: colors.text }]}>Start Date: {moment(item.startDate).format('DD-MM-YYYY')}</Text>
                </XStack>
              </YStack>
              <YStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={colors.primary} />
                  <Text style={[styles.text, { color: colors.text }]}>{moment(item.endDate).format('DD-MM-YYYY')}</Text>
                </XStack>

                <XStack >
                  <RenderStatus targetDate={item.endDate} isCompleted={item.completed} />
                </XStack>
              </YStack>
            </XStack>
            <XStack alignItems='center' gap={10} marginBottom={10}>
              <Animated.View>
                <MaterialCommunityIcons
                  name={icon} size={13} color={differenceInDays(item.endDate) > 0 ? 'green' : 'red'} />
              </Animated.View>
              <ThemedText>Remaining :
                <Text> {differenceInDays(item.endDate)}</Text> Days Left</ThemedText>
            </XStack>
          </YStack>
        );

      case 'Purchase Order':
        return (
          <YStack>
            <XStack justifyContent='space-between'>
              <YStack>
                <XStack style={styles.itemText}>
                  <User size={20} color={colors.primary} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.clientName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <UserCheck2 size={20} color={colors.accent2} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>Consultant: {item.consultant}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <Tag size={20} color={colors.secondary} />
                  <Text style={[styles.text, { color: colors.text }]}>PO Number: {item.poNumber}</Text>
                </XStack>
              </YStack>
              <YStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={colors.primary} />
                  <Text style={[styles.text, { color: colors.text }]}>{moment(item.poEndDate).format('DD-MM-YYYY')}</Text>
                </XStack>
                <XStack >
                  <RenderStatus targetDate={item.poEndDate} isCompleted={item.completed} />
                </XStack>
              </YStack>
            </XStack>
            <XStack alignItems='center' gap={10} marginBottom={10}>
              <Animated.View>
                <MaterialCommunityIcons
                  name={iconName} size={13} color={differenceInDays(item.poEndDate) > 0 ? 'green' : 'red'} />
              </Animated.View>
              <ThemedText>Remaining :
                <Text> {differenceInDays(item.poEndDate)}</Text> Days</ThemedText>
            </XStack>
          </YStack>
        );

      case 'Visa Details':
        return (
          <YStack>
            <XStack justifyContent='space-between'>
              <YStack>
                <XStack style={styles.itemText}>
                  <User size={20} color={colors.primary} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.clientName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <CheckCircle size={20} color={colors.accent3} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.consultantName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <CircleUser size={20} color={colors.accent3} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.sponsor}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={colors.accent3} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>Visa Exp. Date: {moment(item.visaExpiryDate).format('DD-MM-YYYY')}</Text>
                </XStack>
              </YStack>
              <YStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={colors.primary} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{moment(item.visaEndDate).format('DD-MM-YYYY')}</Text>
                </XStack>
                <XStack >
                  <RenderStatus targetDate={item.visaEndDate} isCompleted={item.completed} />
                </XStack>
              </YStack>
            </XStack>
            <XStack alignItems='center' gap={10} marginBottom={10}>
              <Animated.View>
                <MaterialCommunityIcons
                  name={iconName} size={13} color={differenceInDays(item.visaEndDate) > 0 ? 'green' : 'red'} />
              </Animated.View>
              <ThemedText>Remaining :
                <Text> {differenceInDays(item.visaEndDate)}</Text> Days</ThemedText>
            </XStack>
          </YStack>
        );

      case 'IQAMA Renewals':
        return (
          <YStack>
            <YStack>
              <XStack justifyContent='space-between' alignItems='center'>
                <XStack style={styles.itemText}>
                  <User size={20} color={colors.primary} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.employeeName}</Text>
                </XStack>
                <XStack >
                  <RenderStatus targetDate={item.expiryDate} isCompleted={item.completed} />

                </XStack>
              </XStack>

              <XStack style={styles.itemText}>
                <FileText size={20} color={colors.accent4} />
                <Text style={[styles.text, { color: colors.text }]}>{item.iqamaNumber}</Text>
              </XStack>
              <XStack style={styles.itemText}>
                <CalendarClock size={20} color={colors.primary} />
                <Text style={[styles.text, { color: colors.text }]}>Exp. Date: {moment(item.expiryDate).format('DD-MM-YYYY')}</Text>
              </XStack>
            </YStack>

            <XStack alignItems='center' gap={10} marginBottom={10}>
              <Animated.View>
                <MaterialCommunityIcons
                  name={iconName} size={13} color={differenceInDays(item.expiryDate) > 0 ? 'green' : 'red'} />
              </Animated.View>
              <ThemedText>Remaining :
                <Text> {differenceInDays(item.expiryDate)}</Text> Days</ThemedText>
            </XStack>
          </YStack>
        );

      case 'Insurance Renewals':
        return (
          <YStack>
            <XStack alignItems='center' justifyContent='space-between'>
              <YStack>
                <XStack justifyContent='space-between' alignItems='center'>
                  <XStack style={styles.itemText}>
                    <User size={20} color={colors.primary} />
                    <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.employeeName}</Text>
                  </XStack>
                </XStack>

                <XStack style={styles.itemText}>
                  <FileText size={20} color={colors.accent5} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.insuranceCompany}</Text>
                </XStack>

                <XStack style={styles.itemText}>
                  <FontAwesome6 name="sack-dollar" size={20} color={colors.accent2} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>Sum Insured: {item.value}</Text>
                </XStack>

                <XStack style={styles.itemText}>
                  <FontAwesome6 name="people-roof" size={20} color={colors.accent2} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>People: {calculateInsuredPeople(item)}</Text>
                </XStack>
              </YStack>

              <YStack>
                  <RenderStatus targetDate={item.insuranceEndDate} isCompleted={item.completed} />

                <XStack style={[styles.itemText, {marginTop:10}]}>
                  <CalendarClock size={20} color={colors.primary} />
                  <Text style={[styles.text, { color: colors.text }]}>Start: {moment(item.insuranceStartDate).format('DD-MM-YYYY')}</Text>
                </XStack>

                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={colors.primary} />
                  <Text style={[styles.text, { color: colors.text }]}>End: {moment(item.insuranceEndDate).format('DD-MM-YYYY')}</Text>
                </XStack>
              </YStack>

            </XStack>

            <XStack alignItems='center' gap={10} marginBottom={10}>
              <Animated.View>
                <MaterialCommunityIcons
                  name={iconName} size={13} color={differenceInDays(item.insuranceEndDate) > 0 ? 'green' : 'red'} />
              </Animated.View>
              <ThemedText>Remaining :
                <Text> {differenceInDays(item.insuranceEndDate)}</Text> Days</ThemedText>
            </XStack>
          </YStack>
        );
      
      case 'House Rental Renewal':
        return <>
        <YStack>
            <XStack justifyContent='space-between'>
              <YStack>
                <XStack style={styles.itemText}>
                  <User size={20} color={colors.accent1} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.houseOwnerName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <UserCheck2 size={20} color={colors.secondary} />
                  <Text style={[styles.text, { color: colors.text }]}>{item.consultantName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                <FontAwesome6 name="sack-dollar" size={18} color={colors.secondary}/>
                  <Text style={[styles.text, { color: colors.text }]}>Rental Amount: {item.rentAmount}</Text>
                </XStack>
              </YStack>
              <YStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={colors.primary} />
                  <Text style={[styles.text, { color: colors.text }]}>{moment(item.endDate).format('DD-MM-YYYY')}</Text>
                </XStack>
                <XStack >
                  <RenderStatus targetDate={item.endDate} isCompleted={item.completed} />
                </XStack>
              </YStack>
            </XStack>
            <XStack alignItems='center' gap={10} marginBottom={10}>
              <Animated.View>
                <MaterialCommunityIcons
                  name={icon} size={13} color={differenceInDays(item.endDate) > 0 ? 'green' : 'red'} />
              </Animated.View>
              <ThemedText>Remaining :
                <Text> {differenceInDays(item.endDate)}</Text> Days Left</ThemedText>
            </XStack>
          </YStack>
        </>
      default:
        return <ThemedText style={styles.itemText}>No data available.</ThemedText>;
    }
  }, [item, colorscheme]);


  return (
    <XStack $sm={{ flexDirection: 'column' }} style={styles.itemContainer}>
      <Card
        style={styles.cardStyle}
        onPress={() => router.navigate(`/(tabs)/category/edit/${item.id}`)}
      >
        <CardHeader>
          {renderContent(iconName)}
          <XStack alignItems='center' justifyContent='space-between'>
            <Button
              theme='purple_active'
              onPress={openModal}
              size="$1"
              // width={100}
              icon={Workflow}
            >
              View Workflow
            </Button>
            <Button
              theme='red_active'
              onPress={openModal}
              size="$1"
              width={100}
              alignSelf='flex-end'
              icon={Trash}
            >
              Delete
            </Button>


          </XStack>

          <Modal visible={modalState.isVisible} onDismiss={closeModal}>
            <YStack space="$4" padding="$4" alignItems="center" margin='auto'>
              {deleteFormDataLoading && <ActivityIndicator size={'large'} />}
              <Text style={styles.modalTitle}>Are you sure?</Text>
              <Paragraph>This action cannot be undone. Do you want to delete this item?</Paragraph>
              <XStack space="$4">
                <Button theme="gray" onPress={closeModal} size="$3">Cancel</Button>
                <Button theme="red" onPress={async () => await handleDelete()} size="$3">Confirm Delete</Button>
              </XStack>
            </YStack>
          </Modal>
        </CardHeader>
        <Card.Background theme={'alt2'} style={[styles.cardBackground, { backgroundColor }]}>
          <Svg height="100%" width="400" style={styles.svgTop}>
            <Path d="M0,100 C150,200 250,0 400,100 L400,200 L0,200 Z" fill={colorscheme === 'light' ? "blue" : '#CCE3F3'} />
          </Svg>
          <Svg height="100%" width="400" style={styles.svgBottom}>
            <Path d="M0,50 C100,150 300,-50 400,50 L400,200 L0,200 Z" fill={colorscheme === 'light' ? "purple" : 'white'} />
          </Svg>
        </Card.Background>
      </Card>
    </XStack>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 8,
    padding: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  cardBackground: {
    borderRadius: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    marginLeft: 6,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    maxWidth: 180,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  svgTop: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.3
  },
  svgBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    opacity: 0.25
  }
});

export default React.memo(Item);

function differenceInDays(targetDate: Date): number {
  const endDate = moment(targetDate)
  const currentDate = moment()
  return endDate.diff(currentDate, 'days')
}

const RenderStatus: FunctionComponent<{ targetDate: Date, isCompleted: boolean }> = ({
  isCompleted,
  targetDate
}) => {
  const colorscheme = useColorScheme()
  return <>
    {differenceInDays(targetDate) < 1 ?
      (<View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
        <Text style={{ color: 'red' }}>Pending</Text>
        <Ionicons name='pause-circle-outline' color={'red'} size={20} />
      </View>)
      :
      <>
        {isCompleted ? (<View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
          <Text style={{ color: colorscheme == 'light' ? 'darkgreen' : 'lightgreen' }}>Completed</Text>
          <MaterialIcons name='check' color={colorscheme == 'light' ? 'darkgreen' : 'lightgreen'} size={20} />
        </View>)
          :
          (<View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
            <Text style={{ color: 'darkorange' }}>In-Progress</Text>
            <MaterialCommunityIcons name='progress-clock' color={'darkorange'} size={20} />
          </View>)}
      </>
    }
  </>
}