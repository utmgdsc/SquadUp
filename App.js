import * as React from 'react';
import MainContainer from './navigation/MainContainer';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './navigation/Login';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';
import { useState, useEffect } from 'react';
import Register from './navigation/Register';

const Stack = createNativeStackNavigator();
export default function App(){
  
  const [ user, setUser ] = useState(User | null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      
    })
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen name="MainContainer" options={{ headerShown: false }}>
            {(props) => <MainContainer {...props} userId={user.uid} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        )}
        {user ? (
          <Stack.Screen name="MainContainer2" component={MainContainer} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}