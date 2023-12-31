import { View, Text, StyleSheet, TextInput, ActivityIndicator, KeyboardAvoidingView, Pressable } from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { addUser } from '../Database';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = FIREBASE_AUTH
    const signUp = async () => {
        setLoading(true);

        try {
            if (name == "" || email == "" || password == "") {
                alert("Registration Failed: Missing field(s)");
                return;
            }
            if (name.length > 15) {
                alert("Registration Failed: Name too long)");
                return;
            }
            setEmail(email.trim());
            setPassword(password.trim());
            setName(name.trim());
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            addUser(userCredential.user.uid, name);
            alert("Registration successful")
            navigation.navigate('MainContainer');
        } catch (error) {
            console.log(error);
            if (error.message.includes("auth/email-already-in-use")) {
                alert("Registration Failed: Email already in use");
            } else if (error.message.includes("auth/invalid-email")) {
                alert("Registration Failed: Invalid email");
            } else if (error.message.includes("auth/weak-password")) {
                alert("Registration Failed: Password must be at least 6 characters");
            } else if (error.message.includes("auth/missing-email")) {
                alert("Registration Failed: Missing email");
            } else if (error.message.includes("auth/missing-password")) {
                alert("Registration Failed: Missing password");
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <View style={styles.background}>
            <View style={styles.circle}>
                <Text style={styles.squadup}>SquadUp!</Text>
            </View>
            <View style={styles.fonts}>
                <Text style={styles.registerText}>Register</Text>
                <Text style={styles.signInText}>Create your new account!</Text>
            </View>


            <KeyboardAvoidingView behavior="padding">
                <TextInput value={name} style={styles.textBox} placeholder="Full Name" autoCapitalize="none"
                    onChangeText={(text) => setName(text)}>
                </TextInput>
                <TextInput value={email} style={styles.textBox} placeholder="Email" autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}>
                </TextInput>
                <TextInput secureTextEntry={true} value={password} style={styles.textBox} placeholder="Password" autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}>
                </TextInput>
                {loading ? <ActivityIndicator />
                    : <>
                        <Pressable style={styles.Register} onPress={(signUp)}>
                            <Text style={styles.buttonFont}>
                                Register New Account
                            </Text>
                        </Pressable>
                    </>
                }
            </KeyboardAvoidingView>
        </View>
    )
};

export default Register;

const styles = StyleSheet.create({
    Register: {
        margin: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: "#00ADB5",
        fontFamily: "Helvetica Neue",
        height: 30,
        width: 200,
        borderRadius: 50,
        marginBottom: 110,
    },

    buttonFont: {
        color: "#303841",
        fontSize: 15,
        fontFamily: "Helvetica Neue",
        fontWeight: "bold",
        textAlign: "center",
    },

    background: {
        flex: 1,
        justifyContent: 'center',
        cornerRadius: 50,
        backgroundColor: "#303841",
    },

    fonts: {
        marginBottom: 50,
    },

    registerText: {
        fontSize: 40,
        fontFamily: "Helvetica Neue",
        fontWeight: "bold",
        textAlign: "center",
        color: "#EEEEEE",
        marginBottom: 10,
    },

    signInText: {
        fontSize: 20,
        fontFamily: "Helvetica Neue",
        fontWeight: "bold",
        textAlign: "center",
        color: "#EEEEEE",
    },

    textBox: {
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
        marginTop: "65%",
    },

    circle: {
        height: "100%",
        width: "135%",
        borderRadius: "1000%",
        marginTop: "-85%",
        marginBottom: "33%",
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: "#EEEEEE",
        opacity: 0.95,
        flex: 1,
    }


});




