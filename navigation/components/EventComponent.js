import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const EventComponent = ({ title, activityName, time }) => {
  const handleJoinPress = () => {
    // Add logic to handle joining the event
    console.log(`Joining event: ${title}`);
  };

  return (
    <View style={styles.eventContainer}>
      <View style={styles.eventDetails}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{activityName}</Text>
        <Text style={styles.subtitle}>{`Time: ${time}`}</Text>
      </View>
      <TouchableOpacity onPress={handleJoinPress} style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#EEEEEE'
  },
  eventDetails: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
  joinButton: {
    backgroundColor: '#089000',
    padding: 10,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventComponent;
