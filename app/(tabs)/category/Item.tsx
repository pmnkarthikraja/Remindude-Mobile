import { ThemedText } from '@/components/ThemedText';
import { useDeleteFormDataMutation } from '@/hooks/formDataHooks';
import { useTimeElapseAnimation } from '@/hooks/useTimeElapse';
import { FormData } from '@/utils/category';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { CalendarClock, CheckCircle, CircleUser, FileText, Tag, Trash, User, UserCheck2, Workflow } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Animated, Modal, Platform, StyleSheet, Switch, Text, useColorScheme } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { Button, Card, CardHeader, Paragraph, XStack, YStack } from 'tamagui';

const colors = {
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

const Item = React.memo(({ item }: { item: FormData }) => {
  const { setValue, watch } = useForm<FormData>({
    defaultValues: item
  })
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorscheme = useColorScheme();
  const { isLoading: deleteFormDataLoading, isError: isDeleteFormdataErr, mutateAsync: deleteFormData } = useDeleteFormDataMutation()

  const [modalState, setModalState] = useState<{ isVisible: boolean, itemId: string | null }>({ isVisible: false, itemId: null });
  const { completed } = watch()
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

  const backgroundColor = colorscheme === 'light'
    ? 'white'
    : Platform.OS === 'ios'
      ? '$accentBackground'
      : '$accentColor';

  const currentColors = colors[colorscheme || 'light'];

  const differenceInDays = (targetDate: Date): number => {
    const endDate = moment(targetDate)
    const currentDate = moment()
    return endDate.diff(currentDate, 'days')
  }

  const renderContent = useCallback(() => {
    const iconName = useTimeElapseAnimation()
    switch (item.category) {
      case 'Agreements':
        return (
          <YStack>
            <XStack justifyContent='space-between'>
              <YStack>
                <XStack style={styles.itemText}>
                  <User size={20} color={currentColors.accent1} />
                  <Text style={[styles.text, { color: currentColors.text }]}>{item.clientName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <Tag size={20} color={currentColors.secondary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>Vendor Code: {item.vendorCode}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={currentColors.secondary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>Start Date: {moment(item.startDate).format('DD-MM-YYYY')}</Text>
                </XStack>
              </YStack>
              <Text></Text>
              <YStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={currentColors.primary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>{moment(item.endDate).format('DD-MM-YYYY')}</Text>
                </XStack>
                <XStack alignItems='center' gap={10}>

                  {/* <ThemedText>Completed</ThemedText>
                  <MaterialIcons name='check' color={'green'} size={20} /> */}

                  {differenceInDays(item.endDate) < 1 ?
                   ( <>
                      <ThemedText>Pending</ThemedText>
                      <Ionicons name='pause-circle-outline' color={'orange'} size={20} />
                    </>) :
                    (
                      <>
                        <ThemedText>In-Progress</ThemedText>
                        <MaterialCommunityIcons name='progress-clock' color={'green'} size={20} />
                      </>
                    )
                  }

                  {/* {task.status == 'In-Progress' && <MaterialCommunityIcons name='progress-clock' color={'green'} size={20} />}
                {task.status == 'Pending' && <Ionicons name='pause-circle-outline' color={'orange'} size={20} />} */}
                </XStack>
              </YStack>
            </XStack>
            <XStack alignItems='center' gap={10} marginBottom={10}>
              <Animated.View>
                <MaterialCommunityIcons
                  name={iconName} size={13} color={differenceInDays(item.endDate) > 0 ? 'green' : 'red'} />
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
                  <User size={20} color={currentColors.primary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>{item.clientName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <UserCheck2 size={20} color={currentColors.accent2} />
                  <Text style={[styles.text, { color: currentColors.text }]}>Consultant: {item.consultant}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <Tag size={20} color={currentColors.secondary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>PO Number: {item.poNumber}</Text>
                </XStack>
              </YStack>
              <YStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={currentColors.primary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>{moment(item.poEndDate).format('DD-MM-YYYY')}</Text>
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
                  <User size={20} color={currentColors.primary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>{item.clientName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <CheckCircle size={20} color={currentColors.accent3} />
                  <Text style={[styles.text, { color: currentColors.text }]}>{item.consultantName}</Text>
                </XStack>
                {/* <XStack style={styles.itemText}>
                <Tag size={20} color={currentColors.secondary} />
                <Text style={[styles.text, { color: currentColors.text }]}>Visa Number: {item.visaNumber}</Text>
              </XStack> */}
                <XStack style={styles.itemText}>
                  <CircleUser size={20} color={currentColors.accent3} />
                  <Text style={[styles.text, { color: currentColors.text }]}>{item.sponsor}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={currentColors.accent3} />
                  <Text style={[styles.text, { color: currentColors.text }]}>Visa Exp. Date: {moment(item.visaExpiryDate).format('DD-MM-YYYY')}</Text>
                </XStack>
              </YStack>
              <YStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={currentColors.primary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>{moment(item.visaEndDate).format('DD-MM-YYYY')}</Text>
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
            <XStack>
              <YStack>
                <XStack style={styles.itemText}>
                  <User size={20} color={currentColors.primary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>{item.employeeName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <FileText size={20} color={currentColors.accent4} />
                  <Text style={[styles.text, { color: currentColors.text }]}>IQAMA Number: {item.iqamaNumber}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={currentColors.primary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>Expiry Date: {moment(item.expiryDate).format('DD-MM-YYYY')}</Text>
                </XStack>
              </YStack>
            </XStack>
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
            <XStack>
              <YStack>
                <XStack style={styles.itemText}>
                  <User size={20} color={currentColors.primary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>{item.employeeName}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <FileText size={20} color={currentColors.accent5} />
                  <Text style={[styles.text, { color: currentColors.text }]}>Insurance Company: {item.insuranceCompany}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={currentColors.primary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>Start: {moment(item.insuranceStartDate).format('DD-MM-YYYY')}</Text>
                </XStack>
                <XStack style={styles.itemText}>
                  <CalendarClock size={20} color={currentColors.primary} />
                  <Text style={[styles.text, { color: currentColors.text }]}>End: {moment(item.insuranceEndDate).format('DD-MM-YYYY')}</Text>
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
          {renderContent()}
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
          <Svg height="200" width="400" style={styles.svgTop}>
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
    borderColor: 'transparent'
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
