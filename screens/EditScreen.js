import React, { Component } from 'react';
import { StyleSheet, Text, View,  Button } from 'react-native';

class EditScreen extends Component {
  static navigationOptions = {
      title: 'Edit Goal'
  };

  render() {
      return (
      <View>
          <Text>Edit</Text>
          <Button 
            title="To Settings"            
            onPress={() => this.props.navigation.navigate('Initial')}  
          />
      </View>
      );
  }
}

export default EditScreen;