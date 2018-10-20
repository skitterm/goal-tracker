import React, { Component } from 'react';
import { StyleSheet, Text, View,  Button } from 'react-native';

class CreateScreen extends Component {
  static navigationOptions = {
      title: 'Create a Goal'
  };

  render() {
      return (
      <View>
          <Text>Create</Text>
          <Button 
            title="To Settings"            
            onPress={() => this.props.navigation.navigate('Edit')}  
          />
      </View>
      );
  }
}

export default CreateScreen;