import { HeaderTitle } from '@/components/SectionList';
import { ThemedText } from '@/components/ThemedText';
import { useDeleteFormDataMutation } from '@/hooks/formDataHooks';
import { Agreements, FormData, HouseRentalRenewal, InsuranceRenewals, IQAMARenewals, PurchaseOrder, VisaDetails } from '@/utils/category';
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import moment from 'moment';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { Colors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Avatar } from 'tamagui';
import { useProfilePictureAndUsername } from './userContext';
import LoadingWidget from './LoadingWidget';

type ColorsObject = {
    primary: string,
    secondary: string,
    accent1: string,
    accent2: string,
    accent3: string,
    accent4: string,
    accent5: string,
    text: string,
    background: string
}

function calculateInsuredPeople(item: InsuranceRenewals) {
    let count = 0
    const { employeeInsuranceValue, spouseInsuranceValue, childrenInsuranceValues } = item
    if (employeeInsuranceValue !== '' && employeeInsuranceValue !== '0') {
        count += 1
    }
    if (spouseInsuranceValue !== '' && spouseInsuranceValue != '0') {
        count += 1
    }
    if (childrenInsuranceValues && childrenInsuranceValues.length !== 0) {
        count += childrenInsuranceValues.filter(d => d != '').length
    }
    return count
}

export const isFormData = (item: FormData | HeaderTitle): item is FormData => {
    return (item as FormData).id !== undefined;
};


const Item = ({ item }: { item: FormData | HeaderTitle }) => {
    const colorscheme = useColorScheme();
    const { isLoading: deleteFormDataLoading, isError: isDeleteFormdataErr, mutateAsync: deleteFormData } = useDeleteFormDataMutation()
    const [modalState, setModalState] = useState<{ isVisible: boolean, itemId: string | null }>({ isVisible: false, itemId: null });
    const handleDelete = useCallback(async () => {
        try {
            if (isFormData(item)) {
                await deleteFormData(item.id)
                closeModal()
                router.navigate('/')
            }
        } catch (e) {
            console.log("error on axios:", e)
        }

        setModalState({ isVisible: false, itemId: null });
    }, [item]);

    const openModal = useCallback(() => setModalState({ isVisible: true, itemId: (isFormData(item) && item.id) || '' }), [item]);
    const closeModal = useCallback(() => setModalState({ isVisible: false, itemId: null }), []);

    const colors: ColorsObject = {
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

    const headerColor = (item: HeaderTitle) => {
        switch (item) {
            case 'Renewal Pending':
                return 'red'
            case 'Next 30 days':
                return 'green'
            case 'Next 30 - 60 days':
                return '#ff6600'
            case 'Next 60 - 90 days':
                return 'purple'
            case 'Later 90 days':
                return 'grey'
            case 'Assigned To Others':
                return 'blue'
            case 'Assigned To You':
                return 'brown'
        }
    }


    const getButtonColor = (index: number) => {
        const lightColors = ['#F0F4C3', '#FFCDD2', '#D1C4E9'];
        const darkColors = ['#4CAF50', '#E57373', '#9575CD'];

        return colorscheme === 'light' ? lightColors[index] : darkColors[index];
    };


    if (!isFormData(item)) {
        return <View style={styles.header}><Text style={[styles.headerText, { color: headerColor(item) }]}>{!isFormData(item) ? item : ''}</Text></View>
    }



    const renderContent = useCallback((item: FormData, colors: ColorsObject, iconName: 'timer-sand' | 'timer-sand-paused' | 'timer-sand-complete') => {
        const profilePicAndUserName = useProfilePictureAndUsername(item.assignedTo?.email || item.assignedBy || '')
        const props = {
            colors,
            icon: iconName,
            profilePicAndUserName,
        }

        switch (item.category) {
            case 'Agreements':
                return (
                    <AgreementsItem item={item}  {...props} />
                );
            case 'Purchase Order':
                return (
                    <PurchaseOrderItem item={item} {...props} />
                )
            case 'Visa Details':
                return (
                    <VisaDetailsItem item={item} {...props} />
                )
            case 'IQAMA Renewals':
                return (
                    <IQAMARenewalsItem item={item} {...props} />
                )
            case 'Insurance Renewals':
                return (
                    <InsuranceRenewalsItem item={item} {...props} />
                )
            case 'House Rental Renewal':
                return (
                    <HouseRentalRenewalItem item={item} {...props} />
                )

            default:
                return <ThemedText style={styles.itemText}>No data available.</ThemedText>;
        }
    }, [])

    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity
                style={[styles.cardStyle, colorscheme == 'light' ? { backgroundColor: 'white' } : { backgroundColor: 'transparent' }]}
                onPress={() => {
                    if (isFormData(item)) {
                        router.navigate(`/(tabs)/category/edit/${item.id}`)
                    }
                }}
            >

                <View style={styles.cardHeader}>
                    <Svg viewBox='0 0 480 480' width="100%" height="130" style={{ position: 'absolute', opacity: 0.25 }}>
                        <Path fill={colorscheme == 'light' ? Colors.light.tint : 'white'} d='M480 240a160 160 0 0 0-240-138.6V0a160 160 0 0 0-138.6 240H0a160 160 0 0 0 240 138.6V480a160 160 0 0 0 138.6-240H480Z' />
                    </Svg>

                    <Svg height="120" width="105%" style={styles.svgBottom}>
                        <Path d="M0,50 C100,150 300,-50 400,50 L400,200 L0,200 Z" fill={colorscheme == 'light' ? Colors.light.tint : 'white'} />
                    </Svg>

                    {renderContent(item, colors, 'timer-sand')}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: getButtonColor(0) }]}
                            onPress={openModal}
                        >
                            <MaterialIcons name='share' size={16} color={colorscheme == 'light' ? 'green' : 'white'} />
                            <ThemedText style={styles.buttonText}>View Workflow</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: getButtonColor(1) }]}
                            onPress={openModal}
                        >
                            <MaterialIcons name='delete' size={16} color={colorscheme == 'light' ? 'red' : 'white'} />
                            <ThemedText style={styles.buttonText}>Delete</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {modalState.isVisible && (
                    <Modal visible={modalState.isVisible} onRequestClose={closeModal}>
                        <View style={styles.modalContent}>
                            {deleteFormDataLoading &&  <LoadingWidget />}
                            <Text style={styles.modalTitle}>Are you sure?</Text>
                            <Text>This action cannot be undone. Do you want to delete this item?</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity style={[styles.button, styles.grayButton]} onPress={closeModal}>
                                    <ThemedText style={styles.buttonTextAction}>Cancel</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.redButton]} onPress={async () => await handleDelete()}>
                                    <ThemedText style={styles.buttonTextAction}>Confirm Delete</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default Item;

