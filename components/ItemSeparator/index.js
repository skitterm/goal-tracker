import React from 'react';
import { View } from 'react-native';
import theme from '../../utils/theme';

const ItemSeparator = () => (
  <View style={{ borderTopColor: theme.color.border, borderTopWidth: 1 }} />
);

export default ItemSeparator;
