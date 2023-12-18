import * as React from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, Modal, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { addEvent, fetchSquadEvents, fetchSquadName, fetchSquadsForUser, fetchUserEvents, joinSquadtoEvent, joinUsertoEvent, fetchUser } from '../../Database';
import { Timestamp } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import EventModal from '../components/CustomGoalUpdateModal';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CalendarScreen({ userId } ) {
    // State Variables
    const [markedDates, setMarkedDates] = React.useState({});
    const [eventName, setEventName] = React.useState('');
    const [eventType, setEventType] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState('');
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [addEventModalVisible, setAddEventModalVisible] = React.useState(false);
    const [events, setEvents] = React.useState({});
    const [newEventAdded, setNewEventAdded] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(true);
    const eventTypes = [
        { label: 'Sport', value: 'Sport' },
        { label: 'Workout', value: 'Workout' }
    ];
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [openSquadList, setOpenSquadList] = React.useState(false);
    const [valueSquadList, setValueSquadList] = React.useState(null);
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [chosenDate, setChosenDate] = React.useState(new Date());
    const [squadOrUserEvent, setSquadOrUserEvent] = React.useState('user')
    const [squadList, setSquadList] = React.useState([]);
    const [userName, setUserName] = React.useState('');
    const [squadID, setSquadID] = React.useState('');
    const [squadLoading, setSquadLoading] = React.useState(true);   

    // Modal used to display events of a particular day 
    const EventModal = ({ visible, onClose, events }) => {
        const eventsForDay = events[selectedDate] || []
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* events holds the selected day's events - these are queried and displayed */}
                            <View style={styles.modalTextContainer}>
                                {eventsForDay.map((event, eventIndex) => (
                                    <Text key={eventIndex} style={{ textAlign: 'center' }}>
                                        {event.userOrSquad === "user" ? (
                                            <Text style={styles.modalHeaderTextPersonal}>Personal Event</Text>
                                        ) : (
                                            <Text style={styles.modalHeaderTextSquad}>{event.userOrSquad} Event</Text>
                                        )}
                                        {`\n Event Name: ${event.name} \n`}
                                        {`Event Type: ${event.type} \n`}
                                    </Text>
                                ))}
                            </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const addEventModal = () => {
        return (    
            <Modal 
                animationType="slide"
                transparent={true}
                visible={addEventModalVisible}
                onRequestClose={() => setAddEventModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Add Event</Text>
                        <TouchableOpacity
                            style = {styles.modalButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.textStyle}>Select Date</Text>
                        </TouchableOpacity>
                        {pickDate()}
                        <TextInput
                            style={styles.roundedInput}
                            onChangeText={setEventName}
                            value={eventName}
                            placeholder='Enter event name'
                            placeholderTextColor='rgba(0, 0, 0, 0.3)'
                        />
                        <View style={{ marginTop: 10, marginBottom: 10, zIndex: 2 }}>
                            <DropDownPicker
                                open={open}
                                value={value}
                                setOpen={setOpen}
                                setValue={setValue}
                                items={eventTypes}
                                defaultValue={eventType}
                                dropDownStyle={{ backgroundColor: '#EEEEEE'}}
                                labelStyle={{
                                    fontWeight: "bold",
                                    textAlign: 'center', // Center-align the label text
                                    fontSize: 20,
                                }}
                                textStyle={{
                                    fontSize: 20,
                                    fontFamily: 'Helvetica Neue',
                                }}
                                placeholder='Select an event type'
                                placeholderTextColor='rgba(0, 0, 0, 0.3)'
                                onSelectItem={(item) => setEventType(item.value)}
                            />
                        </View>
                        <View style = {{ marginBottom: 10, marginTop: 10, zIndex: 1 }}>    
                            <DropDownPicker
                                open={openSquadList}
                                value={valueSquadList}
                                setOpen={setOpenSquadList}
                                setValue={setValueSquadList}
                                items={squadList.map(squad => ({
                                    label: squad.squadName !== 'Personal' ? squad.squadName + ' (Squad)' : squad.squadName,
                                    value: squad.squadID,
                                }))}
                                // defaultValue={eventType}
                                dropDownStyle={{ backgroundColor: '#EEEEEE', marginTop: 10, marginBottom: 10 }}
                                labelStyle={{
                                    fontWeight: "bold",
                                    textAlign: 'center',
                                    fontSize: 20,
                                }}
                                textStyle={{
                                    fontSize: 20,
                                    fontFamily: 'Helvetica Neue',
                                }}
                                placeholder='Select who the event is for'
                                placeholderTextColor='rgba(0, 0, 0, 0.3)'
                                onSelectItem={(item) => {
                                    setSquadOrUserEvent(item.label.toLowerCase() === 'personal' ? 'user' : item.label);
                                    setSquadID(item.value);
                                }}
                            />
                        </View>
                        <View style={styles.iconRow}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    handleAddEvent();
                                    setAddEventModalVisible(false);
                                }}
                            >
                                <Text style={styles.textStyle}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setAddEventModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    const pickDate = () => {
        if (showDatePicker) {
            return (
                <DateTimePicker
                    value={chosenDate}
                    mode="date"
                    is24Hour={true}
                    display='default'
                    onChange={(event, pickedDate) => {
                        setShowDatePicker(true);
                        pickedDate.setHours(0, 0, 0, 0);
                        const formattedDate = pickedDate.toISOString().split('T')[0];
                        setChosenDate(pickedDate);
                        setSelectedDate(formattedDate);
                        markDate(formattedDate);
                    }}
                >
                </DateTimePicker>
            )
        }
    } 

    // Function to add an event to the Firestore database 
    const handleAddEvent = async () => {
        try{
            if (!selectedDate || !eventName.trim() || !eventType || !squadOrUserEvent) {
                Alert.alert('Error', 'Please fill in all the required fields.');
                return;
            }

            const dateTime = Timestamp.fromDate(new Date(selectedDate));
            const eventID = await addEvent(eventName, eventType, dateTime);

            if (squadOrUserEvent === 'user') {
                joinUsertoEvent(userId, eventID);
            } else {
                joinSquadtoEvent(squadID, eventID);
            }

            // Pushing the new event locally 
            const newEvent = {name: eventName, type:eventType, date: selectedDate, userOrSquad: squadOrUserEvent };

            const newEvents = {...events};
            if(!newEvents[selectedDate]) {
                newEvents[selectedDate] = [];
            }
            newEvents[selectedDate].push(newEvent);
            setEvents(newEvents);

            const newMarkedDates = {...markedDates};
            if(!newMarkedDates[selectedDate]) {
                newMarkedDates[selectedDate] = {};
            }
            newMarkedDates[selectedDate].marked = true;

            if(squadOrUserEvent === 'user') {
                newMarkedDates[selectedDate].dotColor = 'green';
            } else {
                newMarkedDates[selectedDate].dotColor = 'orange';
            }

            const isUserEvent = newEvents[selectedDate].some(event => event.userOrSquad === "user");
            const isSquadEvent = newEvents[selectedDate].some(event => event.userOrSquad !== "user");
            if (isUserEvent && isSquadEvent){
                newMarkedDates[selectedDate].dotColor = "purple";
            }

            setMarkedDates(newMarkedDates);

            Alert.alert('Success! ', 'Event added to the calendar.');
            setEventName('');
            setEventType('');
            setOpen(false);
            setValue(null);
            setNewEventAdded(true);
        } catch (error)  {
            console.error('Error adding event: ', error);
            Alert.alert('Error', 'There was a problem adding the event.');
        }
    };

    // Function to mark/select a date
    const markDate = (date) => {
        const newMarkedDates = { ...markedDates };
        if (selectedDate) {
            newMarkedDates[selectedDate] = { ...newMarkedDates[selectedDate], selected: false };
        }
        newMarkedDates[date] = { ...newMarkedDates[date], selected: true, selectedColor: 'blue' }
        setMarkedDates(newMarkedDates);
        setSelectedDate(date);
    }

    const onDayPress = async (day) => {
        // Calling markDate to highlight the day 
        markDate(day.dateString);
        if (events[day.dateString] && events[day.dateString].length > 0) {
            setModalVisible(true);
        }
    };

    React.useEffect(() => {
        const fetchUserSquads = async () => {
            try {
                const userSquads = await fetchSquadsForUser(userId);
                setSquadList([{ squadID: "", squadName: 'Personal'}, ...userSquads]);
                setSquadLoading(false);
            } catch (error) {
                console.error("Error fetching user's squads: ", error);
            }
        }
        fetchUserSquads();
    }, []);

    React.useEffect(() => {
        const fetchUserData = async () => {
            try { 
                const userData = await fetchUser(userId);
                setUserName(userData)
            } catch (error) {
                console.error("Error fetching user name: ", error);
            }
        };
        fetchUserData();
    }, [userId]);

    // UseEffect hook to get events from Firestore when the component mounts
    React.useEffect(() => {
        setIsLoading(true);
        console.log("is squad loading? ", squadLoading);
        if (!squadLoading) {
            const fetchEvents = async () => {
                try {
                    const userEvents = await fetchUserEvents(userId);
                    const newEvents = {}
                    const newMarkedDates = {};
                    userEvents.forEach(event => {
                        const date = event.DateTime.toDate().toISOString().split('T')[0];
                        if (!newEvents[date]) {
                            newEvents[date] = [];
                        }
                        newEvents[date].push({ name: event.name, type: event.type, date: date, userOrSquad: "user" });
                        newMarkedDates[date] = { marked: true, dotColor: 'green' };
                    });
                    for (const squad of squadList) {
                        const squadEvents = await fetchSquadEvents(squad.squadID);
                        const squadName = squad.squadName;
                        squadEvents.forEach(event => {
                            const date = event.DateTime.toDate().toISOString().split('T')[0];
                            if (!newEvents[date]) {
                                newEvents[date] = [];
                            }
                            newEvents[date].push({ name: event.name, type: event.type, date: date, userOrSquad: squadName });
                            newMarkedDates[date] = { marked: true, dotColor: 'orange' };
                        });
                    }
                    // If a date has both a user and squad event, set the dot color to orange
                    Object.keys(newEvents).forEach(date => {
                        const isUserEvent = newEvents[date].some(event => event.userOrSquad === "user");
                        const isSquadEvent = newEvents[date].some(event => event.userOrSquad !== "user");
                        if (isUserEvent && isSquadEvent){
                            newMarkedDates[date].dotColor = "purple";
                        }
                    });

                    // Setting the marked dates and events
                    setMarkedDates(newMarkedDates);
                    setEvents(newEvents);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching events: ", error);
                }
            };
            fetchEvents();
        }
    }, [squadLoading]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
                <Text style = {{ color: 'white', fontWeight: 'bold' }}>Calendar Loading...</Text>
            </View>
        );
    }

    // Rendering the CalendarScreen component
    return (
        <KeyboardAvoidingView behavior='height' style={styles.keyboardStyle} keyboardVerticalOffset={30}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}> {userName}'s Calendar </Text>

                <Calendar
                    style={styles.calendar}
                    theme={calendarTheme}
                    markedDates={markedDates}
                    onDayPress={onDayPress}
                />
                <EventModal
                    visible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    events={events}
                />
                <View style = {styles.pageButtonContainer}>
                    <TouchableOpacity style = {styles.pageButton} onPress = {() => setAddEventModalVisible(true)}>
                        <Text style={styles.addEventTitle}>Add an Event</Text>
                    </TouchableOpacity>
                    {addEventModal()}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

// Defining the calendar theme
const calendarTheme = {
    calendarBackground: '#242c40',
    dayTextColor: '#fff',
    textDisabledColor: '#444',
    monthTextColor: '#fff'
};

// Defining the styles for the CalendarScreen component
const styles = StyleSheet.create({
    titleContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingTop: 80, 
        backgroundColor: '#303841'
    },
    title: {
        fontSize: 30,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
    calendar: {
        borderRadius: 5,
        height: 350,
        width: 350,
        margin: 12,
        elevation: 5,
        borderWidth: 4,
        borderColor: 'rgba(100, 100, 100, 0.2)',
        alignSelf: 'center'
    },
    calendarLoading: {
        borderRadius: 5,
        height: 350,
        width: 350,
        margin: 12,
        elevation: 5,
        borderWidth: 4,
        borderColor: 'rgba(100, 100, 100, 0.5)',
        alignSelf: 'center',
        opacity: 0.75
    },
    keyboardStyle: {
        flex: 1,
    },
    roundedInput: {
        height: 40,
        margin: 12,
        marginTop: 10,
        marginBottom: 10,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'center',
        fontWeight: "bold"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#2196F3',
        width: '50%',
        alignSelf: 'center',
        marginBottom: 5,
        marginTop: 25
    },
    pageButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 40,
        marginBottom: 50,
    },
    pageButton: {
        backgroundColor: '#EEEEEE',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        width: "50%"
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
    modalTextContainer: {
        marginBottom: 15,
        alignItems: 'center',
    },
    modalHeaderTextPersonal: {
        fontWeight: 'bold',
        fontSize: 20, 
        color: 'green',
    },
    modalHeaderTextSquad: {
        fontWeight: 'bold',
        fontSize: 20, 
        color: 'orange',
    },
    addEventTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        paddingBottom: 10,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#303841"
    },
    modalTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#303841',
        marginTop: 20,
        marginBottom: 20,
    },
    iconRow: {
        flexDirection: 'row',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
    },
    addButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#089000',
        width: '50%',
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 25,
        marginRight: 20,
    },
    closeButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#8B0000',
        width: '30%',
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 25,
    },
});