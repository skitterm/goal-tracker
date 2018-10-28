import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SegmentedControlIOS,
  FlatList
} from 'react-native';

class ListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Goals List',
      headerRight: (
        <Button
          title="Create"
          onPress={() => {
            // segueToCreate doesn't exist initially
            navigation.getParam('segueToCreate')();
          }}
        />
      )
    };
  };

  render() {
    return (
      <View>
        <FlatList
          style={{ backgroundColor: 'white' }}
          data={[
            { key: 'Brush Teeth' },
            { key: 'Eat Breakfast' },
            { key: 'Exercise' }
          ]}
          renderItem={({ item }) => (
            <Text
              style={{
                fontSize: 18,
                color: '#333',
                paddingVertical: 15,
                paddingHorizontal: 15
              }}
            >
              {item.key}
            </Text>
          )}
          ItemSeparatorComponent={SomethingElse}
          ListHeaderComponent={
            <SegmentedControlIOS
              style={{ marginHorizontal: 15, marginVertical: 10 }}
              values={['D', 'W', 'M', '1x']}
              selectedIndex={0}
            />
          }
        />
      </View>
    );
  }

  componentDidMount = () => {
    this.props.navigation.setParams({
      segueToCreate: this.segueToCreate
    });
  };

  segueToCreate = () => {
    this.props.navigation.navigate('Create');
  };
}

class SomethingElse extends Component {
  render() {
    return <View style={{ borderTopColor: '#eee', borderTopWidth: 1 }} />;
  }
}

export default ListScreen;
