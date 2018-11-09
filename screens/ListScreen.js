import React, { Component } from 'react';
import { Text, View, SegmentedControlIOS, SectionList } from 'react-native';
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
    const toDoItems = { title: 'To-Do', data: this.getFilteredItems(false) };
    const doneItems = { title: 'Done', data: this.getFilteredItems(true) };
    const sections = [];
    let showList = true;
    if (toDoItems.data.length) {
      sections.push(toDoItems);
    }
    if (doneItems.data.length) {
      sections.push(doneItems);
    }
    if (!toDoItems.data.length && !doneItems.data.length) {
      showList = false;
    }

    const mainContent = showList ? (
      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        renderSectionHeader={info => (
          <Text
            style={{
              fontWeight: 'bold',
              backgroundColor: '#eee',
              fontSize: 24,
              paddingVertical: 3,
              paddingHorizontal: 15
            }}
          >
            {info.section.title}
          </Text>
        )}
        renderItem={({ item }) => {
          // we only want to know about the rows that have been swiped, so create the ref here,
          // and if the item is swiped we'll hold onto it in this.swipedRefs.
          const ref = React.createRef();
          return (
            <Swipeable
              renderLeftActions={this.renderItemLeftActions.bind(null, item)}
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
      />
    ) : (
      this.renderEmptyList()
    );

    return (
      <View style={{ backgroundColor: theme.color.background, flex: 1 }}>
        <NavigationEvents
          onDidFocus={this.onDidFocus}
          onDidBlur={this.onDidBlur}
        />
        <SegmentedControlIOS
          style={{ marginHorizontal: 15, marginVertical: 10 }}
          values={['D', 'W', 'M', '1x']}
          selectedIndex={this.filterIndex[this.state.frequency]}
          onValueChange={this.onFilterChange}
        />
        {mainContent}
      </View>
    );
  }

  onSwipedOpen = ref => {
    const refs = this.swipedRefs.slice(0);
    refs.push(ref);
    this.swipedRefs = refs;
  };

  renderEmptyList = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 30,
          alignItems: 'center'
        }}
      >
        <Text style={{ fontSize: 20 }}>No goals here yet. Add one now!</Text>
      </View>
    );
  };

  renderItemLeftActions = item => {
    return item.completed ? null : (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <SwipeableActionButton
          onPress={this.completeItem.bind(this, item)}
          iconName="check"
        />
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

  getFilteredItems = getCompletedItems => {
    const comparator =
      this.state.frequency === 'one-time'
        ? this.dateComparator
        : this.alphabeticalComparator;

    return this.state.items
      .filter(item => item.frequency === this.state.frequency)
      .filter(item =>
        // SQLite stores booleans as 1s and 0s, not true/false
        getCompletedItems ? item.completed === 1 : item.completed === 0
      )
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

  completeItem = item => {
    if (this.props.screenProps.database) {
      return this.props.screenProps.database
        .updateRow(
          'Goals',
          [
            { name: 'completed', value: 1 },
            { name: 'inProgress', value: 0 },
            { name: 'timesAchieved', value: item.timesAchieved + 1 }
          ],
          {
            field: 'id',
            value: item.id
          }
        )
        .then(rowsAffected => {
          this.fetchItems();
        })
        .catch(error => {
          debugger;
        });
    }
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
