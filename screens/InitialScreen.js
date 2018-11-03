import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class InitialScreen extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View>
        <Text
          style={{
            marginTop: 80,
            fontSize: 36,
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Welcome to Goal Tracker!
        </Text>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            marginTop: 30,
            marginBottom: 60
          }}
        >
          We're glad you're here. Click below to begin.
        </Text>
        <Button
          title="Create My First Goal"
          onPress={() => this.props.navigation.navigate('Edit')}
        />
      </View>
    );
  }
}

export default InitialScreen;
