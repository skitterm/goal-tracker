import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../utils/theme';

const HeaderButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={{ paddingHorizontal: 8 }}>
      <MaterialIcons
        name={props.iconName}
        size={theme.icon.size}
        color={theme.icon.colorPrimary}
      />
    </TouchableOpacity>
  );
};

export default HeaderButton;
