// CustomIconPickerModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Text, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const customIcons = [
  'barbell',
  'american-football',
  'basketball',
  'football',
  'tennisball',
  'bicycle',
  'walk',
  'restaurant',
  'speedometer',
  'pulse',
];

const CustomIconPickerModal = ({ isVisible, onSelect, onClose }) => {
  const [iconName, setIconName] = useState('add');
  const [goalName, setGoalName] = useState('');
  const [currentNumber, setCurrentNumber] = useState('');
  const [targetNumber, setTargetNumber] = useState('');

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          {/* Title */}
          <Text style={styles.modalTitle}>Add New Goal</Text>
          {/* Goal name text input */}
          <TextInput
            style={styles.input}
            placeholder="Enter goal name"
            placeholderTextColor="#000000"
            onChangeText={(text) => setGoalName(text)}
          />
          {/* Title */}
          <Text style={styles.modalSubtitle}>Select Goal Icon</Text>
          {/* Icon rows */}
          <View style={styles.iconRows}>
            <View style={styles.iconRow}>
              <ScrollView horizontal>
                {customIcons.slice(0, 5).map((iconName) => (
                  <TouchableOpacity
                    key={iconName}
                    onPress={() => setIconName(iconName)}
                    style={styles.iconContainer}
                  >
                    <Ionicons name={iconName} size={30} color="#303841" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.iconRow}>
              <ScrollView horizontal>
                {customIcons.slice(5).map((iconName) => (
                  <TouchableOpacity
                    key={iconName}
                    onPress={() => setIconName(iconName)}
                    style={styles.iconContainer}
                  >
                    <Ionicons name={iconName} size={30} color="#303841" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          {/* Current and target numbers section */}
          <View style={styles.numbersContainer}>
            <TextInput
              style={styles.numinput}
              placeholder="Enter current number"
              placeholderTextColor="#000000"
              keyboardType="numeric"
              onChangeText={(text) => setCurrentNumber(parseInt(text, 10) || 0)}
            />
            <TextInput
              style={styles.numinput}
              placeholder="Enter target number"
              placeholderTextColor="#000000"
              keyboardType="numeric"
              onChangeText={(text) => setTargetNumber(parseInt(text, 10) || 0)}
            />
          </View>
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.addButton}
              onPress={() => onSelect(iconName, goalName, currentNumber, targetNumber)}>
              <Text style={styles.textStyle}>Add Goal</Text>
            </TouchableOpacity>
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

export default CustomIconPickerModal;