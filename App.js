import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import DatabaseInit from './src/database/database-init';
import Home from './src/views/home';
import Login from './src/views/login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import pdfReader from './src/views/pdfReader';

const Stack = createNativeStackNavigator();
export default function App() {

  new DatabaseInit
  console.log("initialize database")


  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor="#EE7924"
      />
      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
        <Stack.Screen name="Home" options={{ title: 'Catálogo de Produtos', headerShown: false }} component={Home} />
        <Stack.Screen name="pdfReader" options={{ title: 'Comprovante' }} component={pdfReader} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
