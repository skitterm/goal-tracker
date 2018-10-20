import React, { Component } from 'react';
import { StyleSheet, Text, View,  Button } from 'react-native';

class InitialScreen extends Component {
  static navigationOptions = {
      header: null
  };

  render() {
      return (
      <View>
          <Text>Initial</Text>
          <Button 
            title="To Settings"   
            onPress={() => this.props.navigation.navigate('List')}        
          />
      </View>
      );
  }
}

export default InitialScreen;