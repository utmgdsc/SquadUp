import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { fetchUser, fetchUserGoals } from '../../Database';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import CustomIconPickerModal from '../components/CustomIconPickerModal';
import CustomGoalUpdateModal from '../components/CustomGoalUpdateModal';
import { Ionicons } from '@expo/vector-icons';


export default Profile = ({ userId }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [userName, setUserName] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [goalVisible, setgoalVisible] = useState(false);
    const [goalVisible2, setgoalVisible2] = useState(false);
    const [goalVisible3, setgoalVisible3] = useState(false);
    const [selectedIcon1, setSelectedIcon1] = useState('add'); // Set a default icon
    const [selectedIcon2, setSelectedIcon2] = useState('add'); // Set a default icon
    const [selectedIcon3, setSelectedIcon3] = useState('add'); // Set a default icon
    // list for the three goal's names, curr values and target values
    const [goalNameList, setGoalNameList] = useState(['', '', '']);
    const [currentNumberList, setCurrentNumberList] = useState([0, 0, 0]);
    const [targetNumberList, setTargetNumberList] = useState([0, 0, 0]);

    useEffect(() => {
        console.log('Updated currentNumberList:', currentNumberList);
        console.log('Updated goalNameList:', goalNameList);
      }, [currentNumberList, goalNameList]);

    const toggleModal = () => {
        //setting up a goal
        if (selectedIcon1 == 'add') {
            setModalVisible(!modalVisible);
        } else { //updating
            setgoalVisible(!goalVisible);
        }
    };
    const closeModal = () => {
        setModalVisible(false);
        setgoalVisible(false);
    };

    const toggleModal2 = () => {
        //setting up a goal
        if (selectedIcon2 == 'add') {
            setModalVisible2(!modalVisible2);
        } else { //updating
            setgoalVisible2(!goalVisible2);
        }
    };
    const closeModal2 = () => {
        setModalVisible2(false);
        setgoalVisible(false);
    };

    const toggleModal3 = () => {
        //setting up a goal
        if (selectedIcon3 == 'add') {
            setModalVisible3(!modalVisible3);
        } else { //updating
            setgoalVisible3(!goalVisible3);
        }
    };
    const closeModal3 = () => {
        setModalVisible3(false);
        setgoalVisible(false);
    };

    const handleIconSelect = (iconName, num, goalName, Curr, Target) => {
        console.log(goalName);
        console.log(Curr);
        console.log(Target);
        if (num == 1) {
            setGoalNameList(goalNameList => [goalName, goalNameList[1], goalNameList[2]]);
            setCurrentNumberList(currentNumberList => [Curr, currentNumberList[1], currentNumberList[2]]);
            setTargetNumberList(targetNumberList => [Target, targetNumberList[1], targetNumberList[2]]);
            setSelectedIcon1(iconName);
        }
        if (num == 2) {
            setGoalNameList(goalNameList => [goalNameList[0], goalName, goalNameList[2]]);
            setCurrentNumberList(currentNumberList => [currentNumberList[0], Curr, currentNumberList[2]]);
            setTargetNumberList(targetNumberList => [targetNumberList[0], Target, targetNumberList[2]]);
            setSelectedIcon2(iconName);
        }
        if (num == 3) {
            console.log('Before update:', currentNumberList);
            setGoalNameList(goalNameList => [goalNameList[0], goalNameList[1], goalName]);
            let list_copy = [...currentNumberList];
            list_copy.splice(2, 1, Curr);
            setCurrentNumberList(list_copy);
            setTargetNumberList(targetNumberList => [targetNumberList[0], targetNumberList[1], Target]);
            setSelectedIcon3(iconName);
            console.log('After update:', currentNumberList);
        }
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
                    <Ionicons name={selectedIcon1} style={styles.icon} size={70} />
                    <AnimatedCircularProgress
                        size={100}
                        width={6}
                        fill={20}
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={toggleModal2}>
                    <Ionicons name={selectedIcon2} style={styles.icon} size={70} />
                    <AnimatedCircularProgress
                        size={100}
                        width={6}
                        fill={50}
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={toggleModal3}>
                    <Ionicons name={selectedIcon3} style={styles.icon} size={70} />
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
                {/* Add button 1 */}
                <CustomIconPickerModal
                    isVisible={modalVisible}
                    onSelect={(iconName, goalName, Curr, Target) => {
                        handleIconSelect(iconName, 1, goalName, Curr, Target),
                            closeModal()
                     }}
                    onClose={closeModal}
                />
                {/* Add button 2 */}
                <CustomIconPickerModal
                    isVisible={modalVisible2}
                    onSelect={(iconName, goalName, Curr, Target) => {
                        handleIconSelect(iconName, 2, goalName, Curr, Target), 
                        closeModal2()
                    }}
                    onClose={closeModal2}
                />
                {/* Add button 3 */}
                <CustomIconPickerModal
                    isVisible={modalVisible3}
                    onSelect={(iconName, goalName, Curr, Target) => {
                        handleIconSelect(iconName, 3, goalName, Curr, Target), 
                        closeModal3()
                    }}
                    onClose={closeModal3}
                />
                {/* Goal Update 1 */}
                <CustomGoalUpdateModal
                    isVisible={goalVisible}
                    onClose={closeModal}
                    goalInfo={[goalNameList[0], currentNumberList[0], targetNumberList[0]]}
                />
                {/* Goal Update 2 */}
                <CustomGoalUpdateModal
                    isVisible={goalVisible2}
                    onClose={closeModal2}
                    goalInfo={[goalNameList[1], currentNumberList[1], targetNumberList[1]]}
                />
                {/* Goal Update 3 */}
                <CustomGoalUpdateModal
                    isVisible={goalVisible3}
                    onClose={closeModal3}
                    goalInfo={[goalNameList[2], currentNumberList[2], targetNumberList[2]]}
                />
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
        fontFamily: "Helvetica Neue",
        textAlign: "center",
        color: "#EEEEEE",
    },
    Goal: {
        fontSize: 45,
        fontFamily: "Helvetica Neue",
        textAlign: "left",
        color: "#EEEEEE",
        paddingTop: "5%",
        paddingLeft: "5%",
    },
    highlightedStats: {
        fontSize: 45,
        fontFamily: "Helvetica Neue",
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
        backgroundColor: '#EEEEEE',
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: "5%",
        marginLeft: "5%",
        marginRight: "5%",
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
        paddingTop: 12,
        alignSelf: 'center',
        paddingLeft: 5,
        color: "#00ADB5",
        zIndex: 1,
    },
});
