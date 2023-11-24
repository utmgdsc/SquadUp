// CustomGoalUpdateModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Text, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomGoalUpdateModal = ({ isVisible, onSelect, onClose, goalInfo }) => {
  const [goalName, setGoalName] = useState(goalInfo[0]);
  const [currentNumber, setCurrentNumber] = useState(goalInfo[1]);
  const [targetNumber, setTargetNumber] = useState(goalInfo[2]);
  useEffect(() => {
    setGoalName(goalInfo[0]);
    setCurrentNumber(goalInfo[1]);
    setTargetNumber(goalInfo[2]);
  }, [isVisible, goalInfo]);

  const decreaseCount = () => {
    if (currentNumber > 0) {
      setCurrentNumber(currentNumber - 1);
    }
  };

  const increaseCount = () => {
    setCurrentNumber(currentNumber + 1);
  };

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
          <Text style={styles.modalSubtitle}>{goalName}</Text>
          {/* Current and target numbers section */}
          <View style={styles.numbersContainer}>
            <TouchableOpacity style={styles.minusButton} onPress={decreaseCount}>
              <Text style={styles.textStyle}>-</Text>
            </TouchableOpacity>
            {/* Title */}
            <Text style={styles.modalSubtitle}>Current Value: {currentNumber}</Text>
            <TouchableOpacity style={styles.plusButton} onPress={increaseCount}>
              <Text style={styles.textStyle}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.numbersContainer}>
            <TouchableOpacity style={styles.addButton} onPress={() => onSelect(currentNumber)}>
              <Text style={styles.textStyle}>Update Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
    alignSelf: 'center',
  },
  modalContainer: {
    //flex: 1,
    marginHorizontal: 20,
    marginVertical: 200,
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
  numbersContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignContent: 'center',
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
  minusButton: {
    borderRadius: 20,
    padding: 5,
    elevation: 2,
    backgroundColor: '#303841',
    width: '20%',
    //alignSelf: 'center',
    marginBottom: 20,
    marginTop: 25,
    marginRight: 10,
  },
  plusButton: {
    borderRadius: 20,
    padding: 5,
    elevation: 2,
    backgroundColor: '#303841',
    width: '20%',
    //alignSelf: 'center',
    marginBottom: 20,
    marginTop: 25,
    marginLeft: 10,
  },
});

export default CustomGoalUpdateModal;