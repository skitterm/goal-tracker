import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import InitialScreen from './screens/InitialScreen';
import ListScreen from './screens/ListScreen';
import DetailsScreen from './screens/DetailsScreen';
import EditScreen from './screens/EditScreen';
import CreateScreen from './screens/CreateScreen';
import DatabaseWrapper from './utils/DatabaseWrapper';
import schema from './utils/schema';

const RootStack = createStackNavigator(
  {
    Initial: InitialScreen,
    List: ListScreen,
    Details: DetailsScreen,
    Edit: EditScreen,
    Create: CreateScreen
  },
  {
    initialRouteName: 'Create'
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
