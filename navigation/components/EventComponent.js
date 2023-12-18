import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchDropInEvents, joinUsertoEvent, addEvent } from '../../Database';
import { Timestamp } from 'firebase/firestore';

const EventComponent = ({ title, activityName, time, userId, eventId }) => {
  const handleJoinPress = async (title, activityName, userId) => {
    const dateTime = Timestamp.fromDate(new Date(convertTitleToDate(title)));

    const returnCode = await joinUsertoEvent(userId, eventId);
    console.log(returnCode);
    if (returnCode == 1){
      alert("You have already joined this event");
    } else {
      alert("Event joined!")
      const eventID = await addEvent(activityName, 'Sport', dateTime);
      const returnCode2 = await joinUsertoEvent(userId, eventID);
      console.log(returnCode2);
    }
  };

  function convertTitleToDate(title) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [, month, day, year] = title.split(/[, ]+/);
    const monthIndex = months.indexOf(month) + 1; // January is 0 in JavaScript, so add 1
    const formattedDate = `${year}-${monthIndex < 10 ? '0' : ''}${monthIndex}-${day < 10 ? '0' : ''}${day}`;
    return formattedDate;
  }

  const [joinText, setJoinText] = React.useState('Join');
  const [buttonColor, setButtonColor] = React.useState('#089000');

  return (
    <View style={styles.eventContainer}>
      <View style={styles.eventDetails}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{activityName}</Text>
        <Text style={styles.subtitle}>{`Time: ${time}`}</Text>
      </View>
      <TouchableOpacity onPress={() => handleJoinPress(title, activityName, userId)} style={[styles.joinButton, { backgroundColor: buttonColor }]}>
        <Text style={styles.joinButtonText}>{joinText}</Text>
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
    padding: 10,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventComponent;
