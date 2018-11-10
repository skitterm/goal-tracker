import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../utils/theme';

// Reusable button for the actions that are shown when swiping a list item left or right.
const SwipeableActionButton = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: theme.color.border
      }}
    >
      <MaterialIcons
        name={props.iconName}
        size={theme.icon.size}
        color={theme.icon.colorPrimary}
      />
    </TouchableOpacity>
  );
};

export default SwipeableActionButton;
