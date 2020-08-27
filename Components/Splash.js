import React, {Component} from 'react';
import {View, Text} from 'react-native';
export default class Splash extends Component {
  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: '#1bcdb4',
        }}>
        <View
          style={{
            height: 90,
            width: 90,
            borderRadius: 45,
            backgroundColor: '#D33B2C',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 22}}>Exp</Text>
        </View>
      </View>
    );
  }
}