const styles = StyleSheet.create({
    header: {
        flex: 1,
    },
    headerText: {
        color: 'grey',
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    itemContainer: {
        borderRadius: 8,
        padding: 10,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cardStyle: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderRadius: 20,
    },
    cardHeader: {
        flexDirection: 'column',
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: 'grey',
        padding: 10,
        borderRadius: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5,

    },
    purpleButton: {
        backgroundColor: 'purple',
    },
    redButton: {
        backgroundColor: 'red',
    },
    grayButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        marginLeft: 5,
        fontSize: 10
    },
    buttonTextAction: {
        marginLeft: 5,
        fontSize: 10,
        color: 'white'
    },
    modalContent: {
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    assignmentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    assignmentText: {
        fontSize: 14,
        marginLeft: 5,
    },
    username: {
        fontWeight: 'bold',
        color: 'orange',
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemText: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 16,
        marginBottom: 4,
    },
    text: {
        marginLeft: 6,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        maxWidth: 180,
    },
    remainingDaysContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardBackground: {
        borderRadius: 10,
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
    },
    svgBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.3
    },
});

function differenceInDays(targetDate: Date): number {
    const endDate = moment(targetDate)
    const currentDate = moment()
    return endDate.diff(currentDate, 'days')
}

const RenderStatus: FunctionComponent<{ targetDate: Date, isCompleted: boolean }> = React.memo(({
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
})

type UserInfo = { userName: string | undefined, profilePicture: string | undefined }

const AssignedToOrBy: FunctionComponent<{ item: FormData, userName: string | undefined, profilePicture: string | undefined }> = ({
    item,
    profilePicture,
    userName
}) => {
    const email = item.assignedTo ? item.assignedTo.email : item.assignedBy || ''
    const firstLetter = userName ? userName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();

    return <View >
        {item.assignedTo && (
            <View style={styles.assignmentContainer}>
                <MaterialCommunityIcons name="account-arrow-right" size={20} color="purple" />
                <ThemedText style={styles.assignmentText}>Assigned To: </ThemedText>

                <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center', gap: 5, marginLeft: 10 }}>
                    {profilePicture && <Avatar circular space size="$2">
                        <Avatar.Image src={profilePicture || 'https://via.placeholder.com/150'} />
                        <Avatar.Fallback bg="$gray4" />
                    </Avatar>}
                    {!profilePicture &&
                        <Avatar circular size={'$2'} backgroundColor={Colors.light.tint} alignItems="center" justifyContent="center">
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                {firstLetter}
                            </Text>
                        </Avatar>
                    }
                    <Text style={styles.username}>{userName || item.assignedTo.email}</Text>
                </View>
            </View>
        )}

        {item.assignedBy && (
            <View style={styles.assignmentContainer}>
                <MaterialCommunityIcons name="account-arrow-left" size={20} color="purple" />

                <ThemedText style={styles.assignmentText}>Assigned By: </ThemedText>
                <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center', gap: 5, marginLeft: 10 }}>
                    {profilePicture && <Avatar circular space size="$2">
                        <Avatar.Image src={profilePicture || 'https://via.placeholder.com/150'} />
                        <Avatar.Fallback bg="$gray4" />
                    </Avatar>}
                    {!profilePicture &&
                        <Avatar circular size={'$2'} backgroundColor={Colors.light.tint} alignItems="center" justifyContent="center">
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                {firstLetter}
                            </Text>
                        </Avatar>
                    }
                    <Text style={styles.username}>{userName || item.assignedBy}</Text>
                </View>
            </View>
        )}
    </View>
}


interface ItemProps {
    colors: ColorsObject,
    icon: 'timer-sand' | 'timer-sand-paused' | 'timer-sand-complete'
    profilePicAndUserName: UserInfo
}

interface AgreementsItemProps extends ItemProps {
    item: Agreements,
}

const AgreementsItem: FunctionComponent<AgreementsItemProps> = React.memo(({
    colors, icon, item, profilePicAndUserName
}) => {
    const { profilePicture, userName } = profilePicAndUserName
    return <View >
        <AssignedToOrBy item={item} profilePicture={profilePicture} userName={userName} />
        <View>
            <View style={styles.contentRow}>
                <View>
                    <View style={styles.itemText}>
                        <FontAwesome5 name='user-alt' size={16} color={colors.accent1} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.clientName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome name='id-card' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Vendor Code: {item.vendorCode}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <MaterialCommunityIcons name='calendar-clock' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Start Date: {moment(item.startDate).format('DD-MM-YYYY')}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.itemText}>
                        <MaterialCommunityIcons name='calendar-clock' size={16} color={colors.primary} />
                        <Text style={[styles.text, { color: colors.text }]}>{moment(item.endDate).format('DD-MM-YYYY')}</Text>
                    </View>
                    <View>
                        <RenderStatus targetDate={item.endDate} isCompleted={item.completed} />
                    </View>
                </View>
            </View>
            <View style={styles.remainingDaysContainer}>
                <Animated.View>
                    <MaterialCommunityIcons
                        name={icon} size={13} color={differenceInDays(item.endDate) > 0 ? 'green' : 'red'} />
                </Animated.View>
                <ThemedText>Remaining :
                    <Text> {differenceInDays(item.endDate)}</Text> Days Left</ThemedText>
            </View>
        </View>
    </View>
})


