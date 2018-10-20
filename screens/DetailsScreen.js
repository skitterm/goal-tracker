import React, { Component } from 'react';
import { StyleSheet, Text, View,  Button } from 'react-native';

class DetailsScreen extends Component {
  static navigationOptions = {
      title: 'Goal Details'
  };

  render() {
      return (
      <View>
          <Text>Details</Text>
          <Button 
            title="To Settings"            
            onPress={() => this.props.navigation.navigate('Create')}  
          />
      </View>
      );
  }
}

export default DetailsScreen;