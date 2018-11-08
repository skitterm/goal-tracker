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
import HeaderButton from '../components/HeaderButton';

class EditScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title:
        typeof navigation.getParam('id') === 'number'
          ? 'Edit Goal'
          : 'Create a Goal',
      headerRight:
        typeof navigation.getParam('id') === 'number' ? (
          <HeaderButton
            iconName="delete"
            onPress={() => {
              // deleteItem doesn't exist initially
              navigation.getParam('deleteItem')();
            }}
          />
        ) : null
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      frequency: 'daily',
      deadline: new Date().getTime()
    };
  }

  render() {
    const saveButton = this.hasId() ? (
      <Button
        title="Update Goal"
        disabled={this.state.title.length === 0}
        onPress={this.updateItem}
      />
    ) : (
      <Button
        title="Create Goal"
        disabled={this.state.title.length === 0}
        onPress={this.createItem}
      />
    );

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
            date={new Date(this.state.deadline)}
            minimumDate={new Date()}
            onDateChange={this.onDeadlineChange}
            minuteInterval={30}
            style={{
              display: this.state.frequency === 'one-time' ? 'flex' : 'none'
            }}
          />
        </View>
        {saveButton}
      </KeyboardAvoidingView>
    );
  }

  componentDidMount() {
    if (this.hasId()) {
      this.props.screenProps.database
        .readRows('Goals', {
          field: 'id',
          value: this.props.navigation.getParam('id')
        })
        .then(results => {
          if (results && results.length > 0) {
            const result = results[0];
            this.setState({
              title: result.title,
              description: result.description,
              frequency: result.frequency,
              deadline: result.deadline
            });
          }
        })
        .catch(error => {
          debugger;
        });
    }

    this.props.navigation.setParams({
      deleteItem: this.deleteItem
    });
  }

  hasId = () => {
    return typeof this.props.navigation.getParam('id') === 'number';
  };

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
      deadline: deadline.getTime()
    });
  };

  createItem = () => {
    if (this.props.screenProps.database) {
      const goalMap = new Map([
        ['title', this.state.title],
        ['description', this.state.description],
        ['frequency', this.state.frequency],
        ['deadline', this.state.deadline],
        ['inProgress', 1],
        ['completed', 0],
        ['timesAchieved', 0],
        ['timesMissed', 0]
      ]);

      return this.props.screenProps.database
        .addRow('Goals', goalMap)
        .then(insertedId => {
          this.props.navigation.navigate('List', {
            frequency: this.state.frequency
          });
        })
        .catch(error => {
          debugger;
        });
    }
  };

  updateItem = () => {
    if (this.props.screenProps.database) {
      return this.props.screenProps.database
        .updateRow(
          'Goals',
          [
            { name: 'title', value: this.state.title },
            { name: 'description', value: this.state.description },
            { name: 'frequency', value: this.state.frequency },
            { name: 'deadline', value: this.state.deadline }
          ],
          {
            field: 'id',
            value: this.props.navigation.getParam('id')
          }
        )
        .then(rowsAffected => {
          this.props.navigation.navigate('List', {
            frequency: this.state.frequency
          });
        })
        .catch(error => {
          debugger;
        });
    }
  };

  deleteItem = () => {
    return this.props.screenProps.database
      .deleteRow('Goals', {
        field: 'id',
        value: this.props.navigation.getParam('id')
      })
      .then(rowsAffected => {
        this.props.navigation.navigate('List', {
          frequency: this.state.frequency
        });
      })
      .catch(error => {
        debugger;
      });
  };
}

export default EditScreen;

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
