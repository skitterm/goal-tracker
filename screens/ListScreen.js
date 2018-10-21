import React, { Component } from 'react';
import { StyleSheet, Text, View,  Button } from 'react-native';

class ListScreen extends Component {
  static navigationOptions = {
      title: 'Goals List'
  };

  render() {
      return (
      <View>
          <Text>List</Text>
          <Button 
            title="To Settings"            
            onPress={() => this.props.navigation.navigate('Details')}  
          />          
      </View>
      );
  }
}

export default ListScreen;