interface PurchaseOrderProps extends ItemProps {
    item: PurchaseOrder,
}

const PurchaseOrderItem: FunctionComponent<PurchaseOrderProps> = React.memo(({
    colors, icon, item, profilePicAndUserName
}) => {
    const { profilePicture, userName } = profilePicAndUserName
    return <View >
        <AssignedToOrBy item={item} profilePicture={profilePicture} userName={userName} />

        <View>
            <View style={styles.contentRow}>
                <View>
                    <View style={styles.itemText}>
                        <FontAwesome5 name='user-alt' size={16} color={colors.accent1} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.clientName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome5 name='user-check' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Consultant: {item.consultant}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome name='id-card' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>PO Number: {item.poNumber}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.itemText}>
                        <MaterialCommunityIcons name='calendar-clock' size={16} color={colors.primary} />
                        <Text style={[styles.text, { color: colors.text }]}>{moment(item.poEndDate).format('DD-MM-YYYY')}</Text>
                    </View>
                    <View>
                        <RenderStatus targetDate={item.poEndDate} isCompleted={item.completed} />
                    </View>
                </View>
            </View>
            <View style={styles.remainingDaysContainer}>
                <Animated.View>
                    <MaterialCommunityIcons
                        name={icon} size={13} color={differenceInDays(item.poEndDate) > 0 ? 'green' : 'red'} />
                </Animated.View>
                <ThemedText>Remaining :
                    <Text> {differenceInDays(item.poEndDate)}</Text> Days Left</ThemedText>
            </View>
        </View>
    </View>
})



