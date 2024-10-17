import { Colors } from '@/constants/Colors';
import { TaskKind, TaskPriorityLevel, TaskStatus } from '@/utils/task';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View as NativeView, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import {
    Button,
    Checkbox,
    H4,
    H6,
    ScrollView,
    Sheet,
    Text,
    XStack,
    YStack
} from 'tamagui';
import { ThemedText } from './ThemedText';


const icons = (color: string) => {
    return {
        priority: <Ionicons name="flag-outline" size={24} color={color} />,
        statusInProgress: <Ionicons name="time-outline" size={24} color={color} />,
        statusCompleted: <Ionicons name="checkmark-circle-outline" size={24} color={color} />,
        statusPending: <Ionicons name="hourglass-outline" size={24} color={color} />,
        duration: <Ionicons name="timer-outline" size={24} color={color} />,
        kindTask: <Ionicons name="list-outline" size={24} color={color} />,
        kindMeeting: <Ionicons name="people-outline" size={24} color={color} />,
        calendarRange: <Ionicons name="calendar-outline" size={24} color={color} />,
    }
};


export interface Filters {
    priority?: TaskPriorityLevel;
    status?: TaskStatus;
    timePeriod?: 'Today' | 'Tomorrow' | 'ThisWeek' | 'ThisMonth' | 'CalendarRange';
    kind?: TaskKind;
    startDate?: Date;
    endDate?: Date;
}

