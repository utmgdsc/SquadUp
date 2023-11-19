import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { fetchUser, fetchUserGoals } from '../../Database';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { Ionicons } from '@expo/vector-icons';


export default Profile = ({ userId }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [userName, setUserName] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const closeModal = () => {
        toggleModal();
    };

    const getName = async () => {
        const user = await fetchUser(userId);
        setUserName(user);
    }

    getName();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access media library denied');
            }
        })();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
    };

    return (
        <View style={styles.background}>

            {/* Profile picture */}
            <TouchableOpacity onPress={pickImage} style={styles.profileCircle}>
                {selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={styles.circularImage} />
                ) : (
                    <Ionicons name="person" size={120} color="#EEEEEE" alignSelf="center" />
                )}
            </TouchableOpacity>

            {selectedImage && (
                <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
                    <Text style={{ color: 'white' }}>Remove image</Text>
                </TouchableOpacity>
            )}

            {/* User name */}
            <Text style={styles.userName}>
                {userName}
            </Text>

            {/* Goals */}
            <Text style={styles.Goal}>
                Goals
            </Text>

            {/* Progress bar */}
            <View style={styles.horizontalContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleModal}>
                <Ionicons name="add-circle" style={styles.icon} size={109} />
                    <AnimatedCircularProgress
                        size={100}
                        width={6}
                        fill={20}
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                        
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={toggleModal}>
                <Ionicons name="add-circle" style={styles.icon} size={109} />
                    <AnimatedCircularProgress
                        size={100}
                        width={6}
                        fill={50}
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={toggleModal}>
                <Ionicons name="add-circle" style={styles.icon} size={109} />
                    <AnimatedCircularProgress
                        size={100}
                        width={6}
                        fill={7}
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                    />
                </TouchableOpacity>
            </View>

            {/* Highlighted Stats */}
            <Text style={styles.highlightedStats}>
                Highlighted Stats
            </Text>

            {/* Stats */}
            <View style={styles.container}>
                <View style={styles.scrollableContainer}>
                    <ScrollView>
                        <View style={styles.statsContainer}>
                            {/* {userStats.map((stat, index) => (
                            <View key={index} style={styles.statItem}>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                            </View>
                            ))} */}
                            <Text style={styles.statItem}>Total Games Played</Text>
                        </View>
                    </ScrollView>
                </View>

                {/* Add button */}
                <View>
                    <TouchableOpacity onPress={toggleModal}>
                        <Ionicons name="add-circle" size={50} color="#EEEEEE" />
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={modalVisible}
                        onRequestClose={closeModal}
                    >
                        <View style={{ marginTop: 22 }}>
                            <View>
                                <Text>Hello World!</Text>

                                <Button
                                    onPress={closeModal}
                                    title="Hide Modal"
                                    color="#841584"
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileCircle: {
        backgroundColor: '#AFAFAF',
        marginTop: 10,
        width: 150,
        height: 150,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 75,
        borderColor: '#00ADB5',
        marginTop: "20%",
        borderWidth: 2,
    },
    circularImage: {
        width: 146,
        height: 146,
        borderRadius: 73,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 100,
        borderColor: '#00ADB5',
    },
    background: {
        flex: 1,
        backgroundColor: "#303841",
        
    },
    userName: {
        paddingTop: "3%",
        fontSize: 25,
        fontFamily: "Nunito",
        textAlign: "center",
        color: "#EEEEEE",
    },
    Goal: {
        fontSize: 50,
        fontFamily: "Nunito",
        textAlign: "left",
        color: "#EEEEEE",
        paddingTop: "5%",
        paddingLeft: "5%",
    },
    highlightedStats: {
        fontSize: 50,
        fontFamily: "Nunito",
        textAlign: "left",
        color: "#EEEEEE",
        alignSelf: 'center',
        paddingTop: "5%",
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#00ADB5',
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: "5%",
        marginLeft: "5%",
        marginRight: "5%",
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: "5%",
    },
    scrollableContainer: {
        height: "50%",
        backgroundColor: '#EEEEEE',
        width: "75%",
        borderRadius: 15,
    },
    statsContainer: {
        marginTop: 10,
        marginLeft: 20,
    },
    statItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        fontSize: 16,
        color: '#303841',
    },
    addButtonContainer: {
        paddingLeft: "11%",
        paddingRight: "11%",
    },
    icon: {
        position: 'absolute',
        color: "#EEEEEE",
        zIndex: 1,
    },
});
