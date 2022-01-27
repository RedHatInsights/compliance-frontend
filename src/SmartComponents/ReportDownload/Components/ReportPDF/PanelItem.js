import React from 'react';
import propTypes from 'prop-types';
import { Text, View } from '@react-pdf/renderer';

// TODO: Move into pdf-generator components as option to render title at the bottom
const PanelItem = (props) => {
  const { children, title } = props;
  return (
    <View
      style={{
        justifyContent: 'space-evenly',
        width: '24%',
        paddingRight: '1%',
      }}
    >
      <View>
        <Text style={{ color: '#C9190B', fontSize: 20 }}>{children}</Text>
      </View>
      <Text>{title}</Text>
    </View>
  );
};

PanelItem.propTypes = {
  children: propTypes.node,
  title: propTypes.string,
};

export default PanelItem;
