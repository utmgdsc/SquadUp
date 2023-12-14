import * as React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EventComponent from '../components/EventComponent';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchDropInEvents } from '../../Database';

export default function Events({ navigation }) {
    const [events, setEvents] = React.useState([]);
    const [dayList, setDayList] = React.useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
    const [openDayList, setOpenDayList] = React.useState(false);
    const [valueDayList, setValueDayList] = React.useState([]);
    const [activeDay, setActiveDay] = React.useState('Day'); // This is the Day for which all info will be rendered 
    
    const filteredEvents = events.filter(event => event.title.startsWith(activeDay));

    React.useEffect(() => {
        const fetchandLogDropInEvents = async () => {
            try {
                const events = await fetchDropInEvents();
                setEvents(events);
            } catch (error) {
                console.error("Error fetching user's squads: ", error);
            }
        }
        fetchandLogDropInEvents();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}> This Week's Events </Text>
            {/* Drop-down section */}
            <View style={styles.dropdownContainer}>
                <DropDownPicker
                    open={openDayList}
                    value={valueDayList}
                    setOpen={setOpenDayList}
                    setValue={setValueDayList}
                    items={dayList.map(day => ({
                        label: day,
                        value: day,
                    }))}
                    // setItems={setItems}
                    containerStyle={{ height: 50 }}
                    style={styles.picker}
                    dropDownStyle={{ backgroundColor: '#EEEEEE' }}
                    labelStyle={{
                        fontWeight: "bold",
                        textAlign: 'center', // Center-align the label text
                        fontSize: 30,
                    }}
                    textStyle={{
                        fontSize: 20,
                        fontFamily: 'Helvetica Neue',
                    }}
                    placeholder='Select a Day'
                    onSelectItem={(item) => {
                        setActiveDay(item.label);
                    }}
                />
            </View>
            {/* ScrollView for the list of events */}
            <ScrollView>
                {filteredEvents.map((event, index) => (
                    <EventComponent
                        key={index}
                        title={event.title}
                        activityName={event.activityName}
                        time={event.time}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#303841",
        padding: 16,
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 16,
        color: "#EEEEEE",
        alignSelf: 'center',
        paddingBottom: 5,
        paddingTop: 60
    },
    dropdownContainer: {
        backgroundColor: '#EEEEEE', // Background color for the drop-down section
        marginBottom: 15,
        borderRadius: 10, // Add rounded corners
        margin: 10, // Add margin to separate from other components
        zIndex: 1 // This puts the drop down in front of all other components
    },
    picker: {
        backgroundColor: '#EEEEEE', // Background color for the drop-down
        borderColor: '#EEEEEE', // Border color to match the container background
    },
    // Add more styles as needed
});   
