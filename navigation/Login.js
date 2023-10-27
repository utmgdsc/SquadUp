import {View, Text, Button, StyleSheet, TextInput, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
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
            <KeyboardAvoidingView behavior="padding"> 
                    <TextInput value = {email} style={styles.input} placeholder="Email" autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}> 
                    </TextInput>
                    <TextInput secureTextEntry={true} value= {password} style={styles.input} placeholder="Password" autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}>
                    </TextInput> 
                { loading ? <ActivityIndicator/> 
                    : <>
                    <Button title="Login" onPress={(signIn)}></Button>
                    <Button title="Register New Account" onPress={(signUp)}></Button>
                    </>
                }
            </KeyboardAvoidingView>
        </View>
    )
    
};

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 50,
        flex: 1,
        justifyContent: 'center',
        cornerRadius: 50,
    },
    input: {
        borderWidth: 1,
        borderColor: "#00ADB5",
        padding: 10,
        marginBottom: 3,
        backgroundColor: "#EEEEEE",
        borderRadius: 50,
        
    }



});