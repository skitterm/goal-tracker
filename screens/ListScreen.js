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

  filterIndex = {
    daily: 0,
    weekly: 1,
    monthly: 2,
    'one-time': 3
  };

  constructor() {
    super();
    this.state = {
      items: [],
      frequency: 'daily'
    };
  }

  render() {
    return (
      <View>
        <NavigationEvents onDidFocus={this.onDidFocus} />
        <FlatList
          style={{ backgroundColor: 'white' }}
          data={this.getFilteredItems()}
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
              selectedIndex={this.filterIndex[this.state.frequency]}
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

  onDidFocus = () => {
    this.setState({
      frequency: this.props.navigation.getParam('frequency', 'daily')
    });
    this.fetchItems();
  };

  fetchItems = () => {
    this.props.screenProps.database
      .readAllRows('Goals')
      .then(items => {
        this.setState({
          items
        });
      })
      .catch(error => {
        debugger;
      });
  };

  getFilteredItems = () => {
    const comparator =
      this.state.frequency === 'one-time'
        ? this.dateComparator
        : this.alphabeticalComparator;

    return this.state.items
      .filter(item => item.frequency === this.state.frequency)
      .sort(comparator)
      .map(item => {
        return {
          key: item.title
        };
      });
  };

  alphabeticalComparator = (a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  };

  dateComparator = (a, b) => {
    return a.deadline - b.deadline;
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

    this.setState({
      frequency: filterOptions[value]
    });
  };
}

class SomethingElse extends Component {
  render() {
    return <View style={{ borderTopColor: '#eee', borderTopWidth: 1 }} />;
  }
}

export default ListScreen;
