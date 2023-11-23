// CustomGoalUpdateModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Text, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomGoalUpdateModal = ({ isVisible, onClose, goalInfo }) => {
  const [goalName, setGoalName] = useState(goalInfo[0]);
  const [currentNumber, setCurrentNumber] = useState(goalInfo[1]);
  const [targetNumber, setTargetNumber] = useState(goalInfo[2]);
  useEffect(() => {
    setGoalName(goalInfo[0]);
    setCurrentNumber(goalInfo[1]);
    setTargetNumber(goalInfo[2]);
  }, [isVisible, goalInfo]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          {/* Title */}
          <Text style={styles.modalTitle}>Update Goal</Text>

          {/* Title */}
          <Text style={styles.modalSubtitle}>Current Value: {currentNumber}</Text>

          {/* Current and target numbers section */}
          <View style={styles.numbersContainer}>
            <TextInput
              style={styles.numinput}
              placeholder="Enter current number"
              placeholderTextColor="#000000"
              keyboardType="numeric"
              onChangeText={(text) => setCurrentNumber(text)}
            />
            <TextInput
              style={styles.numinput}
              placeholder="Enter target number"
              placeholderTextColor="#000000"
              keyboardType="numeric"
              onChangeText={(text) => setTargetNumber(text)}
            />
          </View>
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.closeButton}
              onPress={onClose}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </Modal >
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#303841',
    marginTop: 20,
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#303841',
    marginTop: 10,
  },
  modalContainer: {
    //flex: 1,
    marginHorizontal: 20,
    marginVertical: 150,
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
    color: '#000000',
  },
  numinput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 250,
    color: '#000000',
  },
  iconRows: {
    flexDirection: 'column', // Change to 'column' to stack rows vertically
    marginTop: 10,
  },
  iconRow: {
    flexDirection: 'row',
  },
  iconContainer: {
    margin: 15,
    paddingBottom: 10,
  },
  numbersContainer: {
    marginTop: 20,
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

export default CustomGoalUpdateModal;