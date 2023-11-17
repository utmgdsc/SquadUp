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
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);

    return (
        <View style={styles.container}>
            {/* Drop-down section */}
            <View style={styles.dropdownContainer}>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
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
                <TouchableOpacity style={styles.button}>
                    <AnimatedCircularProgress
                        size={80}
                        width={6}
                        fill={20} // Update this value based on your progress
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <AnimatedCircularProgress
                        size={80}
                        width={6}
                        fill={50}
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <AnimatedCircularProgress
                        size={80}
                        width={6}
                        fill={75}
                        tintColor="#00B127"
                        backgroundColor="#3d5875"
                    />
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
    button: {
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
});