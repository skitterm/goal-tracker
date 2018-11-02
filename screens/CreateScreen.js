import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Picker,
  DatePickerIOS,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';

class CreateScreen extends Component {
  static navigationOptions = {
    title: 'Create a Goal'
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      frequency: 'daily',
      deadline: new Date()
    };
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1
        }}
      >
        <TextInput
          placeholder="Goal title"
          style={styles.text}
          value={this.state.title}
          onChangeText={this.onTitleChange}
        />
        <TextInput
          placeholder="More about your goal..."
          style={[styles.text, styles.multilineText]}
          value={this.state.description}
          onChangeText={this.onDescriptionChange}
        />
        <View>
          <Picker
            selectedValue={this.state.frequency}
            onValueChange={this.onFrequencyChange}
          >
            <Picker.Item label="Daily" value="daily" />
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Monthly" value="monthly" />
            <Picker.Item label="One-time" value="one-time" />
          </Picker>
          <DatePickerIOS
            date={this.state.deadline}
            minimumDate={new Date()}
            onDateChange={this.onDeadlineChange}
            minuteInterval={30}
            style={{
              display: this.state.frequency === 'one-time' ? 'flex' : 'none'
            }}
          />
        </View>
        <Button
          title="Create Goal"
          disabled={this.state.title.length === 0}
          onPress={this.createGoal}
        />
      </KeyboardAvoidingView>
    );
  }

  onTitleChange = text => {
    this.setState({
      title: text
    });
  };

  onDescriptionChange = text => {
    this.setState({
      description: text
    });
  };

  onFrequencyChange = frequency => {
    this.setState({
      frequency
    });
  };

  onDeadlineChange = deadline => {
    this.setState({
      deadline
    });
  };

  createGoal = () => {
    if (this.props.screenProps.database) {
      const goalMap = new Map([
        ['title', this.state.title],
        ['description', this.state.description],
        ['frequency', this.state.frequency],
        ['deadline', this.state.deadline.getTime()],
        ['inProgress', 1],
        ['completed', 0],
        ['timesAchieved', 0],
        ['timesMissed', 0]
      ]);

      return this.props.screenProps.database
        .addRow('Goals', goalMap)
        .then(insertedId => {
          this.props.navigation.navigate('List');
        })
        .catch(error => {
          debugger;
        });
    }
  };
}

export default CreateScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 30,
    marginVertical: 10
  },
  multilineText: {
    fontSize: 18
  }
});
