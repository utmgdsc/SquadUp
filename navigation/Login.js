import {View, Text, Button, StyleSheet, TextInput, ActivityIndicator, KeyboardAvoidingView, Pressable} from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = FIREBASE_AUTH;


    const signIn = async () => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            alert("Login successful");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    const signUp = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            alert("Registration successful")
        } catch (error) {
            console.log(error);
            alert("Login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.circle}>
            <Text style={styles.squadup}>SquadUp!</Text>
            </View>
            <KeyboardAvoidingView behavior="padding"> 
                    <TextInput value = {email} style={styles.input1} placeholder="Email" autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}> 
                    </TextInput>
                    <TextInput secureTextEntry={true} value= {password} style={styles.input2} placeholder="Password" autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}>
                    </TextInput> 
                { loading ? <ActivityIndicator/> 
                    : <>
                   
                    <Pressable style= {styles.button}  onPress={(signIn)}>
                       <Text>
                            Login  
                        </Text>
                        </Pressable>
                   
                    
                    <Button title="Register New Account" onPress={(signUp)}/>
                    </>
                }
            </KeyboardAvoidingView>
            
        </View>
    )
    
};

export default Login;

const styles = StyleSheet.create({
    button: {
        margin: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: "#00ADB5",
        fontFamily: "Helvetica Neue",
        height: 30,
        width: 100,
        borderRadius: 50,
        marginBottom: 30,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        cornerRadius: 50,
        backgroundColor: "#303841",
    },
    
    input1: {
        borderWidth: 1,
        borderColor: "#00ADB5",
        padding: 15,
        marginBottom: 15,
        marginHorizontal: 50,
        backgroundColor: "#EEEEEE",
        borderRadius: 50,
        
    },
    input2: {
        borderWidth: 2,
        borderColor: "#00ADB5",
        padding: 15,
        marginBottom: 15,
        marginHorizontal: 50,
        backgroundColor: "#EEEEEE",
        borderRadius: 50,
        
    },
    squadup: {
        color: "#303841", 
        fontSize: 70, 
        fontFamily: "Helvetica Neue",
        fontWeight: "bold", 
        textAlign: "center", 
        marginTop: 300,
    },

    circle: {
        height: 550,
        width: 600,
        borderRadius: 1550,
        marginTop: -450,
        marginBottom: 250,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: "#EEEEEE",
        opacity:0.93,
        
      }


});