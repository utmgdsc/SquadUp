// CustomIconPickerModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
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
];

const CustomIconPickerModal = ({ isVisible, onSelect, onClose }) => {
  //const [modalVisible2, setmodalVisible2] = React.useState(true);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        {customIcons.map((iconName) => (
          <TouchableOpacity
            key={iconName}
            onPress={() => [onSelect(iconName)]}
            style={styles.iconContainer}
          >
            <Ionicons name={iconName} size={30} color="#303841" />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.modalButton}
          onPress={onClose}>
          <Text style={styles.textStyle}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    //padding: 10,
    marginHorizontal: 100,
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
  iconContainer: {
    margin: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#000000',
    width: '50%',
    alignSelf: 'center',
    marginBottom: 5,
    marginTop: 25
  },
});

export default CustomIconPickerModal;