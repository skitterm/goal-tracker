import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import InitialScreen from './screens/InitialScreen';
import ListScreen from './screens/ListScreen';
import EditScreen from './screens/EditScreen';
import DatabaseWrapper from './utils/DatabaseWrapper';
import schema from './utils/schema';

// these will be the routes for the app
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
// entry component for the app
class App extends Component {
  constructor() {
    super();
    // initialize the database
    this.database = new DatabaseWrapper({ name: 'db.goalTracker' });
    this.database.addTable('Goals', schema);
  }

  render() {
    // create the stack for the navigation (routing), passing the database down to each screen as a prop
    return <RootStack screenProps={{ database: this.database }} />;
  }
}

export default App;