interface VisaDetailsItemProps extends ItemProps {
    item: VisaDetails,
}

const VisaDetailsItem: FunctionComponent<VisaDetailsItemProps> = React.memo(({
    colors, icon, item, profilePicAndUserName
}) => {
    const { profilePicture, userName } = profilePicAndUserName
    return <View >
        <AssignedToOrBy item={item} profilePicture={profilePicture} userName={userName} />

        <View>
            <View style={styles.contentRow}>
                <View>
                    <View style={styles.itemText}>
                        <FontAwesome5 name='user-alt' size={16} color={colors.accent1} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.clientName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome5 name='user-check' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Consultant: {item.consultantName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome5 name='users' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Sponsor: {item.sponsor}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <MaterialCommunityIcons name='calendar-clock' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Visa Exp. on: {moment(item.visaExpiryDate).format('DD-MM-YYYY')}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.itemText}>
                        <MaterialCommunityIcons name='calendar-clock' size={16} color={colors.primary} />
                        <Text style={[styles.text, { color: colors.text }]}>{moment(item.visaEndDate).format('DD-MM-YYYY')}</Text>
                    </View>
                    <View>
                        <RenderStatus targetDate={item.visaEndDate} isCompleted={item.completed} />
                    </View>
                </View>
            </View>
            <View style={styles.remainingDaysContainer}>
                <Animated.View>
                    <MaterialCommunityIcons
                        name={icon} size={13} color={differenceInDays(item.visaEndDate) > 0 ? 'green' : 'red'} />
                </Animated.View>
                <ThemedText>Remaining :
                    <Text> {differenceInDays(item.visaEndDate)}</Text> Days Left</ThemedText>
            </View>
        </View>
    </View>
})



interface IQAMARenewalsItemProps extends ItemProps {
    item: IQAMARenewals,
}

const IQAMARenewalsItem: FunctionComponent<IQAMARenewalsItemProps> = React.memo(({
    colors, icon, item, profilePicAndUserName
}) => {
    const { profilePicture, userName } = profilePicAndUserName
    return <View >
        <AssignedToOrBy item={item} profilePicture={profilePicture} userName={userName} />

        <View>
            <View style={styles.contentRow}>
                <View>
                    <View style={styles.itemText}>
                        <FontAwesome5 name='user-alt' size={16} color={colors.accent1} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.employeeName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome name='id-card' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Iqama No.: {item.iqamaNumber}</Text>
                    </View>
                    {/* <View style={styles.itemText}>
                        <FontAwesome5 name='users' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Sponsor: {item.sponsor}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <MaterialCommunityIcons name='calendar-clock' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Visa Exp. on: {moment(item.visaExpiryDate).format('DD-MM-YYYY')}</Text>
                    </View> */}
                </View>
                <View>
                    <View style={styles.itemText}>
                        <MaterialCommunityIcons name='calendar-clock' size={16} color={colors.primary} />
                        <Text style={[styles.text, { color: colors.text }]}>{moment(item.expiryDate).format('DD-MM-YYYY')}</Text>
                    </View>
                    <View>
                        <RenderStatus targetDate={item.expiryDate} isCompleted={item.completed} />
                    </View>
                </View>
            </View>
            <View style={styles.remainingDaysContainer}>
                <Animated.View>
                    <MaterialCommunityIcons
                        name={icon} size={13} color={differenceInDays(item.expiryDate) > 0 ? 'green' : 'red'} />
                </Animated.View>
                <ThemedText>Remaining :
                    <Text> {differenceInDays(item.expiryDate)}</Text> Days Left</ThemedText>
            </View>
        </View>
    </View>
})


