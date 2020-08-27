import React, {Component} from 'react';
import {View} from 'react-native';
import Navig from './Components/Navigation/Navig';
import Splash from './Components/Splash';
import AsyncStorage from '@react-native-community/async-storage';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {splash: false, InitialRouteStatus: ''};
  }
  SplashTimeout = async () => {
    let value = await AsyncStorage.getItem('UserStatus');
    setTimeout(() => {
      this.setState({splash: true, InitialRouteStatus: value});
    }, 1200);
  };
  componentDidMount() {
    this.SplashTimeout();
  }
  render() {
    return (
      <View style={{flex: 1}}>
        {!this.state.splash && <Splash />}
        {this.state.splash && (
          <Navig initialRoute={this.state.InitialRouteStatus} />
        )}
      </View>
    );
  }
}
