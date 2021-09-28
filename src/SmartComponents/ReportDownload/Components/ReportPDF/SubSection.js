import React from 'react';
import propTypes from 'prop-types';
import { Text, View } from '@react-pdf/renderer';
import styles from './StyleSheet';

const SubSection = ({ children, metaTitle, title }) => {
  return (
    <View
      style={{
        marginBottom: '20pt',
      }}
    >
      <View
        style={{
          justifyContent: 'start',
        }}
      >
        <Text
          style={{
            ...styles.subSectionTitle,
            width: '70%',
          }}
        >
          {title}
        </Text>
        <Text>{metaTitle}</Text>
      </View>

      {children}
    </View>
  );
};

SubSection.propTypes = {
  children: propTypes.node,
  metaTitle: propTypes.string,
  title: propTypes.string,
};

export default SubSection;
