import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EventComponent from '../components/EventComponent';

export default function Events({ navigation }) {
    // Sample data for events
    const events = [
        { title: 'Tuesday, October 10', activityName: 'Drop-in Basketball: Gym A and B', time: '7:30AM - 9:00AM' },
        { title: 'Wednesday, October 11', activityName: 'Yoga Class: Studio C', time: '5:00PM - 6:30PM' },
        // Add more events as needed
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}> This Week's Events </Text>
            {/* ScrollView for the list of events */}
            <ScrollView>
                {events.map((event, index) => (
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
        paddingBottom: 20,
        paddingTop: 60
    },
    // Add more styles as needed
});   
