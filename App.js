import * as React from 'react';
import MainContainer from './navigation/MainContainer';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './navigation/Login';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';
import { useState, useEffect } from 'react';

const Stack = createNativeStackNavigator();
export default function App(){
  const [ user, setUser ] = useState(User | null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    })
  }, []);
  return(
  
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (<Stack.Screen name="MainContainer" component={MainContainer} options={{ headerShown:false }} />) : 
        (<Stack.Screen name="Login" component={Login} options={{ headerShown:false }} />)}
      </Stack.Navigator>
    </NavigationContainer>

  );
}