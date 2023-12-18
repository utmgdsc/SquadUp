import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { fetchUserEvents, fetchUser } from '../../Database';

export default function MainScreen({ userId }) {
    const [username, setUserName] = useState('');

    const getName = async () => {
        const user = await fetchUser(userId);
        setUserName(user);
    }
    const [events, setEvents] = useState([]);
    getName();
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const events = await fetchUserEvents(userId);
                setEvents(events);
            } catch (error) {
                console.error("Error fetching user's events: ", error);
            }
        }
        fetchEvents();
    }, []);

    let nextEvent = "Rest Day";
    const currentDate = new Date();
    for (let event of events) {
        const eventDate = new Date(event.DateTime); // Assuming your event data has a 'date' field
        if (eventDate >= currentDate) {
            nextEvent = event.name; // Assuming your event data has a 'title' field
            break;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back, {username}</Text>
            <Text style={styles.subtitle}>{`Your next event: ${nextEvent}`}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#303841",
    },
    title: {
        fontSize: 80,
        fontWeight: 'bold',
        marginBottom: 50,
        marginTop: 100,
        color: '#7189A4',
    },
    subtitle: {
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 50,
        marginTop: 100,
        color: '#EEEEEE',
    },
    nextEventContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#ddd',
    },
    nextEventText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});