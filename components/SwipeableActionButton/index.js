import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../utils/theme';

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
