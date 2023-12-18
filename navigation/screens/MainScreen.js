import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { fetchUserEventsforMainScreen, fetchUser } from '../../Database';

export default function MainScreen({ userId }) {
    const [username, setUserName] = useState('');
    const [nextEvent, setNextEvent] = useState('Rest Day');
    const [nextEventParts, setNextEventParts] = useState(['Rest Day', ''])

    const getName = async () => {
        const user = await fetchUser(userId);
        setUserName(user.name);
    }
    const [events, setEvents] = useState([]);
    getName();
    const fetchEvents = async () => {
        try {
            const events = await fetchUserEventsforMainScreen(userId);
            setEvents(events);
            const currentDate = new Date();
            const formattedCurrentDate = currentDate.toISOString().split('T')[0];
            if (events.length === 0) {
                setNextEvent('Rest Day');
            } else {
                for (let event of events) {
                    let eventDate = new Date(event.DateTime);
                    let formattedEventDate = eventDate.toISOString().split('T')[0];
                    if (formattedEventDate == formattedCurrentDate) {
                        setNextEvent(event.name);
                        break;
                    }
                }
            }

        } catch (error) {
            console.error("Error fetching user's events: ", error);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        // Split nextEvent into parts
        setNextEventParts(nextEvent.split(":"));
    }, [nextEvent]);

    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchEvents();
    }, []);

    useEffect(() => {
        if (!refreshing) {
            return;
        }
        fetchEvents().then(() => {
            setRefreshing(false);
        });
    }, [refreshing]);

    return (
        <ScrollView
            ref={scrollRef}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.ScrollView}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Welcome back, {username}</Text>
                <View style={styles.eventContainer}>
                    <Text style={styles.eventTitle}>Upcoming Event</Text>
                    <Text style={styles.eventDetails}>{typeof nextEventParts[0] === 'undefined' ? 'No upcoming events, enjoy your rest day!' :
                        nextEventParts[0] == 'Rest Day' ? 'No upcoming events, enjoy your rest day!' :
                            typeof nextEventParts[1] === 'undefined' ? `${nextEventParts[0]}` :
                                `${nextEventParts[0]} at ${nextEventParts[1]}`}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    ScrollView: {
        backgroundColor: "#303841",
    },
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
    eventContainer: {
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#7189A4',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        width: '90%',
        //height: '30%',
    },
    eventTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#303841',
    },
    eventDetails: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#EEEEEE',
    },
});