interface FilterComponentProps {
    onSearch: (query: string) => void;
    onApplyFilters: (filters: Filters) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onSearch, onApplyFilters }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Filters>({});
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [position, setPosition] = useState(1); // Start in the middle of snap points
    const [isStartDateOpen, setIsStartDateOpen] = useState(false)
    const [isEndDateOpen, setIsEndDateOpen] = useState(false)
    const colorscheme = useColorScheme()

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        onSearch(text);
    };

    const handleApplyFilters = () => {
        onApplyFilters(filters);
        setIsSheetOpen(false);
        setPosition(1); // Reset position when closed
    };

    const handleOpenChange = (open: boolean) => {
        setIsSheetOpen(open);
        if (!open) {
            setPosition(1); // Reset to middle position when sheet is closed
        }
    };

    const handleDateChange = (field: 'startDate' | 'endDate', date: Date) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: date,
        }));
    };

    const iconColor = 'white'
    return (
        <>
            <NativeView style={{
                flexDirection: 'row', alignItems: 'center',
                marginTop: 10,
                paddingHorizontal: 10
            }}>
                <TextInput style={styles.searchInput}
                    onChangeText={handleSearch} placeholder="Search" />
                <TouchableOpacity style={styles.filterButton} onPress={() => setIsSheetOpen(true)}>
                    <Ionicons name="options-outline" size={24} color="white" />
                </TouchableOpacity>
            </NativeView>

            <YStack  >
                <Sheet
                    modal
                    open={isSheetOpen}
                    onOpenChange={handleOpenChange}
                    snapPoints={[60, 20, 0]}
                    position={isSheetOpen ? 0 : 1}
                    onPositionChange={() => setIsSheetOpen(false)}
                >
                    <Sheet.Frame padding="$4" space style={{ backgroundColor: colorscheme == 'light' ? Colors.light.tint : '#252C39' }}>
                        <Sheet.Handle />
                        <ScrollView >
                            <YStack space="$4" paddingHorizontal="$4">

                                <XStack alignItems='center' gap={10} marginBottom={15}>
                                    <Ionicons name="options-outline" size={24} color="white" />
                                    <H4 style={[styles.sectionTitle, colorscheme == 'light' ? { color: 'white' } : { color: 'white' }]}>Filters</H4>
                                </XStack>

                                {/* Priority Filter */}
                                <XStack alignItems='center' gap={50}>
                                    <YStack space="$3">
                                        <XStack alignItems='center' gap={10}>
                                            {icons(iconColor).priority}
                                            <H6 style={[styles.filterTitle, colorscheme == 'light' ? { color: 'white' } : { color: 'white' }]}>Priority</H6>
                                        </XStack>

                                        {['Urgent', 'Moderate', 'Normal'].map((priority) => (
                                            <XStack space="$5" key={priority} alignItems='center'>
                                                <Checkbox
                                                    key={priority}
                                                    // label={priority}
                                                    checked={filters.priority === priority}
                                                    onCheckedChange={() =>
                                                        setFilters({
                                                            ...filters,
                                                            priority: priority as TaskPriorityLevel,
                                                        })
                                                    }
                                                    backgroundColor={filters.priority == priority ? 'green' : 'white'}
                                                    borderWidth={1}
                                                    borderColor="$borderColor"
                                                    padding="$2"
                                                    borderRadius="$4"
                                                    style={styles.checkboxLabel}
                                                />
                                                <ThemedText darkColor='white' lightColor='white'>{priority}</ThemedText>
                                            </XStack>
                                        ))}
                                    </YStack>

                                    <YStack space="$3">
                                        <XStack alignItems='center' gap={10}>
                                            {icons(iconColor).statusInProgress}
                                            <H6 style={[styles.filterTitle, colorscheme == 'light' ? { color: 'white' } : { color: 'white' }]}>Status</H6>
                                        </XStack>
                                        {['In-Progress', 'Pending', 'Completed'].map((status) => (
                                            <XStack space='$5' key={status} alignItems='center'>
                                                <Checkbox
                                                    key={status}
                                                    checked={filters.status === status}
                                                    onCheckedChange={() =>
                                                        setFilters({
                                                            ...filters,
                                                            status: status as TaskStatus,
                                                        })
                                                    }
                                                    backgroundColor={filters.status == status ? 'green' : 'white'}
                                                    borderWidth={1}
                                                    borderColor="$borderColor"
                                                    borderRadius="$4"
                                                    style={styles.checkboxLabel}
                                                ></Checkbox>
                                                <ThemedText darkColor='white' lightColor='white'>{status}</ThemedText>
                                            </XStack>
                                        ))}
                                    </YStack>
                                </XStack>
                                {/* Time Period Filter */}
                                <XStack alignItems='baseline' gap={50}>
                                    <YStack space="$3" marginTop={20}>
                                        {/* <H6 style={[styles.filterTitle,colorscheme=='light'?{color:'white'}:{color:'white'}]}>Time Period</H6> */}
                                        <XStack alignItems='center' gap={10}>
                                            {icons(iconColor).duration}
                                            <H6 style={[styles.filterTitle, colorscheme == 'light' ? { color: 'white' } : { color: 'white' }]}>Duration</H6>
                                        </XStack>
                                        {['Today', 'Tomorrow', 'ThisWeek', 'ThisMonth', 'CalendarRange'].map((timePeriod) => (
                                            <XStack space='$5' key={timePeriod} alignItems='center'>
                                                <Checkbox
                                                    // label={timePeriod}
                                                    checked={filters.timePeriod === timePeriod}
                                                    onCheckedChange={() =>
                                                        setFilters({
                                                            ...filters,
                                                            timePeriod: timePeriod as Filters['timePeriod'],
                                                        })
                                                    }
                                                    backgroundColor={filters.timePeriod == timePeriod ? 'green' : 'white'}
                                                    borderWidth={1}
                                                    borderColor="$borderColor"
                                                    padding="$2"
                                                    borderRadius="$4"
                                                    style={styles.checkboxLabel}
                                                />
                                                <ThemedText darkColor='white' lightColor='white'>{timePeriod}</ThemedText>
                                            </XStack>
                                        ))}
                                    </YStack>

                                    {/* Task Kind Filter */}
                                    <YStack space="$3">
                                        {/* <H6 style={[styles.filterTitle,colorscheme=='light'?{color:'white'}:{color:'white'}]}>Kind</H6> */}
                                        <XStack alignItems='center' gap={10}>
                                            {icons(iconColor).kindTask}
                                            <H6 style={[styles.filterTitle, colorscheme == 'light' ? { color: 'white' } : { color: 'white' }]}>Kind</H6>
                                        </XStack>
                                        {['Task', 'Meeting'].map((kind) => (
                                            <XStack space='$5' key={kind} alignItems='center'>
                                                <Checkbox
                                                    // label={kind}
                                                    checked={filters.kind === kind}
                                                    onCheckedChange={() =>
                                                        setFilters({
                                                            ...filters,
                                                            kind: kind as TaskKind,
                                                        })
                                                    }
                                                    backgroundColor={filters.kind == kind ? 'green' : 'white'}
                                                    borderWidth={1}
                                                    borderColor="$borderColor"
                                                    padding="$2"
                                                    borderRadius="$4"
                                                    style={styles.checkboxLabel}
                                                />
                                                <ThemedText darkColor='white' lightColor='white'>{kind}</ThemedText>
                                            </XStack>
                                        ))}
                                    </YStack>
                                </XStack>

                                {/* Date Range Filter */}
                                {filters.timePeriod === 'CalendarRange' && (
                                    <YStack space="$4" paddingTop="$4">
                                        <H6 style={[styles.filterTitle, colorscheme == 'light' ? { color: 'white' } : { color: 'white' }]}>Select Date Range</H6>
                                        <XStack alignItems="center" space="$3" >
                                            <Ionicons name="calendar-outline" size={24} color="gray" onPress={() => setIsStartDateOpen(true)} />
                                            <ThemedText darkColor='white' lightColor='white'>{filters.startDate?.toLocaleString() || new Date().toLocaleString()}</ThemedText>
                                            {/* <DatePicker
                      date={filters.startDate}
                      onDateChange={(date) => handleDateChange('startDate', date)}
                      placeholder="Start Date"
                      style={styles.datePicker}
                    /> */}
                                            {isStartDateOpen && <DateTimePicker
                                                id='customReminderDate'
                                                value={new Date() || filters.startDate}
                                                mode="date"
                                                display="default"
                                                minimumDate={new Date()}
                                                onChange={(e, date) => {
                                                    if (e.type == 'dismissed') {
                                                        setIsStartDateOpen(false)
                                                    } else {
                                                        if (date) {
                                                            handleDateChange('startDate', date)
                                                            setIsStartDateOpen(false)
                                                        }
                                                    }

                                                }}
                                            />}
                                        </XStack>

                                        <XStack alignItems="center" space="$3">
                                            <Ionicons name="calendar-outline" size={24} color="gray" onPress={() => setIsEndDateOpen(true)} />
                                            <ThemedText darkColor='white' lightColor='white'>{filters.endDate?.toLocaleString() || new Date().toLocaleString()}</ThemedText>
                                            {/* <DatePicker
                      date={filters.endDate}
                      onDateChange={(date) => handleDateChange('endDate', date)}
                      placeholder="End Date"
                      style={styles.datePicker}
                    /> */}
                                            {isEndDateOpen && <DateTimePicker
                                                id='customReminderDate'
                                                value={new Date() || filters.endDate}
                                                mode="date"
                                                display="default"
                                                minimumDate={new Date()}
                                                onChange={(e, date) => {
                                                    if (e.type == 'dismissed') {
                                                        setIsEndDateOpen(false)
                                                    } else {
                                                        if (date) {
                                                            handleDateChange('endDate', date)
                                                            setIsEndDateOpen(false)
                                                        }
                                                    }

                                                }}
                                            />}
                                        </XStack>
                                    </YStack>
                                )}

                                <XStack alignItems='center' justifyContent='space-around'>
                                    <Button theme={'blue_active'} onPress={handleApplyFilters} marginTop="$4" borderRadius="$4">
                                        Apply Filters

                                        {Object.keys(filters).length > 0 && <Text style={{
                                            position: 'absolute',
                                            right: -10,
                                            borderRadius: 25,
                                            width: 25,
                                            height: 25,
                                            textAlign: 'center',
                                            backgroundColor: 'orange',
                                            justifyContent: 'center',
                                            top: -10,
                                            color: 'white'
                                        }}>{Object.keys(filters).filter(r => r !== 'startDate' && r !== 'endDate').length}+</Text>}
                                    </Button>
                                    <Button theme={'yellow_surface4'} onPress={() => setFilters({})} marginTop="$4" borderRadius="$4">
                                        Clear Filters
                                    </Button>
                                </XStack>
                            </YStack>
                        </ScrollView>
                    </Sheet.Frame>
                </Sheet>
            </YStack>
        </>
    );
};

const styles = {
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 10
    },
    searchInput: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        fontSize: 16,
        elevation: 5,
    },
    filterButton: {
        marginLeft: 10,
        backgroundColor: Colors.light.tint,
        padding: 10,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        // marginBottom: 10,
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: '600',
        // color: 'white',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },
    datePicker: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        borderRadius: 4,
        color: '#333',
    },
};

export default FilterComponent;
