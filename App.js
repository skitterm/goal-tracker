import React, { Component } from 'react';
import { StyleSheet, Text, View,  Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import InitialScreen from './screens/InitialScreen';
import ListScreen from './screens/ListScreen';
import DetailsScreen from './screens/DetailsScreen';
import EditScreen from './screens/EditScreen';
import CreateScreen from './screens/CreateScreen';

const RootStack = createStackNavigator({
  Initial: InitialScreen,
  List: ListScreen,
  Details: DetailsScreen,
  Edit: EditScreen,
  Create: CreateScreen 
},
{
  initialRouteName: 'Initial'
});

class App extends Component {
  render() {
    return (
      <RootStack />
    );
  }
}

export default App;