import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import InitialScreen from './screens/InitialScreen';
import ListScreen from './screens/ListScreen';
import EditScreen from './screens/EditScreen';
import DatabaseWrapper from './utils/DatabaseWrapper';
import schema from './utils/schema';

const RootStack = createStackNavigator(
  {
    Initial: InitialScreen,
    List: ListScreen,
    Edit: EditScreen
  },
  {
    initialRouteName: 'Initial'
  }
);

class App extends Component {
  constructor() {
    super();
    this.database = new DatabaseWrapper({ name: 'db.goalTracker' });
    this.database.addTable('Goals', schema);
  }

  render() {
    return <RootStack screenProps={{ database: this.database }} />;
  }
}

export default App;
