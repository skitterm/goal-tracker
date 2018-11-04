import React, { Component } from 'react';
import { Text, View, SegmentedControlIOS, FlatList } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import theme from '../utils/theme';
import SwipeableActionButton from '../components/SwipeableActionButton';
import HeaderButton from '../components/HeaderButton';

class ListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Goals List',
      headerRight: (
        <HeaderButton
          iconName="add"
          onPress={() => {
            // segueToEdit doesn't exist initially
            navigation.getParam('segueToEdit')();
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
    // for some reason doing this with state doesn't work (ref.current is null), so use instance variable instead
    this.swipedRefs = [];
  }

  render() {
    return (
      <View>
        <NavigationEvents
          onDidFocus={this.onDidFocus}
          onDidBlur={this.onDidBlur}
        />
        <FlatList
          style={{ backgroundColor: theme.color.background }}
          data={this.getFilteredItems()}
          renderItem={({ item }) => {
            // we only want to know about the rows that have been swiped, so create the ref here,
            // and if the item is swiped we'll hold onto it in this.swipedRefs.
            const ref = React.createRef();
            return (
              <Swipeable
                renderLeftActions={this.renderItemLeftActions.bind(
                  null,
                  item.id
                )}
                renderRightActions={this.renderItemRightActions.bind(
                  null,
                  item.id
                )}
                onSwipeableLeftOpen={this.onSwipedOpen.bind(null, ref)}
                onSwipeableRightOpen={this.onSwipedOpen.bind(null, ref)}
                overshootLeft={false}
                overshootRight={false}
                ref={ref}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: theme.text.colorPrimary,
                    backgroundColor: theme.color.background,
                    paddingVertical: 15,
                    paddingHorizontal: 15
                  }}
                >
                  {item.title}
                </Text>
              </Swipeable>
            );
          }}
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

  onSwipedOpen = ref => {
    const refs = this.swipedRefs.slice(0);
    refs.push(ref);
    this.swipedRefs = refs;
  };

  renderItemLeftActions = id => {
    return (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <SwipeableActionButton onPress={() => {}} iconName="check" />
        <SwipeableActionButton onPress={() => {}} iconName="close" />
      </View>
    );
  };

  renderItemRightActions = id => {
    return (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <SwipeableActionButton
          onPress={this.segueToEdit.bind(this, id)}
          iconName="edit"
        />
        <SwipeableActionButton
          onPress={() => {
            this.deleteItem(id);
          }}
          iconName="delete"
        />
      </View>
    );
  };

  deleteItem = id => {
    return this.props.screenProps.database
      .deleteRow('Goals', {
        field: 'id',
        value: id
      })
      .then(rowsAffected => {
        // if we actually deleted something, reload the list
        if (rowsAffected > 0) {
          this.fetchItems();
        }
      })
      .catch(error => {
        debugger;
      });
  };

  componentDidMount = () => {
    this.props.navigation.setParams({
      segueToEdit: this.segueToEdit
    });

    this.fetchItems();
  };

  onDidFocus = () => {
    this.setState({
      frequency: this.props.navigation.getParam('frequency', 'daily')
    });

    this.fetchItems();
  };

  onDidBlur = () => {
    // close all of the expanded swipeable rows
    for (let ref of this.swipedRefs) {
      ref.current && ref.current.close();
    }
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
        return Object.assign({}, item, { key: item.id.toString() });
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

  segueToEdit = id => {
    this.props.navigation.navigate('Edit', {
      id
    });
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
    return (
      <View style={{ borderTopColor: theme.color.border, borderTopWidth: 1 }} />
    );
  }
}

export default ListScreen;
