import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import HeaderButton from '../components/HeaderButton';

class DetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Goal Details',
      headerRight: (
        <HeaderButton
          iconName="edit"
          onPress={() => {
            // segueToEdit doesn't exist initially
            navigation.getParam('segueToEdit')();
          }}
        />
      )
    };
  };

  render() {
    return (
      <View>
        <Text>Details</Text>
        <Button
          title="To Settings"
          onPress={() => this.props.navigation.navigate('List')}
        />
      </View>
    );
  }

  componentDidMount() {
    this.props.navigation.setParams({ segueToEdit: this.segueToEdit });
  }

  segueToEdit = () => {
    this.props.navigation.navigate('Edit', {
      id: this.props.navigation.getParam('id')
    });
  };
}

export default DetailsScreen;