interface InsuranceRenewalsItemProps extends ItemProps {
    item: InsuranceRenewals,
}

const InsuranceRenewalsItem: FunctionComponent<InsuranceRenewalsItemProps> = React.memo(({
    colors, icon, item, profilePicAndUserName
}) => {
    const { profilePicture, userName } = profilePicAndUserName
    return <View >
        <AssignedToOrBy item={item} profilePicture={profilePicture} userName={userName} />

        <View>
            <View style={styles.contentRow}>
                <View>
                    <View style={styles.itemText}>
                        <FontAwesome5 name='user-alt' size={16} color={colors.accent1} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.employeeName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome name='institution' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>{item.insuranceCompany}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome6 name="sack-dollar" size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Sum Insured: {item.value}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome6 name="people-roof" size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>People: {calculateInsuredPeople(item)}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <MaterialCommunityIcons name='calendar-clock' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Start: {moment(item.insuranceStartDate).format('DD-MM-YYYY')}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.itemText}>
                        <MaterialCommunityIcons name='calendar-clock' size={16} color={colors.primary} />
                        <Text style={[styles.text, { color: colors.text }]}>{moment(item.insuranceEndDate).format('DD-MM-YYYY')}</Text>
                    </View>
                    <View>
                        <RenderStatus targetDate={item.insuranceEndDate} isCompleted={item.completed} />
                    </View>
                </View>
            </View>
            <View style={styles.remainingDaysContainer}>
                <Animated.View>
                    <MaterialCommunityIcons
                        name={icon} size={13} color={differenceInDays(item.insuranceEndDate) > 0 ? 'green' : 'red'} />
                </Animated.View>
                <ThemedText>Remaining :
                    <Text> {differenceInDays(item.insuranceEndDate)}</Text> Days Left</ThemedText>
            </View>
        </View>
    </View>
})


interface HouseRentalRenewalProps extends ItemProps {
    item: HouseRentalRenewal,
}

const HouseRentalRenewalItem: FunctionComponent<HouseRentalRenewalProps> = React.memo(({
    colors, icon, item, profilePicAndUserName
}) => {
    const { profilePicture, userName } = profilePicAndUserName
    return <View >
        <AssignedToOrBy item={item} profilePicture={profilePicture} userName={userName} />

        <View>
            <View style={styles.contentRow}>
                <View>
                    <View style={styles.itemText}>
                        <FontAwesome5 name='user-alt' size={16} color={colors.accent1} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { color: colors.text }]}>{item.houseOwnerName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome5 name='user-check' size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Consultant: {item.consultantName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <FontAwesome6 name="sack-dollar" size={16} color={colors.secondary} />
                        <Text style={[styles.text, { color: colors.text }]}>Rental Amount: {item.rentAmount}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.itemText}>
                        <MaterialCommunityIcons name='calendar-clock' size={16} color={colors.primary} />
                        <Text style={[styles.text, { color: colors.text }]}>{moment(item.endDate).format('DD-MM-YYYY')}</Text>
                    </View>
                    <View>
                        <RenderStatus targetDate={item.endDate} isCompleted={item.completed} />
                    </View>
                </View>
            </View>
            <View style={styles.remainingDaysContainer}>
                <Animated.View>
                    <MaterialCommunityIcons
                        name={icon} size={13} color={differenceInDays(item.endDate) > 0 ? 'green' : 'red'} />
                </Animated.View>
                <ThemedText>Remaining :
                    <Text> {differenceInDays(item.endDate)}</Text> Days Left</ThemedText>
            </View>
        </View>
    </View>
})
