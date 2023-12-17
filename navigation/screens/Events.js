import * as React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EventComponent from '../components/EventComponent';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchDropInEvents } from '../../Database';

export default function Events({ userId }) {
    const [events, setEvents] = React.useState([]);
    const [dayList, setDayList] = React.useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
    const [openDayList, setOpenDayList] = React.useState(false);
    const [valueDayList, setValueDayList] = React.useState([]);
    const [activeDay, setActiveDay] = React.useState('Day'); // This is the Day for which all info will be rendered
    const [activeActivity, setActiveActivity] = React.useState(null);
    const [openActivityList, setOpenActivityList] = React.useState(false);
    const [valueActivityList, setValueActivityList] = React.useState([]);
    const activityList = [
        { label: 'Sports', value: 'Sports', keywords: ['Table Tennis', 'Basketball', 'Squash', 'Badminton', 'Soccer', 'Volleyball', 'Cricket', 'Football'] },
        { label: 'Weight Training', value: 'Weight Training', keywords: ['Strength', 'Weights', 'RAWC', 'Barbell'] },
        { label: 'Aquatics', value: 'Aquatics', keywords: ['Pool', 'Paddleboard', 'Swim'] },
        { label: 'Cardio', value: 'Cardio', keywords: ['Yoga', 'Cycling', 'Running', 'Track', 'Cardio', 'HIIT'] },
        { label: "Women's Only", value: "Women's Only", keywords: ["Women's Only", 'Women'] },
    ];


    const parseTime = (timeString) => {
        const parts = timeString.split(' ');
        const timeParts = parts[0].split(':');
        const period = parts[1];
        const hours = parseInt(timeParts[0], 10) + (period === 'PM' && parseInt(timeParts[0], 10) !== 12 ? 12 : 0);
        const minutes = parseInt(timeParts[1], 10);

        return new Date(2023, 0, 1, hours, minutes);
    };

    const filteredEvents = events
        .filter((event) => event.title.startsWith(activeDay))
        .filter((event) => {
            if (!activeActivity) {
                return true;
            }

            const activityKeywords = activityList.find(activity => activity.value === activeActivity).keywords;
            return activityKeywords.some(keyword => event.activityName.toLowerCase().includes(keyword.toLowerCase()));
        })
        .sort((eventA, eventB) => {
            const startTimeA = parseTime(eventA.time.split(' - ')[0]);
            const startTimeB = parseTime(eventB.time.split(' - ')[0]);
            return startTimeA.getTime() - startTimeB.getTime();
        });

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
            <View style={styles.dropdownContainer2}>
                <DropDownPicker
                    open={openActivityList}
                    value={valueActivityList}
                    setOpen={setOpenActivityList}
                    setValue={setValueActivityList}
                    items={activityList.map(activity => ({
                        label: activity.label,
                        value: activity.value,
                    }))}
                    containerStyle={{ height: 50 }}
                    style={styles.picker2}
                    dropDownStyle={{ backgroundColor: '#EEEEEE' }}
                    labelStyle={{
                        fontWeight: "bold",
                        textAlign: 'center',
                        fontSize: 30,
                    }}
                    textStyle={{
                        fontSize: 20,
                        fontFamily: 'Helvetica Neue',
                    }}
                    placeholder='Select an Activity'
                    onSelectItem={(item) => {
                        setActiveActivity(item.value);
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
                        userId={userId}
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
        flexDirection: 'column', // Display the pickers in a row
        backgroundColor: '#EEEEEE', // Background color for the drop-down section
        borderRadius: 10, // Add rounded corners
        zIndex: 3000 // This puts the drop down in front of all other components
    },
    dropdownContainer2: {
        flexDirection: 'column', // Display the pickers in a row
        backgroundColor: '#EEEEEE', // Background color for the drop-down section
        marginBottom: 25,
        borderRadius: 10, // Add rounded corners
        margin: 10, // Add margin to separate from other components
        zIndex: 2 // This puts the drop down in front of all other components
    },
    picker: {
        flex: 1, // Make the pickers take equal space
        backgroundColor: '#EEEEEE', // Background color for the drop-down
        borderColor: '#EEEEEE', // Border color to match the container background
        zIndex: 1,
    },
    picker2: {
        flex: 1, // Make the pickers take equal space
        //marginTop: 10,
        //padding: 20,
        //marginRight: 10, // Add some margin between pickers
        backgroundColor: '#EEEEEE', // Background color for the drop-down
        borderColor: '#EEEEEE', // Border color to match the container background
    },
    // Add more styles as needed
});   
