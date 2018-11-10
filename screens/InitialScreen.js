import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import ProgressBar from '../components/ProgressBar';
import theme from '../utils/theme';

class InitialScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(params) {
    super(params);

    this.state = {
      items: [],
      isLoading: true
    };
  }

  render() {
    const contextualUI = this.state.isLoading
      ? this.renderLoading()
      : this.state.items.length > 0
      ? this.renderGoalHistoryUI()
      : this.renderWelcomeUI();

    return (
      <View
        style={{
          paddingHorizontal: 20,
          flex: 1
        }}
      >
        <NavigationEvents onWillFocus={this.onWillFocus} />
        <Text
          style={{
            marginTop: 80,
            fontSize: 48,
            color: theme.color.primary,
            fontStyle: 'italic',
            fontWeight: 'bold',
            textAlign: 'center',
            flexBasis: 'auto',
            flexGrow: 0,
            flexShrink: 0
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

  onWillFocus = () => {
    this.fetchItems();
  };

  renderLoading = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: 200
        }}
      >
        <ActivityIndicator size="large" color={theme.icon.colorPrimary} />
      </View>
    );
  };

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
          title="Start"
          onPress={() => this.props.navigation.navigate('List')}
        />
      </View>
    );
  };

  renderGoalHistoryUI = () => {
    const percentages = {
      daily: this.getPercentage('daily'),
      weekly: this.getPercentage('weekly'),
      monthly: this.getPercentage('monthly'),
      oneTime: this.getPercentage('one-time')
    };

    return (
      <View>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            marginTop: 30,
            marginBottom: 40
          }}
        >
          Welcome back!
        </Text>
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}
          >
            Goal Summary
          </Text>
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarText}>Daily</Text>
            <ProgressBar percent={percentages.daily} />
          </View>
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarText}>Weekly</Text>
            <ProgressBar percent={percentages.weekly} />
          </View>
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarText}>Monthly</Text>
            <ProgressBar percent={percentages.monthly} />
          </View>
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarText}>One-Time</Text>
            <ProgressBar percent={percentages.oneTime} />
          </View>
        </View>
        <Button
          title="See My Goals"
          onPress={() => this.props.navigation.navigate('List')}
        />
      </View>
    );
  };

  getPercentage = criteria => {
    const amountMade = this.state.items.filter(
      item => item.frequency === criteria && item.completed
    ).length;
    const amountTotal = this.state.items.filter(
      item => item.frequency === criteria
    ).length;

    return Math.floor((amountMade / amountTotal) * 100);
  };

  fetchItems = () => {
    this.setState({
      isLoading: true
    });
    this.props.screenProps.database
      .readAllRows('Goals')
      .then(items => {
        this.setState({
          items,
          isLoading: false
        });
      })
      .catch(error => {
        //
      });
  };
}

export default InitialScreen;

const styles = StyleSheet.create({
  progressBarContainer: {
    marginVertical: 15,
    alignItems: 'center'
  },
  progressBarText: {
    marginBottom: 5,
    fontSize: 18
  }
});
