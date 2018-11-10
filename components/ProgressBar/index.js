import React from 'react';
import { View } from 'react-native';

// a container that can be "filled" to a certain degree to show progress.
const ProgressBar = props => {
  const items = [];
  // fill color: show red if less than 1/3 filled, yellow if < 2/3 filled, green if more than that
  const backgroundColor =
    props.percent < 34 ? '#B33' : props.percent < 67 ? '#DD3' : '#3A3';

  for (let i = 0; i < 100; i++) {
    const filledStyles = {
      backgroundColor
    };

    const baseStyles = {
      height: '100%',
      flex: 1
    };

    // there are 100 "fill pieces" in the container.
    // for each one, if the percentage is higher than the current fill level, make the fill piece's background opaque.
    const styles =
      i + 1 <= props.percent
        ? Object.assign({}, baseStyles, filledStyles)
        : baseStyles;

    items.push(<View key={i} style={styles} />);
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: 20,
        width: '100%',
        borderColor: '#AAA',
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1
      }}
    >
      {items.map(item => item)}
    </View>
  );
};

export default ProgressBar;
