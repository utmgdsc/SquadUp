import * as React from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, Modal, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { addEvent } from '../../Database';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Timestamp } from 'firebase/firestore';

export default function CalendarScreen({ navigation }) {

    // State Variables
    const [markedDates, setMarkedDates] = React.useState({});
    const [eventName, setEventName] = React.useState('');
    const [eventType, setEventType] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState('');
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [events, setEvents] = React.useState({});

    // Modal used to display events of a particular day 
    const EventModal = ({ visible, onClose, events }) => {
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
                        {Object.entries(events).map(([date, eventArray], index) => (
                            <View key={index} style={styles.modalTextContainer}>
                                {eventArray.map((event, eventIndex) => (
                                    <Text key={eventIndex} style={styles.modalText}>
                                        {`Event Name: ${event.name} \n`}
                                        {`Event Type: ${event.type} \n`}
                                    </Text>
                                ))}
                            </View>
                        ))}
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonClose]}
                            onPress={onClose}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    // Function to add an event to the Firestore database 
    const handleAddEvent = () => {
        const dateTime = Timestamp.fromDate(new Date(selectedDate));
        addEvent(eventName, eventType, dateTime).then(() => {
            Alert.alert('Success! ', 'Event added to the calendar.');
            setEventName('');
            setEventType('');
        })
            .catch((error) => {
                console.error('Error adding event: ', error);
                Alert.alert('Error', 'There was a problem adding the event.');
            });
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

    // Function to handle a day press 
    const onDayPress = (day) => {
        // Calling markDate to highlight the day 
        markDate(day.dateString);

        // Firestore is queried to put all of that day's data into events 
        const eventsRef = collection(db, "events");
        const eventsUnsubscribe = onSnapshot(eventsRef, (snapshot) => {
            let eventsForDay = [];
            snapshot.forEach((doc) => {
                let data = doc.data();
                let date = data.DateTime.toDate().toISOString().split('T')[0];
                if (date == day.dateString && (data.name !== undefined && data.type !== undefined)) {
                    eventsForDay.push({ name: data.name, type: data.type, date: day.dateString });
                }
            });
            setEvents({ [day.dateString]: eventsForDay });
            // If the selected day has any events, the modal is displayed upon the click 
            if (eventsForDay.length > 0) { setModalVisible(true); }
        });
        return () => eventsUnsubscribe();
    };

    // UseEffect hook to get events from Firestore when the component mounts
    React.useEffect(() => {
        const unsubsribe = onSnapshot(collection(db, "events"), (snapshot) => {
            let newMarkedDates = {};
            let newEvents = {};
            // Each event is extracted and spliced to retreive the data 
            snapshot.docs.forEach((doc) => {
                let data = doc.data();
                let date = data.DateTime.toDate().toISOString().split('T')[0];
                if (!newEvents[date]) {
                    newEvents[date] = [];
                }
                newEvents[date].push({ name: data.name, type: data.type, date: date });
                newMarkedDates[date] = { marked: true, dotColor: 'red' };
            });
            // Setting the marked dates and events
            setMarkedDates(newMarkedDates);
            setEvents(newEvents);
        });
        return () => unsubsribe();
    }, []);

    // Rendering the CalendarScreen component
    return (
        <KeyboardAvoidingView behavior='height' style={styles.keyboardStyle} keyboardVerticalOffset={30}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}> Calendar </Text>

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
                <Text style={styles.addEventTitle}>Add an event for the highlighted day</Text>
                <TextInput
                    style={styles.roundedInput}
                    onChangeText={setEventName}
                    value={eventName}
                    placeholder='Enter event name'
                />
                <TextInput
                    style={styles.roundedInput}
                    onChangeText={setEventType}
                    value={eventType}
                    placeholder='Enter event type'
                />
                <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonClose]}
                    onPress={handleAddEvent}
                >
                    <Text style={styles.textStyle}>Submit</Text>
                </TouchableOpacity>
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
        // display: 'flex', 
        //alignItems: 'center', 
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        fontSize: 30,
        alignSelf: 'center',
        fontWeight: 'bold',
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
    keyboardStyle: {
        flex: 1,
    },
    roundedInput: {
        height: 40,
        margin: 12,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'center',
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
        alignSelf: 'center'
    },
    modalButtonClose: {
        backgroundColor: '#2196F3',
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
    modalText: {
        textAlign: 'center',
    },
    addEventTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 10,
        alignSelf: 'center',
    }
});