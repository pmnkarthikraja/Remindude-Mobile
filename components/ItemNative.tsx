import { HeaderTitle } from '@/components/SectionList';
import { ThemedText } from '@/components/ThemedText';
import { useTimeElapseAnimation } from '@/components/TimeAnimationProvider';
import { useDeleteFormDataMutation } from '@/hooks/formDataHooks';
import { Agreements, FormData, InsuranceRenewals } from '@/utils/category';
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import moment from 'moment';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { ActivityIndicator, Animated, Modal, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { Colors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';


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
    const iconName = useTimeElapseAnimation()
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

    const backgroundColor = colorscheme == 'light'
        ? 'white'
        : 'transparent'

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
                    {/* <UniqueBackground /> */}

                    <Svg viewBox='0 0 480 480' width="100%" height="130" style={{ position: 'absolute', opacity: 0.25 }}>
                        <Path fill={colorscheme == 'light' ? Colors.light.tint : 'white'} d='M480 240a160 160 0 0 0-240-138.6V0a160 160 0 0 0-138.6 240H0a160 160 0 0 0 240 138.6V480a160 160 0 0 0 138.6-240H480Z' />
                    </Svg>

                    <Svg height="120" width="105%" style={styles.svgBottom}>
                        <Path d="M0,50 C100,150 300,-50 400,50 L400,200 L0,200 Z" fill={colorscheme == 'light' ? Colors.light.tint : 'white'} />
                    </Svg>
                    {/* <Svg height="100%" width="105%" style={styles.svgBackground}>
                        <Defs>
                            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="blue" stopOpacity="1" />
                                <Stop offset="100%" stopColor="purple" stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Path d="M0,100 C150,200 250,0 400,100 L400,200 L0,200 Z" fill="url(#grad)" />
                    </Svg> */}

                    {renderContent(item, colors, iconName)}
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
                            {deleteFormDataLoading && <ActivityIndicator size={'large'} />}
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

// const styles = StyleSheet.create({
//   header:{
//     flex:1,
//     // backgroundColor:'red'
//   },
//   headerText:{
//     color:'grey',
//     padding:10,
//     fontSize:16,
//     fontWeight:'bold'
//   },
//   assignmentText: {
//     fontSize: 14,
//     marginLeft: 5,
//   },
//   username: {
//     fontWeight: 'bold',
//     color: 'orange',
//   },
//   itemContainer: {
//     borderRadius: 8,
//     padding: 10,
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   cardStyle: {
//     backgroundColor: 'transparent',
//     borderColor: 'transparent',
//   },
//   cardBackground: {
//     borderRadius: 10,
//   },
//   itemText: {
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   text: {
//     marginLeft: 6,
//     fontWeight: 'bold',
//     flexWrap: 'wrap',
//     maxWidth: 180,
//   },
//   modalTitle: {
//     fontWeight: 'bold',
//   },
//   svgTop: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     opacity: 0.3
//   },
//   svgBottom: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     opacity: 0.25
//   }
// });

const styles = StyleSheet.create({
    header: {
        flex: 1,
        // backgroundColor:'red'
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

export default Item;

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



const renderContent = (item: FormData, colors: ColorsObject, iconName: 'timer-sand' | 'timer-sand-paused' | 'timer-sand-complete') => {
    switch (item.category) {
        case 'Agreements':
            return (
                <AgreementsItem colors={colors} icon={iconName} item={item} />
            );

        default:
            return <ThemedText style={styles.itemText}>No data available.</ThemedText>;
    }
}

interface ItemProps {
    colors: ColorsObject,
    icon: 'timer-sand' | 'timer-sand-paused' | 'timer-sand-complete'
}

interface AgreementsItemProps extends ItemProps {
    item: Agreements,
}

const AgreementsItem: FunctionComponent<AgreementsItemProps> = React.memo(({
    colors, icon, item
}) => {
    return <View >
        {item.assignedTo && (
            <View style={styles.assignmentContainer}>
                <MaterialCommunityIcons name="account-arrow-right" size={20} color="purple" />
                <ThemedText style={styles.assignmentText}>Assigned to: <Text style={styles.username}>{item.assignedTo.email}</Text></ThemedText>
            </View>
        )}

        {item.assignedBy && (
            <View style={styles.assignmentContainer}>
                <MaterialCommunityIcons name="account-arrow-left" size={20} color="purple" />
                <ThemedText style={styles.assignmentText}>Assigned By: <Text style={styles.username}>{item.assignedBy}</Text></ThemedText>
            </View>
        )}
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
