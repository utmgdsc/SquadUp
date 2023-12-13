import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EventComponent from '../components/EventComponent';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Events({ navigation }) {
    // Sample data for events
    const events = [
        { title: 'Monday, October 9', activityName: 'Morning Run', time: '6:00AM - 7:00AM' },
        { title: 'Monday, October 9', activityName: 'Lunch Yoga: Studio A', time: '12:00PM - 1:00PM' },
        { title: 'Tuesday, October 10', activityName: 'Drop-in Basketball: Gym A and B', time: '7:30AM - 9:00AM' },
        { title: 'Wednesday, October 11', activityName: 'Yoga Class: Studio C', time: '5:00PM - 6:30PM' },
        { title: 'Wednesday, October 11', activityName: 'Evening Run', time: '6:30PM - 7:30PM' },
        { title: 'Thursday, October 12', activityName: 'Swimming: Pool B', time: '10:00AM - 11:30AM' },
        { title: 'Friday, October 13', activityName: 'Gym Workout: Fitness Center', time: '4:00PM - 5:30PM' },
        { title: 'Saturday, October 14', activityName: 'Cycling Group: Trail Ride', time: '8:00AM - 10:00AM' },
        // Add more events as needed
    ];
    const [dayList, setDayList] = React.useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
    const [openDayList, setOpenDayList] = React.useState(false);
    const [valueDayList, setValueDayList] = React.useState([]);
    const [activeDay, setActiveDay] = React.useState('Day'); // This is the Day for which all info will be rendered 
    
    const filteredEvents = events.filter(event => event.title.startsWith(activeDay));

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
