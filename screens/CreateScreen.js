import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class CreateScreen extends Component {
  static navigationOptions = {
    title: 'Create a Goal'
  };

  render() {
    return (
      <View>
        <Text>Create</Text>
        <Button title="Create Goal" onPress={this.createGoal} />
      </View>
    );
  }

  createGoal = () => {
    if (this.props.screenProps.database) {
      const goalMap = new Map([
        ['title', 'Brush teeth'],
        ['description', '2 minutes morning and night'],
        ['frequency', 'daily'],
        ['deadline', 1234567890],
        ['inProgress', 1],
        ['completed', 0],
        ['timesAchieved', 0],
        ['timesMissed', 0]
      ]);

      return this.props.screenProps.database
        .addRow('Goals', goalMap)
        .then(insertedId => {
          debugger;
        })
        .catch(error => {
          debugger;
        });
    }
  };
}

export default CreateScreen;
