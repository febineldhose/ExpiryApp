import React, {Component} from 'react';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {Validation, Messages} from './Subcomponets/Validation';
import {Icon} from 'react-native-elements';
import Activityindicator from './Subcomponets/ActivityIndicator';
export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Number: '',
      Password: '',
      error: false,
      numberError: '',
      AsyncData: '',
      LoginIsValid: '',
      loading: false,
    };
  }
  componentDidMount() {
    this.RetrieveData();
    this.onNavigationFoucus();
  }
  onNavigationFoucus() {
    this.props.navigation.addListener('focus', () => {
      this.RetrieveData();
    });
  }
  RetrieveData = async () => {
    let value = await AsyncStorage.getItem('UserDetail');
    let Parsedvalue = JSON.parse(value);
    this.setState({AsyncData: Parsedvalue});
  };
  onvalidation = () => {
    if (this.state.Number == '' || this.state.Password == '') {
      return false;
    } else {
      this.setState({numberError: ''});
    }
    if (this.state.Number.length < 10) {
      this.setState({numberError: Messages.numberValid});
      return false;
    }
    if (
      this.state.AsyncData == null ||
      this.state.Number !== this.state.AsyncData.Number ||
      this.state.Password !== this.state.AsyncData.Password
    ) {
      this.setState({
        LoginIsValid: Messages.LoginError,
      });
      return false;
    }
    return true;
  };
  onSaveUserDetail = async () => {
    try {
      this.setTimeOutFunctn(300);
      this.setState({error: true});
      await AsyncStorage.setItem('UserStatus', JSON.stringify(true));
      if (this.onvalidation()) {
        this.props.navigation.navigate('Main');
        ToastAndroid.show('Successfully Logined', 300);
      }
    } catch {
      alert('Some erorr occurs');
    }
  };
  setTimeOutFunctn = (time) => {
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false});
    }, time);
  };
  render() {
    const {error, LoginIsValid, Password, numberError} = this.state;
    let checkFor = '';
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <View style={Styles.QuartarView}>
          <Text style={{fontSize: 27, fontWeight: 'bold', color: 'white'}}>
            ExpiryApp
          </Text>
        </View>
        <View style={Styles.EditMainView}>
          <Text style={{marginVertical: 12, fontSize: 20}}>Login</Text>
          <Icon name="lock" size={18} />
          {Validation(
            LoginIsValid,
            Messages.LoginError,
            error,
            Messages.LoginError,
          )}
          <TextInput
            style={Styles.TextInput}
            placeholder="Phone Number"
            value={this.state.Number}
            maxLength={10}
            keyboardType="number-pad"
            onChangeText={(value) => {
              this.setState({
                Number: value,
                numberError: '',
                LoginIsValid: '',
              });
            }}
          />
          {Validation(this.state.Number, checkFor, error, Messages.number)}
          {Validation(
            numberError,
            Messages.numberValid,
            error,
            Messages.numberValid,
          )}
          <TextInput
            style={Styles.TextInput}
            placeholder="Password"
            value={this.state.Password}
            secureTextEntry={true}
            onChangeText={(value) => {
              this.setState({Password: value, LoginIsValid: ''});
            }}
          />
          {Validation(Password, checkFor, error, Messages.Password)}
          <Text onPress={() => this.props.navigation.navigate('Forgott')}>
            Forgott Password ?
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.onSaveUserDetail();
            }}>
            <View style={Styles.SignUpView}>
              <Text
                style={{
                  color: 'white',
                }}>
                Login
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <Text>New User ?</Text>
            <Text
              style={{color: 'blue'}}
              onPress={() => this.props.navigation.navigate('Registration')}>
              {' '}
              Register
            </Text>
          </View>
        </View>
        {this.state.loading && <Activityindicator />}
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  TextInput: {
    width: '80%',
    marginVertical: 5,
    borderBottomColor: 'blue',
    borderBottomWidth: 1,
    paddingLeft: 10,
  },
  QuartarView: {
    height: '25%',
    backgroundColor: '#1bcdb4',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 100,
  },
  EditMainView: {
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '75%',
  },
  LogoView: {
    height: 60,
    width: 100,
    borderRadius: 40,
    backgroundColor: '#BC4365',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    marginBottom: '10%',
  },
  SignUpView: {
    height: 40,
    width: 200,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DC4492',
    borderRadius: 50,
    padding: 12,
  },
});
