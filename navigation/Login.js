import {View, Text, StyleSheet, TextInput, ActivityIndicator, KeyboardAvoidingView, Pressable} from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';


const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    

    const auth = FIREBASE_AUTH;

    const goToRegister = () => {
        navigation.navigate('Register');
      }
    const signIn = async () => {
        setLoading(true);
        try {
            // email.trim();
            // password.trim();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful");

        } catch (error) {
            alert("Login failed: Invalid email or password");
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
                <Text style={styles.loginText}>Login</Text>
                <Text style={styles.signInText}>Sign into your account!</Text>
            </View>
            
            
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    
                        <TextInput value = {email} style={styles.textBox} placeholder="Email" autoCapitalize="none"
                        onChangeText={(text) => setEmail(text.trimEnd())}> 
                        </TextInput>
                        <TextInput secureTextEntry={true} value= {password} style={styles.textBox} placeholder="Password" autoCapitalize="none"
                        onChangeText={(text) => setPassword(text)}>
                        </TextInput> 
                    { loading ? <ActivityIndicator/> 
                        : <>
                    
                        <Pressable style= {styles.Login}  onPress={(signIn)}>
                        <Text style= {styles.buttonFont}>
                                Login  
                            </Text>
                            </Pressable>
                    
                        <Pressable style={styles.Register} title="Register New Account" onPress={(goToRegister)}>
                            <Text style= {styles.buttonFont}>
                                Register Now
                            </Text>

                        </Pressable>
                        </>
                    }
                </KeyboardAvoidingView>
            </View>
    )
    
};

export default Login;

const styles = StyleSheet.create({
    Login: {
        margin: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: "#00ADB5",
        fontFamily: "Helvetica Neue",
        height: 30,
        width: 100,
        borderRadius: 50,
        marginBottom: 10,
    },

    Register: {
        margin: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: "#00ADB5",
        fontFamily: "Helvetica Neue",
        height: 30,
        width: 150,
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

    loginText: {
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
        marginTop: 300,
    },

    circle: {
        height: 550,
        width: 600,
        borderRadius: 1550,
        marginTop: -300,
        marginBottom: 150,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: "#EEEEEE",
        opacity:0.95,
        flex: 1,
      }

});