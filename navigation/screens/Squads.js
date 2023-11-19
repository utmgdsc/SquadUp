import * as React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Table, Row } from 'react-native-table-component';
import DropDownPicker from 'react-native-dropdown-picker';

const tableDataSample = {
    tableHead: ['', 'S', 'M', 'T', 'W', 'T', 'F', 'S'],
    widthArr: [80, 70, 70, 70, 70, 70, 70, 70],
    tableData: [['Ryan', 'Gym', 'Rest', 'Rest', 'Sports', 'Gym', 'Rest', 'Rest'],
    ['Jay', 'Gym', 'Rest', 'Rest', 'Sports', 'Gym', 'Rest', 'Rest'],
    ['Waleed', 'Rest', 'Rest', 'Rest', 'Sports', 'Gym', 'Rest', 'Rest'],
    ['Karan', 'Rest', 'Rest', 'Rest', 'Rest', 'Gym', 'Rest', 'Rest'],
    ['Ishaan', 'Rest', 'Rest', 'Rest', 'Rest', 'Gym', 'Rest', 'Rest'],
    ]
};

export default function Squads() {
    const [data, setData] = React.useState(tableDataSample);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    // const [items, setItems] = useState([
    //     { label: 'RJW', value: 'RJW' },
    //     { label: 'SouthCommon', value: 'SouthCommon' },
    //     { label: 'CSC384', value: 'CSC384' },
    // ]);
    const [squadList, setSquadList] = React.useState([]);
    const [openSquadList, setOpenSquadList] = React.useState(false);
    const [valueSquadList, setValueSquadList] = React.useState(null);
    const [activeSquad, setActiveSquad] = React.useState(''); // This is the squad for which all info will be rendered 

    const handleAddNewSquad = () => {
        // Logic for adding a new squad
        // This is where you would add a new item to your list or perform any other necessary action
        console.log('Adding a new squad');
    };

    const handleJoinExistingSquad = () => {
        // Logic for joining an existing squad
        // This is where you would implement the logic for joining an existing squad
        
        console.log('Joining an existing squad');
    };

    React.useEffect(() => {
        const fetchUserSquads = async () => {
            try {
                const userSquads = await fetchSquadsForUser(userID);
                setSquadList([{ squadID: "", squadName: 'Personal'}, ...userSquads]);
            } catch (error) {
                console.error("Error fetching user's squads: ", error);
            }
        }
        fetchUserSquads();
    }, []);

    return (
        <View style={styles.container}>
            {/* Drop-down section */}
            <View style={styles.dropdownContainer}>
                <DropDownPicker
                    open={openSquadList}
                    value={valueSquadList}
                    setOpen={setOpen}
                    setValue={setValueSquadList}
                    items={items}
                    // setItems={setItems}
                    containerStyle={{ height: 50 }}
                    style={styles.picker}
                    dropDownStyle={{ backgroundColor: '#EEEEEE' }}
                    labelStyle={{
                        fontWeight: "bold",
                        textAlign: 'center', // Center-align the label text
                        fontSize: 30,
                    }}
                    textStyle={{
                        fontSize: 20,
                        fontFamily: 'Helvetica Neue',
                    }}
                    placeholder='Select a Squad'
                />
            </View>
            <Text style={styles.title}> Weekly Activity </Text>
            <ScrollView horizontal={true} style={styles.tableContainer}>
                <View>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#00ADB5' }}>
                        <Row
                            data={data.tableHead}
                            widthArr={data.widthArr}
                            style={styles.head}
                            textStyle={styles.headText}
                        />
                    </Table>
                    <ScrollView>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#00ADB5' }}>
                            {data.tableData.map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={rowData}
                                    widthArr={data.widthArr}
                                    style={styles.rowSection}
                                    textStyle={styles.text}
                                />
                            ))}
                        </Table>
                    </ScrollView>
                </View>
            </ScrollView>
            <Text style={styles.bottom}>Group Milestones </Text>
            <View style={styles.horizontalContainer}>
                <TouchableOpacity style={styles.circle_button}>
                    <AnimatedCircularProgress
                        size={80}
                        width={6}
                        fill={20} // Update this value based on your progress
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circle_button}>
                    <AnimatedCircularProgress
                        size={80}
                        width={6}
                        fill={50}
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circle_button}>
                    <AnimatedCircularProgress
                        size={80}
                        width={6}
                        fill={75}
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                    />
                </TouchableOpacity>
            </View>
            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddNewSquad}>
                    <Text style={styles.buttonText}>Add New Squad</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleJoinExistingSquad}>
                    <Text style={styles.buttonText}>Join Existing Squad</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        paddingBottom: 20,
    },
    container: { paddingTop: 80, backgroundColor: '#303841' },
    dropdownContainer: {
        backgroundColor: '#EEEEEE', // Background color for the drop-down section
        padding: 5,
        borderRadius: 10, // Add rounded corners
        margin: 10, // Add margin to separate from other components
    },
    picker: {
        backgroundColor: '#EEEEEE', // Background color for the drop-down
        borderColor: '#EEEEEE', // Border color to match the container background
    },
    rowSection: { height: 40, backgroundColor: '#303841' },
    head: { height: 44, backgroundColor: '#303841' },
    headText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white', fontFamily: 'Helvetica Neue' },
    text: { margin: 6, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white', fontFamily: 'Helvetica Neue' },
    tableContainer: {
        padding: 10,
        marginBottom: 12, // Adjust the marginBottom as needed
    },
    bottom: {
        fontSize: 25,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        paddingBottom: 10,
    },
    circle_button: {
        backgroundColor: '#EEEEEE',
        width: 80,
        height: 80,
        borderRadius: 50,
        marginTop: "5%",
        marginLeft: "5%",
        marginRight: "5%",
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // You can use 'space-around', 'space-evenly', or other justifying options
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 40,
        marginBottom: 50,
      },
      button: {
        backgroundColor: '#EEEEEE',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
      },
      buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
});