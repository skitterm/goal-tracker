import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ProgressBar from '../components/ProgressBar';

class InitialScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(params) {
    super(params);

    this.state = {
      items: []
    };
  }

  render() {
    const contextualUI =
      this.state.items.length > 0
        ? this.renderGoalHistoryUI()
        : this.renderWelcomeUI();

    return (
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            marginTop: 80,
            fontSize: 36,
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Goal Tracker
        </Text>
        {contextualUI}
      </View>
    );
  }

  componentDidMount() {
    this.fetchItems();
  }

  renderWelcomeUI = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            marginTop: 30,
            marginBottom: 60
          }}
        >
          Welcome! We're glad you're here. Click below to begin.
        </Text>
        <Button
          title="Create My First Goal"
          onPress={() => this.props.navigation.navigate('Edit')}
        />
      </View>
    );
  };

  renderGoalHistoryUI = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            marginTop: 30,
            marginBottom: 60
          }}
        >
          Welcome back!
        </Text>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Goal Summary</Text>
          <View style={{ marginVertical: 15, alignItems: 'center' }}>
            <Text style={{ marginBottom: 5, fontSize: 18 }}>Daily</Text>
            <ProgressBar percent={30} />
          </View>
          <View style={{ marginVertical: 15, alignItems: 'center' }}>
            <Text style={{ marginBottom: 5, fontSize: 18 }}>Weekly</Text>
            <ProgressBar percent={60} />
          </View>
          <View style={{ marginVertical: 15, alignItems: 'center' }}>
            <Text style={{ marginBottom: 5, fontSize: 18 }}>Monthly</Text>
            <ProgressBar percent={90} />
          </View>
          <View style={{ marginVertical: 15, alignItems: 'center' }}>
            <Text style={{ marginBottom: 5, fontSize: 18 }}>One-Time</Text>
            <ProgressBar percent={100} />
          </View>
        </View>
        <Button
          title="See My Goals"
          onPress={() => this.props.navigation.navigate('List')}
        />
      </View>
    );
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
}

export default InitialScreen;
