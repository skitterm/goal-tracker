import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SegmentedControlIOS,
  FlatList
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

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

  constructor() {
    super();
    this.state = {
      items: [],
      frequencyFilter: 'daily'
    };
  }

  render() {
    return (
      <View>
        <NavigationEvents onDidFocus={this.fetchItems} />
        <FlatList
          style={{ backgroundColor: 'white' }}
          data={this.state.items}
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
              onValueChange={this.onFilterChange}
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

    this.fetchItems();
  };

  fetchItems = () => {
    this.props.screenProps.database
      .readRows('Goals', {
        field: 'frequency',
        value: this.state.frequencyFilter
      })
      .then(items => {
        this.setState({
          items: items.map(item => {
            return {
              key: item.title
            };
          })
        });
      })
      .catch(error => {
        debugger;
      });
  };

  segueToCreate = () => {
    this.props.navigation.navigate('Create');
  };

  onFilterChange = value => {
    const filterOptions = {
      D: 'daily',
      W: 'weekly',
      M: 'monthly',
      '1x': 'one-time'
    };

    this.setState(
      {
        frequencyFilter: filterOptions[value]
      },
      () => {
        this.fetchItems();
      }
    );
  };
}

class SomethingElse extends Component {
  render() {
    return <View style={{ borderTopColor: '#eee', borderTopWidth: 1 }} />;
  }
}

export default ListScreen;
