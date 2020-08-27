import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
const Activityindicator = () => (
  <View style={styles.container}>
    <ActivityIndicator size={40} color="blue" />
  </View>
);
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default Activityindicator;
